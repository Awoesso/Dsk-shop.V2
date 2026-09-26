import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { sanitizeText, handleSecureError } from '../utils/security';
import {
  CreateOrderPayload,
  CreateOrderResult,
  OrderRecord,
  OrderItemRecord,
} from '../types/orders';

const isDev = Boolean(
  (typeof import.meta !== 'undefined' && import.meta?.env?.DEV) ||
  (typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production')
);

export const OrdersService = {
  /**
   * Creates a new customer order and associated order_items directly for guest visitors.
   * Multi-stage pipeline respecting PostgREST transaction limitations and RLS constraints:
   * 1. Pre-flight client validation (step: 'validation')
   * 2. Header creation in 'orders' SANS .select() (step: 'order_header')
   * 3. Items creation in 'order_items' SANS .select() with fallback resilience (step: 'order_items')
   * 4. Compensating cleanup and clear error reporting if order items insertion fails
   */
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResult> {
    // -------------------------------------------------------------
    // ÉTAPE 1 : VALIDATION PRÉALABLE STRICTE (Fail-Fast)
    // -------------------------------------------------------------
    const sanitizedName = sanitizeText(payload.customer_name?.trim() || '');
    const sanitizedPhone = sanitizeText(payload.customer_phone?.trim() || '');
    const sanitizedAddress = sanitizeText(payload.shipping_address?.trim() || '');
    const sanitizedCity = sanitizeText(payload.city?.trim() || 'Lomé');
    const sanitizedNotes = payload.notes ? sanitizeText(payload.notes.trim()) : null;

    if (!sanitizedName || sanitizedName.length < 2) {
      return {
        success: false,
        orderId: '',
        orderNumber: '',
        step: 'validation',
        error: 'Veuillez renseigner votre nom complet valide.',
      };
    }

    if (!sanitizedPhone || sanitizedPhone.length < 6) {
      return {
        success: false,
        orderId: '',
        orderNumber: '',
        step: 'validation',
        error: 'Veuillez renseigner un numéro de téléphone valide (ex. +228 90 12 34 56).',
      };
    }

    if (!sanitizedAddress || sanitizedAddress.length < 3) {
      return {
        success: false,
        orderId: '',
        orderNumber: '',
        step: 'validation',
        error: 'Veuillez indiquer une adresse ou un quartier de livraison précis à Lomé.',
      };
    }

    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      return {
        success: false,
        orderId: '',
        orderNumber: '',
        step: 'validation',
        error: 'Votre panier est vide. Veuillez sélectionner au moins un article.',
      };
    }

    // Validation préalable de chaque article avant toute requête réseau
    for (let i = 0; i < payload.items.length; i++) {
      const item = payload.items[i] as any;
      const isCartItem = Boolean(item.product);
      const name = isCartItem ? item.product?.name : item.product_name;
      const quantity = isCartItem ? item.quantity : item.quantity;
      const price = isCartItem
        ? Number(item.product?.price || 0) + Number(item.selectedVariant?.priceModifier || 0)
        : Number(item.unit_price || 0);

      if (!name || String(name).trim() === '') {
        return {
          success: false,
          orderId: '',
          orderNumber: '',
          step: 'validation',
          error: `L'article n°${i + 1} du panier ne possède pas de désignation valide.`,
        };
      }
      if (!Number.isFinite(quantity) || quantity < 1) {
        return {
          success: false,
          orderId: '',
          orderNumber: '',
          step: 'validation',
          error: `La quantité pour « ${name} » doit être d'au moins 1 unité.`,
        };
      }
      if (!Number.isFinite(price) || price < 0) {
        return {
          success: false,
          orderId: '',
          orderNumber: '',
          step: 'validation',
          error: `Le prix unitaire pour « ${name} » est invalide.`,
        };
      }
    }

    const orderNumber = `DSK-${Math.floor(100000 + Math.random() * 900000)}`;

    const isUuid = (val: any): boolean =>
      Boolean(val) &&
      typeof val === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());

    const generateClientUuid = (): string => {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const orderId = generateClientUuid();

    // -------------------------------------------------------------
    // ÉTAPE 2 : INSERTION DE L'EN-TÊTE DANS 'orders'
    // En conformité avec les règles RLS (aucun .select() pour éviter
    // le déclenchement du RETURNING PostgREST et l'erreur RLS 42501)
    // -------------------------------------------------------------
    try {
      const { error: orderInsertError } = await (supabase
        .from('orders')
        .insert({
          id: orderId,
          order_number: orderNumber,
          customer_name: sanitizedName,
          customer_phone: sanitizedPhone,
          shipping_address: sanitizedAddress,
          city: sanitizedCity,
          total_amount: Math.max(0, Math.round(Number(payload.total_amount) || 0)),
          currency: payload.currency || 'XOF',
          payment_method: payload.payment_method || 'cash_on_delivery',
          payment_status: payload.payment_status || 'pending',
          order_status: payload.order_status || 'pending',
          notes: sanitizedNotes,
        } as any));

      if (orderInsertError) {
        handleSecureError(orderInsertError, 'OrdersService.createOrder [order_header]');
        return {
          success: false,
          orderId: '',
          orderNumber,
          step: 'order_header',
          error: `Échec de l'enregistrement de la commande (${orderInsertError.message || 'Erreur base de données'}). Veuillez vérifier vos informations et réessayer.`,
          details: orderInsertError.message,
        };
      }
    } catch (orderException: any) {
      handleSecureError(orderException, 'OrdersService.createOrder [order_header exception]');
      return {
        success: false,
        orderId: '',
        orderNumber,
        step: 'order_header',
        error: orderException?.message || "Impossible de contacter le serveur pour créer la commande. Vérifiez votre connexion.",
        details: orderException?.message,
      };
    }

    // -------------------------------------------------------------
    // ÉTAPE 3 : INSERTION DES ARTICLES DANS 'order_items'
    // Ici l'en-tête de commande EXISTE déjà en base de données.
    // Si l'insertion échoue, gestion d'erreur robuste et compensation.
    // -------------------------------------------------------------
    const orderItemsRows = (payload.items as any[]).map((item: any) => {
      const isCartItem = Boolean(item.product);
      const rawId = isCartItem ? item.product?.id : item.product_id;
      const validProductId = isUuid(rawId) ? String(rawId).trim() : null;
      const productName = isCartItem ? item.product?.name : item.product_name;
      const unitPrice = isCartItem
        ? Number(item.product?.price || 0) + Number(item.selectedVariant?.priceModifier || 0)
        : Number(item.unit_price || 0);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const variant = isCartItem
        ? item.selectedVariant?.name || null
        : item.selected_variant || null;

      return {
        order_id: orderId,
        product_id: validProductId,
        product_name: sanitizeText(productName || 'Article'),
        unit_price: Math.max(0, Math.round(unitPrice)),
        quantity,
        selected_variant: variant ? sanitizeText(variant) : null,
      };
    });

    try {
      const { error: primaryItemsError } = await (supabase
        .from('order_items')
        .insert(orderItemsRows as any));

      if (primaryItemsError) {
        // En cas de contrainte de clé étrangère 23503 (ex. product_id absent de la table products distante),
        // seconde tentative de résilience en passant product_id à null pour préserver l'historique d'achat
        let effectiveItemsError: any = primaryItemsError;

        if (primaryItemsError.code === '23503') {
          if (isDev) {
            console.warn(
              '[OrdersService] Foreign key constraint on product_id. Retrying order_items with product_id=null...',
              primaryItemsError.message
            );
          }
          const fallbackRows = orderItemsRows.map((r) => ({ ...r, product_id: null }));
          const { error: retryError } = await (supabase
            .from('order_items')
            .insert(fallbackRows as any));

          if (!retryError) {
            effectiveItemsError = null;
          } else {
            effectiveItemsError = retryError;
          }
        }

        // Si l'insertion des articles échoue définitivement :
        if (effectiveItemsError) {
          handleSecureError(effectiveItemsError, 'OrdersService.createOrder [order_items]');

          // Tentative de compensation / rollback (nettoyage de la commande orpheline)
          // Protégé par try/catch car selon les policies RLS actuelles, anon peut ne pas avoir
          // la permission DELETE, ce qui ne doit jamais occulter l'erreur principale des articles.
          try {
            await supabase.from('orders').delete().eq('id', orderId);
            if (isDev) {
              console.log(`[OrdersService] Rollback: Orphaned order ${orderId} deletion requested.`);
            }
          } catch (cleanupException) {
            if (isDev) {
              console.warn('[OrdersService] Rollback cleanup suppressed by RLS or network:', cleanupException);
            }
          }

          const failureReason = effectiveItemsError.message || 'Erreur de liaison des articles';
          return {
            success: false,
            orderId,
            orderNumber,
            step: 'order_items',
            error: `Votre commande n°${orderNumber} a été initiée mais l'enregistrement de ses articles a échoué (${failureReason}). Veuillez contacter l'assistance au +228 90 00 00 00 avec cette référence.`,
            details: failureReason,
          };
        }
      }

      // -------------------------------------------------------------
      // ÉTAPE 4 : SUCCÈS COMPLET
      // -------------------------------------------------------------
      return {
        success: true,
        orderId,
        orderNumber,
        step: null,
        error: null,
        details: null,
      };
    } catch (itemsException: any) {
      handleSecureError(itemsException, 'OrdersService.createOrder [order_items exception]');

      // Compensation sur exception inattendue
      try {
        await supabase.from('orders').delete().eq('id', orderId);
      } catch {
        // Ignorer l'erreur de rollback
      }

      return {
        success: false,
        orderId,
        orderNumber,
        step: 'order_items',
        error: `Votre commande n°${orderNumber} a été initiée mais une erreur réseau est survenue lors de l'ajout des articles (${itemsException?.message || 'Erreur inattendue'}). Contactez le service client avec votre référence.`,
        details: itemsException?.message,
      };
    }
  },

  /**
   * Retrieves all orders with their associated order_items, ordered by created_at DESC.
   */
  async getOrders(): Promise<{ data: OrderRecord[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_phone,
          shipping_address,
          city,
          total_amount,
          currency,
          payment_method,
          payment_status,
          order_status,
          notes,
          created_at,
          order_items:order_items (
            id,
            order_id,
            product_id,
            product_name,
            unit_price,
            quantity,
            selected_variant,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: (data as any) || [], error: null };
    } catch (err: any) {
      return { data: [], error: err?.message || 'Erreur lors du chargement des commandes.' };
    }
  },

  /**
   * Retrieves a single order by its ID or order_number with its items.
   */
  async getOrderById(idOrNumber: string): Promise<{ data: OrderRecord | null; error: string | null }> {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        idOrNumber
      );

      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_phone,
          shipping_address,
          city,
          total_amount,
          currency,
          payment_method,
          payment_status,
          order_status,
          notes,
          created_at,
          order_items:order_items (
            id,
            order_id,
            product_id,
            product_name,
            unit_price,
            quantity,
            selected_variant,
            created_at
          )
        `);

      if (isUuid) {
        query = query.eq('id', idOrNumber);
      } else {
        query = query.eq('order_number', idOrNumber);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: (data as any) || null, error: null };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Erreur lors de la récupération de la commande.' };
    }
  },

  /**
   * Updates the order status (e.g. pending -> processing -> completed -> cancelled).
   */
  async updateOrderStatus(
    orderId: string,
    status: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await (supabase
        .from('orders')
        .update({ order_status: status } as any)
        .eq('id', orderId));

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erreur lors de la mise à jour du statut.' };
    }
  },

  /**
   * Supabase Realtime subscription to the 'orders' table.
   * Listens for INSERT and UPDATE postgres_changes.
   * Cleans up channel on unmount via removeChannel.
   */
  subscribeToOrders(
    onOrderChange: (event: {
      eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      newRow: any;
      oldRow: any;
    }) => void
  ): () => void {
    const channelId = `dsk-orders-realtime-${Math.random().toString(36).substring(2, 9)}`;

    const channel: RealtimeChannel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          onOrderChange({
            eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            newRow: payload.new,
            oldRow: payload.old,
          });
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' && isDev) {
          console.warn('[OrdersService] Realtime channel error on orders:', err?.message);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
