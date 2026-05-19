// BlogPost Model - TypeScript interface matching BlogPostVM.cs

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnailImage?: string | null;
  publishedDate?: Date | string | null;
  isAvailable: boolean;
  createdBy?: string | null;
  createdDate: Date | string;
  updatedBy?: string | null;
  updatedDate: Date | string;
}

export interface BlogPostSearchRequest {
  title?: string;
  slug?: string;
  content?: string;
  thumbnailImage?: string | null;
  isAvailable?: boolean | null;
  publishedDateFrom?: Date | string | null;
  publishedDateTo?: Date | string | null;
  pageIndex?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
}

export interface BlogPostSearchResponse {
  message: string;
  status: number;
  data: BlogPost[];
  totalRecords: number;
  errors: Record<string, string[]>;
}

export interface BlogPostResponse {
  message: string;
  status: number;
  data: BlogPost | null;
  totalRecords: number;
  errors: Record<string, string[]>;
}

export interface BlogPostFormData {
  title: string;
  slug?: string;
  content: string;
  thumbnail?: File | null;
  isAvailable: boolean;
  publishedDate?: Date | null;
  deleteThumbnail?: boolean;
}
