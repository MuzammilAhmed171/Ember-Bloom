import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: number;
}

export interface RecentlyViewed {
  product: Product;
  viewedAt: number;
}
