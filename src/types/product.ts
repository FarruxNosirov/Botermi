export interface Product {
  id: number | string;
  name: string;
  brand: string;
  brand_id: number | string;
  image: string;
  price: number | string;
  customer_price?: number | string;
  bonus: number;
  percentage_of_bonus?: number;
  manufacturer: string;
  manufacturer_id: number | string;
  vendor_code?: string;
  foto_gallary?: string[];
  brands: Brand[];
}

export interface PrizeType {
  id: number;
  name: string;
  price: number;
  image: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}
export interface PraductsResponse {
  products: {
    data: Product[];
  };
}
export interface ProductDetailsType {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  vendor_code?: string;
  price: string;
  customer_price: string;
  to_order: number;
  country?: string;
  in_stock: string;
  amount_of_product: any;
  description?: string;
  image: string;
  foto_gallary?: string[];
  percentage_of_bonus?: number;
  brands?: Brand[];
  category_products?: Product[];
}

export interface Brand {
  id: number;
  name: string;
  image: string;
}
export interface BlogsType {
  id: number;
  name: string;
  slug: string;
  text: string;
  image: string;
  link: string;
}
