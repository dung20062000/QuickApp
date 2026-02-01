# Sidebar Menu Component

Sidebar navigation menu kiểu Sakai PrimeNG với khả năng collapse/expand và hỗ trợ theme động.

## Features

- ✅ Menu dọc với icons và labels
- ✅ Hỗ trợ submenu (menu cây)
- ✅ Collapse/Expand sidebar
- ✅ Responsive (mobile có overlay)
- ✅ Permission-based menu items
- ✅ Active route highlighting
- ✅ Theme customization với CSS variables

## Theme Customization

Sidebar sử dụng CSS variables để có thể thay đổi màu sắc theo theme. Override các biến sau trong theme manager:

```scss
// Trong theme-manager.ts hoặc global styles
app-sidebar-menu {
  --sidebar-bg: #1e293b;           // Background color
  --sidebar-text: #cbd5e1;         // Text color
  --sidebar-hover-bg: #334155;     // Hover background
  --sidebar-active-bg: #3b82f6;    // Active item background
  --sidebar-active-text: #ffffff;  // Active item text
  --sidebar-shadow: rgba(0, 0, 0, 0.1); // Box shadow
}
```

### Ví dụ Dark Theme:
```scss
app-sidebar-menu {
  --sidebar-bg: #1a1a2e;
  --sidebar-text: #eee;
  --sidebar-hover-bg: #16213e;
  --sidebar-active-bg: #0f3460;
}
```

### Ví dụ Light Theme:
```scss
app-sidebar-menu {
  --sidebar-bg: #f8f9fa;
  --sidebar-text: #333;
  --sidebar-hover-bg: #e9ecef;
  --sidebar-active-bg: #007bff;
  --sidebar-shadow: rgba(0, 0, 0, 0.08);
}
```

## Usage

```html
<app-sidebar-menu
  [isCollapsed]="isSidebarCollapsed"
  (menuItemClick)="handleMenuClick()">
</app-sidebar-menu>
```

## Menu Structure

Cấu trúc menu được định nghĩa trong `sidebar-menu.component.ts`:

```typescript
menuItems: MenuItem[] = [
  {
    label: 'mainMenu.Home',
    icon: 'fa fa-home',
    routerLink: '/admin'
  },
  {
    label: 'mainMenu.Products',
    icon: 'fa fa-shopping-cart',
    items: [
      { label: 'Categories', icon: 'fa fa-list', routerLink: '/products/categories' },
      { label: 'Items', icon: 'fa fa-cube', routerLink: '/products/items' }
    ]
  }
];
```

## Permissions

Menu items có thể bị ẩn dựa trên permissions:

```typescript
{
  label: 'mainMenu.Customers',
  icon: 'fa fa-users',
  routerLink: '/customers',
  permission: Permissions.viewUsers
}
```

## Responsive Behavior

- **Desktop (>991px)**: Sidebar luôn hiển thị, có thể collapse/expand
- **Mobile (≤991px)**: Sidebar slide in/out, có overlay khi mở
