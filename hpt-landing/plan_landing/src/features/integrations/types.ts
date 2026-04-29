export type IntegrationStatus = 'connected' | 'disconnected' | 'not_configured';

export interface OMSIntegration {
  id: string;
  name: string;
  type: string;
  status: IntegrationStatus;
  api_key?: string;
  config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OMSOrder {
  id: string;
  oms_integration_id: string;
  order_number: string;
  customer_name: string;
  product: string;
  amount: number;
  status: string;
  order_date: string;
  created_at: string;
  updated_at: string;
  details?: OMSOrderDetails;
}

export interface OMSOrderDetails {
  quantity: number;
  unit_price: number;
  discount: number;
  shipping_fee: number;
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  shipping_message?: string;
  payment_method: string;
  payment_date: string;
  shipping_company?: string;
  tracking_number?: string;
  product_options?: string;
  product_sku?: string;
}

export interface IntegrationSearchParams {
  status?: IntegrationStatus;
  type?: string;
}

export interface OrderSearchParams {
  oms_integration_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export type PanelWidthSetting = 'reference-only' | 'assist-and-reference';
