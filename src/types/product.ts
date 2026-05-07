export type ProductCategory = 'Audio' | 'Wearables' | 'Peripherals' | 'Displays' | 'Fitness';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imageAlt: string;
  rating: number;       // 0–5, supports decimals
  reviewCount: number;
  badge?: string;       // e.g. "New", "Sale", "Best Seller"
  inStock: boolean;
  category: ProductCategory;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export interface RatingStarsProps {
  rating: number;       // 0–5
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}
