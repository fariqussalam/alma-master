export interface Product {
  id: number;
  title: string;
  description: string;
  picture: string;
  price: number;
  sale: number;
  photos: ProductPhoto[];
}

export interface ProductPhoto {
  thumb: string;
  full: string;
  description: string;
}

export interface Mods {
  name: string;
  price: string;
}

export interface StoreState {
  products: Product[];
  selectedProduct: Product;
  modifications: Mods[];
  totalPrice: number;
}
