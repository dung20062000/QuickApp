import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '../controls/breadcrumb.component';

@Component({
  selector: 'app-management-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BreadcrumbComponent],
  template: `
    <div class="management-layout">
      <!-- Breadcrumb -->
      <app-breadcrumb></app-breadcrumb>
      
      <!-- Child Routes Content -->
      <div class="management-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .management-layout {
      padding: 20px;
      min-height: calc(100vh - 120px);
    }

    .management-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 767px) {
      .management-layout {
        padding: 15px;
      }
    }
  `]
})
export class ManagementLayoutComponent {}
