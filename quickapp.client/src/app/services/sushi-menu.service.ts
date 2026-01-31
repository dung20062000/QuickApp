// Sushi Menu Service

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { MenuResponse, MenuData, RestaurantInfo, SushiMenuItem, SushiCategory, RestaurantInfoResponse } from '../models/sushi-menu.model';
import { ConfigurationService } from './configuration.service';
import { EndpointBase } from './endpoint-base.service';

@Injectable({
  providedIn: 'root'
})
export class SushiMenuService extends EndpointBase {
  private http = inject(HttpClient);
  private configurations = inject(ConfigurationService);

  // API endpoints (sẵn sàng khi backend có)
  private get menuUrl() { return this.configurations.baseUrl + '/api/menu'; }
  private get restaurantInfoUrl() { return this.configurations.baseUrl + '/api/restaurant-info'; }

  // Flag để bật/tắt fake data (set false khi có API thật)
  private useFakeData = false;

  // Lấy toàn bộ menu (categories + items)
  // PUBLIC API - Không cần authentication
  getMenu(): Observable<MenuResponse> {
    if (this.useFakeData) {
      return of(this.getFakeMenuData()).pipe(delay(500));
    }

    // Sử dụng publicRequestHeaders cho public endpoint
    return this.http.get<MenuResponse>(this.menuUrl, this.publicRequestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getMenu());
      })
    );
  }

  // Lấy thông tin nhà hàng
  // PUBLIC API - Không cần authentication
  getRestaurantInfo(): Observable<RestaurantInfoResponse> {
    if (this.useFakeData) {
      return of(this.getFakeRestaurantInfo()).pipe(delay(300));
    }

    // Sử dụng publicRequestHeaders cho public endpoint
    return this.http.get<RestaurantInfoResponse>(this.restaurantInfoUrl, this.publicRequestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getRestaurantInfo());
      })
    );
  }

  // Lấy món ăn theo category
  // PUBLIC API - Không cần authentication
  getItemsByCategory(categoryId: string): Observable<SushiMenuItem[]> {
    if (this.useFakeData) {
      const menuData = this.getFakeMenuData().data;
      const numericId = parseInt(categoryId, 10);
      const items = menuData.items.filter((item: SushiMenuItem) => item.productCategoryId === numericId);
      return of(items).pipe(delay(300));
    }

    // Sử dụng publicRequestHeaders cho public endpoint
    const endpointUrl = `${this.menuUrl}/category/${categoryId}`;
    return this.http.get<SushiMenuItem[]>(endpointUrl, this.publicRequestHeaders).pipe(
      catchError(error => {
        return this.handleError(error, () => this.getItemsByCategory(categoryId));
      })
    );
  }

  // FAKE DATA - Dữ liệu mẫu để test (match với API response structure)
  private getFakeMenuData(): MenuResponse {
    const categories: SushiCategory[] = [
      {
        id: 1002,
        name: 'Nigiri Sushi',
        description: 'Traditional hand-pressed sushi',
        icon: '🍣'
      },
      {
        id: 1003,
        name: 'Maki Rolls',
        description: 'Rolled sushi with seaweed',
        icon: '🍱'
      },
      {
        id: 1004,
        name: 'Sashimi',
        description: 'Fresh sliced raw fish',
        icon: '🐟'
      },
      {
        id: 1005,
        name: 'Special Rolls',
        description: 'Chef\'s signature creations',
        icon: '⭐'
      },
      {
        id: 1006,
        name: 'Vegetarian',
        description: 'Plant-based options',
        icon: '🥒'
      }
    ];

    const items: SushiMenuItem[] = [
      // Nigiri Sushi
      {
        id: 1,
        name: 'Salmon Nigiri',
        nameVi: 'Nigiri Cá Hồi',
        description: 'Fresh Norwegian salmon on seasoned rice',
        descriptionVi: 'Cá hồi Na Uy tươi trên cơm trộn giấm',
        productCategoryId: 1002,
        categoryName: 'Nigiri Sushi',
        price: 45000,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Salmon', 'Sushi Rice', 'Wasabi'],
        ingredientsVi: ['Cá hồi', 'Cơm sushi', 'Wasabi'],
        rating: 4.8,
        reviews: 124
      },
      {
        id: 2,
        name: 'Tuna Nigiri',
        nameVi: 'Nigiri Cá Ngừ',
        description: 'Premium bluefin tuna',
        descriptionVi: 'Cá ngừ vây xanh cao cấp',
        productCategoryId: 1002,
        categoryName: 'Nigiri Sushi',
        price: 55000,
        imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Tuna', 'Sushi Rice', 'Wasabi'],
        ingredientsVi: ['Cá ngừ', 'Cơm sushi', 'Wasabi'],
        rating: 4.9,
        reviews: 98
      },
      {
        id: 3,
        name: 'Ebi Nigiri',
        nameVi: 'Nigiri Tôm',
        description: 'Cooked sweet shrimp',
        descriptionVi: 'Tôm ngọt luộc chín',
        productCategoryId: 1002,
        categoryName: 'Nigiri Sushi',
        price: 40000,
        imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        isPopular: false,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Shrimp', 'Sushi Rice'],
        ingredientsVi: ['Tôm', 'Cơm sushi'],
        rating: 4.6,
        reviews: 67
      },

      // Maki Rolls
      {
        id: 4,
        name: 'California Roll',
        nameVi: 'Maki California',
        description: 'Crab, avocado, cucumber',
        descriptionVi: 'Cua, bơ, dưa chuột',
        productCategoryId: 1003,
        categoryName: 'Maki Rolls',
        price: 75000,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Crab Stick', 'Avocado', 'Cucumber', 'Tobiko'],
        ingredientsVi: ['Thanh cua', 'Bơ', 'Dưa chuột', 'Trứng cá'],
        rating: 4.7,
        reviews: 156
      },
      {
        id: 5,
        name: 'Spicy Tuna Roll',
        nameVi: 'Maki Cá Ngừ Cay',
        description: 'Tuna with spicy mayo',
        descriptionVi: 'Cá ngừ với sốt mayonnaise cay',
        productCategoryId: 1003,
        categoryName: 'Maki Rolls',
        price: 85000,
        imageUrl: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Tuna', 'Spicy Mayo', 'Cucumber', 'Sesame'],
        ingredientsVi: ['Cá ngừ', 'Sốt mayo cay', 'Dưa chuột', 'Mè'],
        rating: 4.8,
        reviews: 143
      },

      // Sashimi
      {
        id: 6,
        name: 'Salmon Sashimi',
        nameVi: 'Sashimi Cá Hồi',
        description: '6 pieces of fresh salmon',
        descriptionVi: '6 miếng cá hồi tươi',
        productCategoryId: 1004,
        categoryName: 'Sashimi',
        price: 95000,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Premium Salmon'],
        ingredientsVi: ['Cá hồi cao cấp'],
        rating: 4.9,
        reviews: 201
      },
      {
        id: 7,
        name: 'Assorted Sashimi',
        nameVi: 'Sashimi Tổng Hợp',
        description: 'Chef\'s selection of 12 pieces',
        descriptionVi: 'Tuyển chọn 12 miếng của đầu bếp',
        productCategoryId: 1004,
        categoryName: 'Sashimi',
        price: 180000,
        imageUrl: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Salmon', 'Tuna', 'Yellowtail', 'Sea Bream'],
        ingredientsVi: ['Cá hồi', 'Cá ngừ', 'Cá bụng vàng', 'Cá chim'],
        rating: 5.0,
        reviews: 89
      },

      // Special Rolls
      {
        id: 8,
        name: 'Dragon Roll',
        nameVi: 'Maki Rồng',
        description: 'Eel, avocado topped with eel sauce',
        descriptionVi: 'Lươn, bơ phủ sốt lươn',
        productCategoryId: 1005,
        categoryName: 'Special Rolls',
        price: 120000,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isPopular: true,
        isNew: false,
        isVegetarian: false,
        ingredients: ['Eel', 'Avocado', 'Cucumber', 'Eel Sauce'],
        ingredientsVi: ['Lươn', 'Bơ', 'Dưa chuột', 'Sốt lươn'],
        rating: 4.9,
        reviews: 112
      },
      {
        id: 9,
        name: 'Rainbow Roll',
        nameVi: 'Maki Cầu Vồng',
        description: 'California roll topped with assorted fish',
        descriptionVi: 'Maki California phủ các loại cá',
        productCategoryId: 1005,
        categoryName: 'Special Rolls',
        price: 130000,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isPopular: true,
        isNew: true,
        isVegetarian: false,
        ingredients: ['Salmon', 'Tuna', 'Avocado', 'Crab'],
        ingredientsVi: ['Cá hồi', 'Cá ngừ', 'Bơ', 'Cua'],
        rating: 4.8,
        reviews: 95
      },
      {
        id: 10,
        name: 'Volcano Roll',
        nameVi: 'Maki Núi Lửa',
        description: 'Baked spicy seafood on California roll',
        descriptionVi: 'Hải sản cay nướng trên maki California',
        productCategoryId: 1005,
        categoryName: 'Special Rolls',
        price: 110000,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        isPopular: false,
        isNew: true,
        isVegetarian: false,
        ingredients: ['Crab', 'Shrimp', 'Spicy Mayo', 'Masago'],
        ingredientsVi: ['Cua', 'Tôm', 'Sốt mayo cay', 'Trứng cá'],
        rating: 4.7,
        reviews: 78
      },

      // Vegetarian
      {
        id: 11,
        name: 'Avocado Roll',
        nameVi: 'Maki Bơ',
        description: 'Fresh avocado with sesame',
        descriptionVi: 'Bơ tươi với mè',
        productCategoryId: 1006,
        categoryName: 'Vegetarian',
        price: 50000,
        imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
        isPopular: false,
        isNew: false,
        isVegetarian: true,
        ingredients: ['Avocado', 'Sesame', 'Sushi Rice'],
        ingredientsVi: ['Bơ', 'Mè', 'Cơm sushi'],
        rating: 4.5,
        reviews: 56
      },
      {
        id: 12,
        name: 'Veggie Tempura Roll',
        nameVi: 'Maki Rau Tempura',
        description: 'Assorted vegetables in tempura',
        descriptionVi: 'Rau tổng hợp chiên tempura',
        productCategoryId: 1006,
        categoryName: 'Vegetarian',
        price: 70000,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        isPopular: false,
        isNew: false,
        isVegetarian: true,
        ingredients: ['Sweet Potato', 'Zucchini', 'Carrot', 'Tempura Batter'],
        ingredientsVi: ['Khoai lang', 'Bí xanh', 'Cà rốt', 'Bột tempura'],
        rating: 4.6,
        reviews: 43
      }
    ];

    const menuData: MenuData = { categories, items };

    // Wrap trong API response structure
    return {
      message: 'Success',
      status: 1,
      data: menuData,
      totalRecords: items.length,
      errors: {}
    };
  }

  private getFakeRestaurantInfo(): RestaurantInfoResponse {
    const info: RestaurantInfo = {
      name: 'Muc Sushi House',
      description: 'Experience authentic Japanese cuisine with our chef\'s special creations. Fresh ingredients, traditional techniques, and modern presentation.',
      descriptionVi: 'Trải nghiệm ẩm thực Nhật Bản chính thống với những sáng tạo đặc biệt của đầu bếp. Nguyên liệu tươi ngon, kỹ thuật truyền thống và cách trình bày hiện đại.',
      phone: '+84 123 456 789',
      email: 'info@mucsushi.vn',
      address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
      addressVi: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      openHours: 'Mon-Sun: 10:00 AM - 10:00 PM',
      openHoursVi: 'T2-CN: 10:00 - 22:00',
      socialMedia: {
        facebook: 'https://facebook.com/mucsushi',
        instagram: 'https://instagram.com/mucsushi',
        twitter: 'https://twitter.com/mucsushi'
      }
    };
    return {
      message: 'Success',
      status: 1,
      data: info,
      totalRecords: 0,
      errors: {}
    };
  }
}
