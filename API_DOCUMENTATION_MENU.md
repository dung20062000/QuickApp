# API Documentation - Menu & Restaurant Info

## T?ng quan

?ã t?o các API cho Menu (món ?n) và Restaurant Info (thông tin nhà hàng) theo c?u trúc:
- **Public APIs**: Không c?n authentication (cho khách truy c?p trang web)
- **Protected APIs**: C?n authentication + quy?n `ManageAllUsersPolicy` (cho admin)

---

## ?? Menu APIs

### 1. GET `/api/menu` - L?y toàn b? menu (PUBLIC)

**Mô t?**: L?y t?t c? categories và menu items

**Response**:
```json
{
  "message": "Success",
  "status": 0,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Nigiri Sushi",
        "description": "Traditional hand-pressed sushi",
        "icon": "??"
      }
    ],
    "items": [
      {
        "id": 1,
        "name": "Salmon Nigiri",
        "nameVi": "Nigiri Cá H?i",
        "description": "Fresh Norwegian salmon on seasoned rice",
        "descriptionVi": "Cá h?i Na Uy t??i trên c?m tr?n gi?m",
        "productCategoryId": 1,
        "categoryName": "Nigiri Sushi",
        "price": 45000,
        "imageUrl": null,
        "isPopular": true,
        "isNew": false,
        "isVegetarian": false,
        "ingredients": ["Salmon", "Sushi Rice", "Wasabi"],
        "ingredientsVi": ["Cá h?i", "C?m sushi", "Wasabi"],
        "rating": 4.8,
        "reviews": 124
      }
    ]
  }
}
```

---

### 2. GET `/api/menu/category/{categoryId}` - L?y món ?n theo category (PUBLIC)

**Mô t?**: L?y t?t c? món ?n thu?c m?t category

**Parameters**:
- `categoryId` (int): ID c?a category

**Response**: Gi?ng nh? trên nh?ng ch? có items thu?c category ?ó

---

### 3. GET `/api/menu/{id}` - L?y chi ti?t món ?n (PUBLIC)

**Mô t?**: L?y thông tin chi ti?t m?t món ?n

**Parameters**:
- `id` (int): ID c?a món ?n

---

### 4. POST `/api/menu` - Thêm món ?n m?i (PROTECTED)

**Mô t?**: T?o món ?n m?i (c?n authentication + quy?n)

**Authorization**: Bearer token + `ManageAllUsersPolicy`

**Request Body**:
```json
{
  "name": "Salmon Nigiri",
  "nameVi": "Nigiri Cá H?i",
  "description": "Fresh Norwegian salmon on seasoned rice",
  "descriptionVi": "Cá h?i Na Uy t??i trên c?m tr?n gi?m",
  "productCategoryId": 1,
  "price": 45000,
  "imageUrl": "https://example.com/image.jpg",
  "isPopular": true,
  "isNew": false,
  "isVegetarian": false,
  "ingredients": ["Salmon", "Sushi Rice", "Wasabi"],
  "ingredientsVi": ["Cá h?i", "C?m sushi", "Wasabi"],
  "rating": 4.8,
  "reviews": 124
}
```

---

### 5. PUT `/api/menu/{id}` - C?p nh?t món ?n (PROTECTED)

**Mô t?**: C?p nh?t thông tin món ?n

**Authorization**: Bearer token + `ManageAllUsersPolicy`

**Parameters**:
- `id` (int): ID c?a món ?n c?n c?p nh?t

**Request Body**: Gi?ng POST

---

### 6. DELETE `/api/menu/{id}` - Xóa món ?n (PROTECTED)

**Mô t?**: Xóa món ?n (soft delete - ch? set IsActive = false)

**Authorization**: Bearer token + `ManageAllUsersPolicy`

**Parameters**:
- `id` (int): ID c?a món ?n c?n xóa

---

## ?? Restaurant Info APIs

### 1. GET `/api/restaurant-info` - L?y thông tin nhà hàng (PUBLIC)

**Mô t?**: L?y thông tin chi ti?t c?a nhà hàng

**Response**:
```json
{
  "message": "Success",
  "status": 0,
  "data": {
    "id": 1,
    "name": "Muc Sushi House",
    "description": "Experience authentic Japanese cuisine...",
    "descriptionVi": "Tr?i nghi?m ?m th?c Nh?t B?n...",
    "phone": "+84 123 456 789",
    "email": "info@mucsushi.vn",
    "address": "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
    "addressVi": "123 ???ng Nguy?n Hu?, Qu?n 1, TP. H? Chí Minh",
    "openHours": "Mon-Sun: 10:00 AM - 10:00 PM",
    "openHoursVi": "T2-CN: 10:00 - 22:00",
    "socialMedia": {
      "facebook": "https://facebook.com/mucsushi",
      "instagram": "https://instagram.com/mucsushi",
      "twitter": "https://twitter.com/mucsushi"
    },
    "logoUrl": null
  }
}
```

