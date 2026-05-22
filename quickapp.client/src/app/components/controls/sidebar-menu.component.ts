import { Component, OnInit, inject, Input, Output, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../../services/account.service';
import { Permissions, PermissionValues } from '../../models/permission.model';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  items?: MenuItem[];
  permission?: PermissionValues;
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent implements OnInit {
  @Input() isCollapsed = false;
  @Output() menuItemClick = new EventEmitter<void>();
  @ViewChildren('menuItemEl') menuItemElements!: QueryList<ElementRef>;

  private accountService = inject(AccountService);
  private router = inject(Router);

  menuItems: MenuItem[] = [];
  hoveredItem: MenuItem | null = null;
  tooltipTop = 0;
  private hoverTimeout: any;

  ngOnInit(): void {
    this.buildMenu();
  }

  buildMenu(): void {
    this.menuItems = [
      {
        label: 'mainMenu.Dashboard',
        icon: 'fa fa-home',
        routerLink: '/admin'
      },
      {
        label: 'mainMenu.Customers',
        icon: 'fa fa-users',
        routerLink: '/customers',
        permission: Permissions.viewUsers
      },
      {
        label: 'mainMenu.Products',
        icon: 'fa fa-shopping-cart',
        routerLink: '/products',
        permission: Permissions.viewUsers
      },
      {
        label: 'mainMenu.Orders',
        icon: 'fa fa-shopping-bag',
        routerLink: '/orders'
      },
      {
        label: 'mainMenu.About',
        icon: 'fa fa-info-circle',
        routerLink: '/about'
      },
      {
        label: 'mainMenu.Categories.Categories',
        icon: 'fa fa-building',
        items: [
          {
            label: 'mainMenu.Categories.Restaurant',
            icon: 'fa fa-info-circle',
            routerLink: '/management/shop/restaurant-info'
          },
          {
            label: 'mainMenu.Categories.MenuItems',
            icon: 'fa fa-utensils',
            routerLink: '/management/shop/menu-items',
          },
          {
            label: 'mainMenu.Categories.Management',
            icon: 'fa fa-utensils',
            routerLink: '/management/shop/menu-management'
          },
          {
            label: 'mainMenu.Categories.BlogPosts',
            icon: 'fa fa-newspaper',
            routerLink: '/management/shop/blog-posts'
          },
        ]
      },
      {
        label: 'mainMenu.Settings',
        icon: 'fa fa-cog',
        routerLink: '/settings'
      }
    ];
  }

  hasPermission(permission?: PermissionValues): boolean {
    if (!permission) return true;
    return this.accountService.userHasPermission(permission);
  }

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  onMenuItemClick(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 991) {
      this.menuItemClick.emit();
    }
  }

  onMenuItemHover(item: MenuItem, event: MouseEvent): void {
    if (!item.items || item.items.length === 0 || !this.isCollapsed) return;
    
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      this.hoveredItem = item;
      this.calculateTooltipPosition(item);
    }, 150);
  }

  onMenuItemLeave(event: MouseEvent): void {
    clearTimeout(this.hoverTimeout);
    
    this.hoverTimeout = setTimeout(() => {
      this.hoveredItem = null;
    }, 200);
  }

  private calculateTooltipPosition(item: MenuItem): void {
    if (typeof window === 'undefined') return;
    
    const sidebarHeight = window.innerHeight;
    const menuItemHeight = 48;
    const submenuItemHeight = 40;
    const tooltipPadding = 8;
    
    // Find the menu item element by matching the label
    const menuItemEls = Array.from(document.querySelectorAll('.sidebar-menu .menu-item'));
    let menuItemEl: HTMLElement | null = null;
    
    for (const el of menuItemEls) {
      const title = el.getAttribute('data-label');
      if (title === item.label) {
        menuItemEl = el as HTMLElement;
        break;
      }
    }
    
    if (!menuItemEl) {
      this.tooltipTop = 72;
      return;
    }
    
    const rect = menuItemEl.getBoundingClientRect();
    const itemTop = rect.top;
    
    const submenuCount = item.items?.length || 0;
    const tooltipHeight = submenuCount * submenuItemHeight + (tooltipPadding * 2);
    
    const spaceBelow = sidebarHeight - itemTop;
    const spaceAbove = itemTop;
    
    if (spaceBelow >= tooltipHeight + 20) {
      this.tooltipTop = itemTop;
    } else if (spaceAbove >= tooltipHeight + 20) {
      this.tooltipTop = itemTop - tooltipHeight + menuItemHeight;
    } else {
      this.tooltipTop = 72;
    }
  }

  isActiveRoute(routerLink: string): boolean {
    return this.router.isActive(routerLink, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  hasActiveChild(item: MenuItem): boolean {
    if (!item.items) return false;
    return item.items.some(subItem => {
      if (subItem.routerLink) {
        return this.router.isActive(subItem.routerLink, {
          paths: 'subset',
          queryParams: 'subset',
          fragment: 'ignored',
          matrixParams: 'ignored'
        });
      }
      return this.hasActiveChild(subItem);
    });
  }
}
