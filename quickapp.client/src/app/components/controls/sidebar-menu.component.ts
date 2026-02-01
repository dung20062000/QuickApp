import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
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

  private accountService = inject(AccountService);
  private router = inject(Router);

  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.buildMenu();
  }

  buildMenu(): void {
    this.menuItems = [
      {
        label: 'mainMenu.Home',
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
        label: 'mainMenu.Categories',
        icon: 'fa fa-cog',
        items: [
          {
            label: 'danh mục 1',
            icon: 'fa fa-cog',
            // routerLink: '/settings/users',
            // permission: Permissions.viewUsers
          },
          {
            label: 'danh mục 2',
            icon: 'fa fa-cog',
            // routerLink: '/settings/users',
            // permission: Permissions.viewUsers
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
    this.menuItemClick.emit();
  }

  isActiveRoute(routerLink: string): boolean {
    return this.router.isActive(routerLink, {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
