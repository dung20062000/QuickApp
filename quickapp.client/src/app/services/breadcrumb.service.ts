import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
  translateKey?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private router = inject(Router);
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbsSubject.asObservable();

  constructor() {
    // Trigger initial breadcrumb on app load
    this.updateBreadcrumbs();

    // Listen to navigation events
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  private updateBreadcrumbs(): void {
    const breadcrumbs = this.createBreadcrumbs(this.router.routerState.snapshot.root);
    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Nếu không có children, trả về breadcrumbs hiện tại
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      // Nếu route hiện tại có breadcrumb data (cho route gốc như /admin)
      const breadcrumbData = route.data['breadcrumb'];
      if (breadcrumbData && breadcrumbs.length === 0) {
        breadcrumbs.push({
          label: breadcrumbData.label || '',
          url: url || '/',
          icon: breadcrumbData.icon,
          translateKey: breadcrumbData.translateKey
        });
      }
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url = url ? `${url}/${routeURL}` : `/${routeURL}`;
      } else if (!url) {
        url = '/';
      }

      // Lấy breadcrumb data từ route config
      const breadcrumbData = child.data['breadcrumb'];

      if (breadcrumbData) {
        const breadcrumb: Breadcrumb = {
          label: breadcrumbData.label || '',
          url: url,
          icon: breadcrumbData.icon,
          translateKey: breadcrumbData.translateKey
        };

        breadcrumbs.push(breadcrumb);
      }

      // Đệ quy để lấy tất cả breadcrumbs từ các route con
      if (child.children && child.children.length > 0) {
        this.createBreadcrumbs(child, url, breadcrumbs);
      }
    }

    return breadcrumbs;
  }

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this.breadcrumbsSubject.next(breadcrumbs);
  }
}
