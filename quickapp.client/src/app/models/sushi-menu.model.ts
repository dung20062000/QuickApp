// Sushi Menu Models

export interface SushiCategory {
  id: number;
  name: string;
  description: string | null;
  icon?: string;
}

export interface SushiMenuItem {
  id: number;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  productCategoryId: number; // API trả về productCategoryId, không phải categoryId
  categoryName: string; // Tên category từ API
  price: number;
  imageUrl: string | null;
  isPopular: boolean;
  isNew: boolean;
  isVegetarian: boolean;
  ingredients: string[];
  ingredientsVi: string[];
  rating: number;
  reviews: number;
}

// API Response wrapper từ backend
export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
  totalRecords: number;
  errors: Record<string, unknown>;
}

// Menu data structure
export interface MenuData {
  categories: SushiCategory[];
  items: SushiMenuItem[];
}

// Menu response type (wrapped trong API response)
export type MenuResponse = ApiResponse<MenuData>;

export interface RestaurantInfo {
  name: string;
  description: string;
  descriptionVi: string;
  phone: string;
  email: string;
  address: string;
  addressVi: string;
  openHours: string;
  openHoursVi: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}

export type RestaurantInfoResponse = ApiResponse<RestaurantInfo>;
