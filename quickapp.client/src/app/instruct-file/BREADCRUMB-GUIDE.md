# 🍞 Breadcrumb System - QuickApp

Hệ thống Breadcrumb tự động với Nested Routes và Layout Component.

## ✨ Features

- ✅ **Auto-generate** từ route configuration
- ✅ **Nested Routes** với layout component
- ✅ **Icons** cho từng breadcrumb item
- ✅ **Click-able** navigation
- ✅ **Responsive** design
- ✅ **Animation** smooth
- ✅ **Type-safe** với TypeScript

---

## 📁 File Structure

```
src/app/
├── services/
│   └── breadcrumb.service.ts          # Service quản lý breadcrumb state
├── components/
│   ├── controls/
│   │   └── breadcrumb.component.ts    # UI component hiển thị breadcrumb
│   └── layouts/
│       └── management-layout.component.ts  # Layout cho Management module
└── app.routes.ts                      # Route config với breadcrumb data
```

---

## 🚀 Cách sử dụng

### 1. Khai báo Nested Routes với i18n

```typescript
// filepath: app.routes.ts

{
  path: 'management',
  loadComponent: () => import('./components/layouts/management-layout.component')
    .then(m => m.ManagementLayoutComponent),
  canActivate: [AuthGuard],
  data: { 
    breadcrumb: { 
      translateKey: 'Management',  // Translation key (dùng cho i18n)
      icon: 'fa fa-cog'            // Icon (optional)
    } 
  },
  children: [
    {
      path: 'shop',
      data: { breadcrumb: { translateKey: 'Shop', icon: 'fa fa-store' } },
      children: [
        {
          path: 'restaurant-info',
          loadComponent: () => import('./components/categories/restaurant-info/restaurant-info.component')
            .then(m => m.RestaurantInfoComponent),
          data: { breadcrumb: { translateKey: 'RestaurantInfo', icon: 'fa fa-building' } }
        }
      ]
    }
  ]
}
```

**Lưu ý:** Dùng `translateKey` thay vì `label` để hỗ trợ đa ngôn ngữ (i18n).

### 2. Cấu hình Translation Files

Thêm translation keys vào `public/locale/en.json` và `vi.json`:

```json
// en.json
{
  "breadcrumb": {
    "Dashboard": "Dashboard",
    "Management": "Management",
    "Shop": "Shop",
    "RestaurantInfo": "Restaurant Info",
    "Detail"Thêm translation keys vào locale files

```json
// public/locale/en.json
{
  "breadcrumb": {
    "YourModule": "Your Module Name"
  }
}

// public/locale/vi.json
{
  "breadcrumb": {
    "YourModule": "Tên Module Của Bạn"
  }
}
```

### Bước 2: Khai báo route trong `app.routes.ts`

```typescript
{
  path: 'your-path',
  loadComponent: () => import('./your-component').then(m => m.YourComponent),
  data: { 
    breadcrumb: { 
      translateKey: 'YourModule',   // Required - Translation key
      icon: 'fa fa-your-icon'       // Optional
    } 
  }
}
```

### Bước 3: Đặt trong children nếu cần nested

```typescript
{
  path: 'management',
  children: [
    {
      path: 'new-module',
      data: { breadcrumb: { translateKey: 'NewModule', icon: 'fa fa-cube' } },
      children: [
        {
          path: 'list',
          component: ListComponent,
          data: { breadcrumb: { translateKey: 'List', icon: 'fa fa-list' } }
        }
      ]
    }
  ]
}
```

### Bước 4
    breadcrumb: { 
      label: 'Your Label',     // Required
      icon: 'fa fa-your-icon'  // Optional
    } 
  }
}
```

### Bước 2: Đặt trong children nếu cần nested

```typescript
{
  path: 'management',
  children: [
    {
      path: 'new-module',
      data: { breadcrumb: { label: 'New Module', icon: 'fa fa-cube' } },
      children: [
        {
          path: 'list',
          component: ListComponent,
          data: { breadcrumb: { label: 'List', icon: 'fa fa-list' } }
        }
      ]
    }
  ]
}
```

### Bước 3: Navigate từ code

```typescript
// Trong component
this.router.navigate(['/management/new-module/list']);

// Hoặc trong template
<a routerLink="/management/new-module/list">Go to List</a>
```

---

## 🎨 Customize Breadcrumb

### Thay đổi style

Edit file `breadcrumb.component.ts`, section `styles`:

```scss
.breadcrumb-container {
  background: #fff;              // Background màu
  padding: 12px 20px;           // Padding
  border-radius: 8px;           // Bo góc
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);  // Shadow
}

.breadcrumb-item a:hover {
  color: #your-color;           // Hover color
}
```

