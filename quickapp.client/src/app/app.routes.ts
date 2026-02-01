// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/sushi-home/sushi-home.component').then(m => m.SushiHomeComponent),
    title: 'Muc Sushi - Authentic Japanese Cuisine'
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
    title: 'Admin Dashboard'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [AuthGuard],
    title: 'Customers'
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuard],
    title: 'Products'
  },
  {
    path: 'orders',
    loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [AuthGuard],
    title: 'Orders'
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard],
    title: 'Settings'
  },
  {
    path: 'management/shop/restaurant-info',
    loadComponent: () => import('./components/categories/restaurant-info/restaurant-info.component').then(m => m.RestaurantInfoComponent),
    canActivate: [AuthGuard],
    title: 'Restaurant Information'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent),
    title: 'About Us'
  },
  // {
  //   path: 'home',
  //   redirectTo: '/',
  //   pathMatch: 'full'
  // },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];