---

### 2. PUT `/api/restaurant-info` - C?p nh?t thông tin nhà hàng (PROTECTED)

**Mô t?**: C?p nh?t thông tin nhà hàng

**Authorization**: Bearer token + `ManageAllUsersPolicy`

**Request Body**:
```json
{
  "id": 1,
  "name": "Muc Sushi House",
  "description": "Experience authentic Japanese cuisine...",
  "descriptionVi": "Tr?i nghi?m ?m th?c Nh?t B?n...",
  "phone": "+84 123 456 789",
  "email": "info@mucsushi.vn",
  "address": "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
  "addressVi": "123 ???ng Nguy?n Hu?, Qu?n 1, TP. H? Chí Minh",
  "openHours": "Mon-Sun: 10:00 AM - 10:00 PM",
  "openHoursVi": "T2-CN: 10:00 - 22:00",
  "socialMedia": {
    "facebook": "https://facebook.com/mucsushi",
    "instagram": "https://instagram.com/mucsushi",
    "twitter": "https://twitter.com/mucsushi"
  },
  "logoUrl": "https://example.com/logo.png"
}
```

---

## ?? Authentication

Các **Protected APIs** c?n header:

```
Authorization: Bearer {access_token}
```

User c?n có quy?n `ManageUsers` (thu?c role `administrator`)

---

## ?? Các b??c ?? ch?y

### 1. T?o Migration
```powershell
cd QuickApp.Server
dotnet ef migrations add AddMenuAndRestaurantInfo
```

### 2. Update Database
```powershell
dotnet ef database update
```

### 3. Ch?y Backend
```powershell
dotnet run --launch-profile https
```

Backend s? t? ??ng seed d? li?u m?u (menu items và restaurant info) khi ch?y l?n ??u.

### 4. Test APIs

**Public APIs** (không c?n token):
```bash
# Get full menu
curl https://localhost:7085/api/menu

# Get restaurant info
curl https://localhost:7085/api/restaurant-info

# Get items by category
curl https://localhost:7085/api/menu/category/1
```

**Protected APIs** (c?n token):

1. Login ?? l?y token:
```bash
curl -X POST https://localhost:7085/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=admin&password=tempP@ss123"
```

2. S? d?ng token ?? t?o menu item:
```bash
curl -X POST https://localhost:7085/api/menu \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Sushi Roll",
    "productCategoryId": 1,
    "price": 50000
  }'
```

---

## ?? Files ?ã t?o/s?a

### Models
- `QuickApp.Core/Models/Shop/MenuItem.cs` (NEW)
- `QuickApp.Core/Models/Shop/RestaurantInfo.cs` (NEW)

### Services
- `QuickApp.Core/Services/Shop/Interfaces/IMenuService.cs` (NEW)
- `QuickApp.Core/Services/Shop/Interfaces/IRestaurantInfoService.cs` (NEW)
- `QuickApp.Core/Services/Shop/MenuService.cs` (NEW)
- `QuickApp.Core/Services/Shop/RestaurantInfoService.cs` (NEW)

### Controllers
- `QuickApp.Server/Controllers/MenuController.cs` (NEW)
- `QuickApp.Server/Controllers/RestaurantInfoController.cs` (NEW)

### ViewModels
- `QuickApp.Server/ViewModels/Shop/MenuItemVM.cs` (NEW)
- `QuickApp.Server/ViewModels/Shop/RestaurantInfoVM.cs` (NEW)
- `QuickApp.Server/ViewModels/Shop/MenuResponseVM.cs` (NEW)

### Configuration
- `QuickApp.Core/Infrastructure/ApplicationDbContext.cs` (UPDATED)
- `QuickApp.Server/Configuration/MappingProfile.cs` (UPDATED)
- `QuickApp.Server/Program.cs` (UPDATED)
- `QuickApp.Core/Infrastructure/DatabaseSeeder.cs` (UPDATED)

---

## ? Tính n?ng

?? Public APIs không c?n authentication  
?? Protected APIs có authentication + authorization  
?? Soft delete cho menu items (IsActive flag)  
?? Auto-mapping v?i AutoMapper  
?? JSON serialization cho arrays (Ingredients)  
?? Seed data t? ??ng  
?? Multi-language support (Vi/En)  
?? Swagger documentation  

---

## ?? L?u ý

- L?i `npm install` trong build có th? b? qua vì ?ã comment out `quickapp.client.esproj` reference
- Ch?y backend và frontend riêng bi?t nh? ?ã h??ng d?n tr??c ?ó
- D? li?u seed ch? ch?y m?t l?n khi database r?ng
