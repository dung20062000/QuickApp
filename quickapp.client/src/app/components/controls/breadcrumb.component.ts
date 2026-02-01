import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbService, Breadcrumb } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a routerLink="/admin">
            <i class="fa fa-home"></i>
            <span class="d-none d-md-inline ms-1">{{ 'breadcrumb.Dashboard' | translate }}</span>
          </a>
        </li>
        
        @for (breadcrumb of breadcrumbs$ | async; track breadcrumb.url; let isLast = $last) {
          @if (isLast) {
            <li class="breadcrumb-item active" aria-current="page">
              @if (breadcrumb.icon) {
                <i [class]="breadcrumb.icon"></i>
              }
              {{ breadcrumb.translateKey ? ('breadcrumb.' + breadcrumb.translateKey | translate) : breadcrumb.label }}
            </li>
          } @else {
            <li class="breadcrumb-item">
              <a [routerLink]="breadcrumb.url">
                @if (breadcrumb.icon) {
                  <i [class]="breadcrumb.icon"></i>
                }
                {{ breadcrumb.translateKey ? ('breadcrumb.' + breadcrumb.translateKey | translate) : breadcrumb.label }}
              </a>
            </li>
          }
        }
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      background: #fff;
      padding: 12px 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .breadcrumb {
      margin: 0;
      background: transparent;
      padding: 0;
    }

    .breadcrumb-item {
      font-size: 14px;
      
      a {
        color: #6c757d;
        text-decoration: none;
        transition: color 0.2s;
        
        &:hover {
          color: var(--bs-primary, #0d6efd);
        }
      }
      
      &.active {
        color: #495057;
        font-weight: 500;
      }
      
      i {
        margin-right: 4px;
        font-size: 13px;
      }
    }

    .breadcrumb-item + .breadcrumb-item::before {
      content: "›";
      font-size: 18px;
      color: #adb5bd;
    }

    @media (max-width: 767px) {
      .breadcrumb-container {
        padding: 8px 15px;
      }
      
      .breadcrumb-item {
        font-size: 13px;
      }
    }
  `]
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  
  breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
}
