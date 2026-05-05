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

  // ========== MANAGEMENT MODULE với Nested Routes & Breadcrumb ==========
  {
    path: 'management',
    loadComponent: () => import('./components/layouts/management-layout.component').then(m => m.ManagementLayoutComponent),
    canActivate: [AuthGuard],
    data: {
      // breadcrumb: {
      //   translateKey: 'Management',
      //   icon: 'fa fa-cog'
      // }
    },
    children: [
      {
        path: 'shop',
        data: {
          // breadcrumb: {
          //   translateKey: 'Shop',
          //   icon: 'fa fa-store'
          // }
        },
        children: [
          {
            path: 'restaurant-info',
            loadComponent: () => import('./components/categories/restaurant-info/restaurant-info.component').then(m => m.RestaurantInfoComponent),
            title: 'Restaurant Information',
            data: {
              breadcrumb: {
                translateKey: 'RestaurantInfo',
                icon: 'fa fa-building'
              }
            }
          },
          {
            path: 'restaurant-info/detail/:id',
            loadComponent: () => import('./components/categories/restaurant-info/restaurant-info.component').then(m => m.RestaurantInfoComponent),
            title: 'Restaurant Detail',
            data: {
              breadcrumb: {
                translateKey: 'Detail',
                icon: 'fa fa-info-circle'
              }
            }
          },
          {
            path: 'restaurant-info/create',
            loadComponent: () => import('./components/categories/restaurant-info/restaurant-info.component').then(m => m.RestaurantInfoComponent),
            title: 'Create Restaurant',
            data: {
              breadcrumb: {
                translateKey: 'CreateNew',
                icon: 'fa fa-plus-circle'
              }
            }
          },
          {
            path: 'menu-items',
            loadComponent: () => import('./components/categories/menu-items/menu-items.component').then(m => m.MenuItemsComponent),
            title: 'Menu Items',
            data: {
              breadcrumb: {
                translateKey: 'MenuItems',
                icon: 'fa fa-list'
              }
            }
          },
        ]
      }
    ]
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
    path: 'component-guide',
    loadComponent: () => import('./components/component-guide/component-guide.component').then(m => m.ComponentGuideComponent),
    title: 'Component Guide',
    children: [
      { path: '', redirectTo: 'buttons', pathMatch: 'full' },
      { path: 'buttons', loadComponent: () => import('./components/component-guide/button-test/button-test.component').then(m => m.ButtonTestComponent), title: 'Buttons Test' },
      { path: 'inputs', loadComponent: () => import('./components/component-guide/input-test/input-test.component').then(m => m.InputTestComponent), title: 'Inputs Test' },
      { path: 'date-pickers', loadComponent: () => import('./components/component-guide/date-picker-test/date-picker-test.component').then(m => m.DatePickerTestComponent), title: 'Date Pickers Test' },
      { path: 'selectors', loadComponent: () => import('./components/component-guide/selector-test/selector-test.component').then(m => m.SelectorTestComponent), title: 'Selectors Test' },
      { path: 'gender-radio', loadComponent: () => import('./components/component-guide/gender-radio-test/gender-radio-test.component').then(m => m.GenderRadioTestComponent), title: 'Gender Radio Test' },
      { path: 'input-radio', loadComponent: () => import('./components/component-guide/input-radio-test/input-radio-test.component').then(m => m.InputRadioTestComponent), title: 'Generic Radio Test' },
      { path: 'input-checkbox', loadComponent: () => import('./components/component-guide/input-checkbox-test/input-checkbox-test.component').then(m => m.InputCheckboxTestComponent), title: 'Checkbox Test' },
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];
