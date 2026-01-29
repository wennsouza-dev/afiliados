export interface CategoryItem {
  id: string;
  name: string;
  subcategories: string[];
}

export interface Banner {
  id: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  affiliateUrl: string;
  description: string;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
}

export enum Category {
  ALL = 'Tudo',
  ELECTRONICS = 'Eletrônicos',
  HOME = 'Casa',
  FASHION = 'Moda',
  BEAUTY = 'Beleza'
}

export interface AppState {
  products: Product[];
  favorites: string[];
  categories: CategoryItem[];
  banners: Banner[];
}
