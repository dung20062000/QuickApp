import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-management-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ConfirmDialogComponent],
  template: `
    <div class="management-layout">
      <!-- Child Routes Content -->
      <div class="management-content">
        <router-outlet></router-outlet>
      </div>
    </div>

    <!-- Global Confirm Dialog -->
    <app-confirm-dialog></app-confirm-dialog>
  `,
  styles: [`
    .management-layout {
      padding: 0;
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
        padding: 0;
      }
    }
  `]
})
export class ManagementLayoutComponent {}
