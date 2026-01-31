// Sushi Menu Models

export interface SushiCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SushiMenuItem {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  isPopular: boolean;
  isNew: boolean;
  isVegetarian: boolean;
  ingredients: string[];
  ingredientsVi: string[];
  rating: number;
  reviews: number;
}

export interface MenuResponse {
  categories: SushiCategory[];
  items: SushiMenuItem[];
}

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
  };
}
