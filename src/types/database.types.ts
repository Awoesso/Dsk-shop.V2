export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string | null;
          description: string | null;
          price: number;
          currency: string | null;
          category: string | null;
          status: string | null;
          view_count: number | null;
          sales_count: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug?: string | null;
          description?: string | null;
          price: number;
          currency?: string | null;
          category?: string | null;
          status?: string | null;
          view_count?: number | null;
          sales_count?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          slug?: string | null;
          description?: string | null;
          price?: number;
          currency?: string | null;
          category?: string | null;
          status?: string | null;
          view_count?: number | null;
          sales_count?: number | null;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          created_at: string;
          product_id: string;
          storage_path: string;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          product_id: string;
          storage_path: string;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          product_id?: string;
          storage_path?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          shipping_address: string;
          city: string | null;
          total_amount: number;
          currency: string | null;
          payment_method: string | null;
          payment_status: string | null;
          order_status: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          order_number?: string;
          customer_name: string;
          customer_phone: string;
          shipping_address: string;
          city?: string | null;
          total_amount: number;
          currency?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          order_status?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          order_number?: string;
          customer_name?: string;
          customer_phone?: string;
          shipping_address?: string;
          city?: string | null;
          total_amount?: number;
          currency?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          order_status?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          created_at: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          selected_variant: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          selected_variant?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          selected_variant?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          message: string;
          type: string | null;
          is_read: boolean;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          message: string;
          type?: string | null;
          is_read?: boolean;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          message?: string;
          type?: string | null;
          is_read?: boolean;
          metadata?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_order_with_items: {
        Args: {
          p_order_number: string;
          p_customer_name: string;
          p_customer_phone: string;
          p_shipping_address: string;
          p_city?: string;
          p_total_amount?: number;
          p_currency?: string;
          p_payment_method?: string;
          p_payment_status?: string;
          p_order_status?: string;
          p_notes?: string | null;
          p_items?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type DbProduct = Database['public']['Tables']['products']['Row'];
export type DbProductInsert = Database['public']['Tables']['products']['Insert'];
export type DbProductUpdate = Database['public']['Tables']['products']['Update'];

export type DbProductImage = Database['public']['Tables']['product_images']['Row'];
export type DbProductImageInsert = Database['public']['Tables']['product_images']['Insert'];
export type DbProductImageUpdate = Database['public']['Tables']['product_images']['Update'];

export type DbProfile = Database['public']['Tables']['profiles']['Row'];

export type DbOrder = Database['public']['Tables']['orders']['Row'];
export type DbOrderInsert = Database['public']['Tables']['orders']['Insert'];
export type DbOrderUpdate = Database['public']['Tables']['orders']['Update'];

export type DbNotification = Database['public']['Tables']['notifications']['Row'];
export type DbNotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type DbNotificationUpdate = Database['public']['Tables']['notifications']['Update'];

