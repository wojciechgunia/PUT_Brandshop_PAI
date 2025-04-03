export interface PrimitiveProduct {
  name: string;
  price: number;
  createAt: string;
  imageUrl: string;
  mainDesc: string;
}

export interface GetProductResponse {
  products: PrimitiveProduct[];
  totalCount: number;
}

export interface GetProductAdminResponse {
  products: Product[];
  totalCount: number;
}

export interface Product {
  uid: string;
  name: string;
  price: number;
  createAt: string;
  mainDesc: string;
  activate: boolean;
  descHtml: string;
  imageUrls: string[];
  parameters: string;
  categoryDTO: {
    name: string;
    shortId: string;
  };
}

export interface AddProductData {
  name: string;
  mainDesc: string;
  descHtml: string;
  price: number;
  imagesUid: string[];
  parameters: string;
  category: string;
}

export interface PostProductResponse {
  timestamp: string;
  message: string;
}

export interface ProductResponse {
  timestamp: string;
  message: string;
}
