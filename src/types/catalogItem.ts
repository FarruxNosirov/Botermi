export interface CatalogItemType {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image: string;
}
export interface CatalogPraductItemType {
  id: number | string;
  name: string;
  slug: string;
  order: number;
  image: string;
  categories: Category[];
}

export interface Category {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image: string;
}
export interface ManufacturerItemType {
  id: number | any;
  name: string;
  image: string;
}