### Set breadcrumb động từ component

```typescript
import { BreadcrumbService } from '../../services/breadcrumb.service';

export class YourComponent {
  private breadcrumbService = inject(BreadcrumbService);
  
  ngOnInit() {     // Text hiển thị (fallback nếu không dùng translateKey)
  url: string;          // URL để navigate
  icon?: string;        // Icon class (optional)
  translateKey?: string; // Translation key cho i18n (optional)
}

class BreadcrumbService {
  breadcrumbs$: Observable<Breadcrumb[]>;  // Stream breadcrumb data
  
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void;  // Set custom breadcrumbs
}
```

### Route Data Config

```typescript
data: {
  breadcrumb: {
    translateKey?: string; // Translation key (recommended cho i18n)
    label?: string;        // Static label (fallback)
    icon?: string;         // Icon FA class (optional)
  }
}
```

**Priority:** Nếu có `translateKey`, sẽ dùng translation. Nếu không, sẽ dùng `label`.

class BreadcrumbService {
  breadcrumbs$: Observable<Breadcrumb[]>;  // Stream breadcrumb data
  
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void;  // Set custom breadcrumbs
}
```

### Route Data Config

```typescript
data: {
  breadcrumb: {
    label: string;    // Required - Text hiển thị
    icon?: string;    // Optional - Icon FA class
  }
}
```

---

## 💡 Best Practices
translateKey cho i18n
data: { breadcrumb: { translateKey: 'Products', icon: 'fa fa-box' } }

// 2. Translation keys ngắn gọn trong locale files
"breadcrumb": {
  "Products": "Products", // EN
  "Products": "Sản phẩm"  // VI
}

// 3. Icon có ý nghĩa
data: { breadcrumb: { translateKey: 'Info', icon: 'fa fa-info' } }

// 4. Nested routes hợp lý
management › shop › products › detail

// 5. Consistent naming trong translation keys
"RestaurantInfo", "RestaurantList", "RestaurantDetail"
```

### ❌ DON'T

```typescript
// 1. Hard-coded labels (không i18n)
data: { breadcrumb: { label: 'Restaurant Information' } }

// 2. Translation keys quá dài
"RestaurantInformationManagementSystemPage"

// 3. Quá nhiều levels
dashboard › management › shop › products › categories › list › detail › edit

// 4. Icon không liên quan
data: { breadcrumb: { translateKey: 'Products', icon: 'fa fa-smile' } }
```

---

## 🌐 Đổi ngôn ngữ (Language Switching)

Breadcrumb tự động đổi ngôn ngữ khi user thay đổi trong Settings:

```typescript
// Trong component hoặc service
import { AppTranslationService } from './services/app-translation.service';

// Đổi sang tiếng Việt
this.translationService.changeLanguage('vi');

// Đổi sang tiếng Anh
this.translationService.changeLanguage('en');
```

Breadcrumb sẽ tự động render lại với ngôn ngữ mới! 🎉hboard › management › shop › products › categories › list › detail › edit

// 3. Icon không liên quan
data: { breadcrumb: { label: 'Products', icon: 'fa fa-smile' } }
```

---

## 🎯 Demo Navigation

Trong `restaurant-info.component.ts` đã có sẵn demo:

```typescript
// Navigate to list
navigateToList(): void {
  this.router.navigate(['/management/shop/restaurant-info']);
}

// Navigate to create
navigateToCreate(): void {
  this.router.navigate(['/management/shop/restaurant-info/create']);
}

// Navigate to detail
navigateToDetail(id: number): void {
  this.router.navigate(['/management/shop/restaurant-info/detail', id]);
}
```

UI buttons:
- 📋 Restaurant List
- ➕ Create New  
- 👁️ View Detail #123

---

## 🐛 Troubleshooting

### Breadcrumb không hiển thị?

1. Check route có `data: { breadcrumb: {...} }` chưa
2. Check component có trong ManagementLayoutComponent chưa
3. Check route structure (phải nested đúng)

### Icon không hiển thị?

1. Check Font Awesome đã load chưa
2. Check class name đúng chưa (`fa fa-icon-name`)

### Click breadcrumb không navigate?

1. Check URL trong breadcrumb service
2. Check route có tồn tại trong routes config

---

## 📚 Related Files

- [breadcrumb.service.ts](../services/breadcrumb.service.ts)
- [breadcrumb.component.ts](../components/controls/breadcrumb.component.ts)
- [management-layout.component.ts](../components/layouts/management-layout.component.ts)
- [app.routes.ts](../app.routes.ts)

---

Tạo bởi: **MucSushi Team** 🍣
