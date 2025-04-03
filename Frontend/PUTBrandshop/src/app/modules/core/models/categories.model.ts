export interface Category {
  name: string;
  shortId: string;
}

export type PostCategory = Omit<Category, 'shortId'>;

export interface GetCategoryAdminResponse {
  categories: Category[];
  totalCount: number;
}

export interface CategoryResponse {
  timestamp: string;
  message: string;
}
