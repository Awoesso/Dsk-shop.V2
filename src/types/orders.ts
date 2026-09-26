import { Json } from './database.types';

export interface OrderItemRecord {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_variant?: string | null;
  created_at?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
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
  created_at: string;
  order_items?: OrderItemRecord[];
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  city?: string;
  total_amount: number;
  currency?: string;
  payment_method?: string;
  payment_status?: string;
  order_status?: string;
  notes?: string;
  items: {
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    selected_variant?: string | null;
  }[];
}

export interface CreateOrderResult {
  success: boolean;
  orderId: string;
  orderNumber: string;
  error: string | null;
  step?: 'validation' | 'order_header' | 'order_items' | null;
  details?: string | null;
}
