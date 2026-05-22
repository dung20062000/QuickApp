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
    <nav aria-label="breadcrumb" class="header-breadcrumb">
      <ol class="breadcrumb" style="display:flex;align-items:center;list-style:none;margin:0;padding:0;flex-wrap:wrap;">
        <li class="breadcrumb-item" style="display:flex;align-items:center;font-size:14px;">
          <a routerLink="/admin" style="color:#64748b;text-decoration:none;font-weight:400;transition:color 0.2s;display:flex;align-items:center;"
             (mouseenter)="$any($event.target).style.color = '#2563eb'"
             (mouseleave)="$any($event.target).style.color = '#64748b'">
            <i class="fa fa-home" style="margin-right:4px;font-size:13px;"></i>
            <span class="d-none d-md-inline" style="margin-left:4px;">{{ 'breadcrumb.Dashboard' | translate }}</span>
          </a>
        </li>

        @for (breadcrumb of breadcrumbs$ | async; track breadcrumb.url; let isLast = $last) {
          @if (isLast) {
            <li style="color:#1e293b;font-weight:500;font-size:14px;display:flex;align-items:center;padding:0 6px;">
              <span style="color:#cbd5e1;margin:0 2px;font-size:16px;font-weight:300;">›</span>
              @if (breadcrumb.icon) {
                <i [class]="breadcrumb.icon" style="margin-right:4px;font-size:13px;"></i>
              }
              {{ breadcrumb.translateKey ? ('breadcrumb.' + breadcrumb.translateKey | translate) : breadcrumb.label }}
            </li>
          } @else {
            <li style="display:flex;align-items:center;font-size:14px;">
              <span style="color:#cbd5e1;margin:0 2px;font-size:16px;font-weight:300;">›</span>
              <a [routerLink]="breadcrumb.url"
                 style="color:#64748b;text-decoration:none;font-weight:400;transition:color 0.2s;display:flex;align-items:center;"
                 (mouseenter)="$any($event.target).style.color = '#2563eb'"
                 (mouseleave)="$any($event.target).style.color = '#64748b'">
                @if (breadcrumb.icon) {
                  <i [class]="breadcrumb.icon" style="margin-right:4px;font-size:13px;"></i>
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
    :host {
      display: flex;
      align-items: center;

      /* Hide on mobile */
      @media (max-width: 767px) {
        display: none;
      }
    }
  `]
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);

  breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
}
