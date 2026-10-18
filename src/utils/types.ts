export type EmailTemplateProps = {
  firstName?: string;
  transaction_id?: string;
  email?: string;
  payment_status?: string;
  products?: any[];
};

export type Product = {
  product?: any;
  id?: number;
  created_at?: any;
  name: string;
  category?: string;
  description?: string;
  image_url?: string | any;
  purchase?: string;
  mrp?: number;
  pretax?: number;
  tax?: number;
  price: number;
  inventory?: number;
  count?: number;
};

export type Order = {
  id: number;
  invoice_id: number;
  transaction_id: number;
  created_at: any;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  payment_status: string;
  delivery_status: string;
  amount: number;
  products: any;
};

export type CustomOrder = {
  invoice_id: number;
  transaction_id: string;
  razorpay_id: string;
  created_at: any;
  name?: string;
  phone?: string;
  address?: string;
  payment_status: string;
  delivery_status: string;
  amount: number;
  products: any;
};

export type User = {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  cartItems?: any[];
};
