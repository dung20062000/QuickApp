import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SushiMenuService } from '../../services/sushi-menu.service';
import { SushiMenuItem, SushiCategory, RestaurantInfo } from '../../models/sushi-menu.model';

@Component({
  selector: 'app-sushi-home',
  templateUrl: './sushi-home.component.html',
  styleUrl: './sushi-home.component.scss',
  imports: [CommonModule]
})
export class SushiHomeComponent implements OnInit {
  private sushiMenuService = inject(SushiMenuService);
  private router = inject(Router);

  // Data properties
  categories: SushiCategory[] = [];
  menuItems: SushiMenuItem[] = [];
  filteredItems: SushiMenuItem[] = [];
  restaurantInfo: RestaurantInfo | null = null;

  // UI state
  selectedCategory: string = 'all';
  isLoading: boolean = false;
  currentLanguage: string = 'vi'; // 'vi' hoặc 'en'

  // Popular items for hero section
  get popularItems(): SushiMenuItem[] {
    return this.menuItems.filter(item => item.isPopular).slice(0, 3);
  }

  // New items
  get newItems(): SushiMenuItem[] {
    return this.menuItems.filter(item => item.isNew);
  }

  ngOnInit(): void {
    this.loadData();
  }

  // Load all data from service
  loadData(): void {
    this.isLoading = true;

    // Load menu
    this.sushiMenuService.getMenu().subscribe({
      next: (response) => {
        this.categories = response.categories;
        this.menuItems = response.items;
        this.filteredItems = response.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading menu:', error);
        this.isLoading = false;
      }
    });

    // Load restaurant info
    this.sushiMenuService.getRestaurantInfo().subscribe({
      next: (info) => {
        this.restaurantInfo = info;
      },
      error: (error) => {
        console.error('Error loading restaurant info:', error);
      }
    });
  }

  // Filter by category
  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;

    if (categoryId === 'all') {
      this.filteredItems = this.menuItems;
    } else {
      this.filteredItems = this.menuItems.filter(item => item.categoryId === categoryId);
    }

    // Smooth scroll to menu section
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Navigate to admin login
  goToAdminLogin(): void {
    this.router.navigate(['/login']);
  }

  // Toggle language
  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'vi' ? 'en' : 'vi';
  }

  // Get display name based on language
  getItemName(item: SushiMenuItem): string {
    return this.currentLanguage === 'vi' ? item.nameVi : item.name;
  }

  getItemDescription(item: SushiMenuItem): string {
    return this.currentLanguage === 'vi' ? item.descriptionVi : item.description;
  }

  getItemIngredients(item: SushiMenuItem): string[] {
    return this.currentLanguage === 'vi' ? item.ingredientsVi : item.ingredients;
  }

  // Format price
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
