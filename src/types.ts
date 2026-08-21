export interface Product {
  id: string;
  name: string;
  descriptor: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isOutOfStock?: boolean;
  ingredients?: string;
  howToUse?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
