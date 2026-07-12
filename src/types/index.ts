export interface CartItem {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  flavor: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACCEPTED'
  | 'PACKED'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
