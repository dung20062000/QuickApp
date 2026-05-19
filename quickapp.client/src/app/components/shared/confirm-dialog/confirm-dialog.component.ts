// ---------------------------------------
// Confirm Dialog Component - Reusable dialog for delete confirmations
// ---------------------------------------

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { ConfirmDialogService, ConfirmDialogConfig } from '../../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '450px' }"
      [header]="currentConfig?.title || 'Xác nhận'"
      (onHide)="onCancel()"
      styleClass="confirm-dialog"
    >
      <div class="confirm-dialog-content">
        <div class="confirm-icon" [ngClass]="getIconClass()">
          <i [class]="getIconName()"></i>
        </div>
        <p class="confirm-message">{{ currentConfig?.message }}</p>
      </div>

      <ng-template pTemplate="footer">
        <div class="confirm-dialog-footer">
          <button
            pButton
            type="button"
            [label]="currentConfig?.cancelText || 'Hủy'"
            class="p-button-text p-button-secondary"
            (click)="onCancel()"
            [disabled]="isLoading"
          ></button>
          <button
            pButton
            type="button"
            [label]="currentConfig?.confirmText || 'Xác nhận'"
            [class]="currentConfig?.confirmButtonStyleClass || 'p-button-danger'"
            (click)="onConfirm()"
            [loading]="isLoading"
          ></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .confirm-dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1rem;
      text-align: center;
    }

    .confirm-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    .confirm-icon.warning {
      background-color: #fff3cd;
      color: #856404;
    }

    .confirm-icon.danger {
      background-color: #f8d7da;
      color: #721c24;
    }

    .confirm-icon.info {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .confirm-icon.question {
      background-color: #d1ecf1;
      color: #004085;
    }

    .confirm-message {
      font-size: 1rem;
      color: #333;
      margin: 0;
      line-height: 1.5;
    }

    .confirm-dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    :host ::ng-deep .p-dialog-header {
      padding: 1rem 1.5rem;
    }

    :host ::ng-deep .p-dialog-content {
      padding: 0 1.5rem;
    }

    :host ::ng-deep .p-dialog-footer {
      padding: 1rem 1.5rem;
    }
  `],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule]
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  private confirmDialogService = inject(ConfirmDialogService);
  private subscription?: Subscription;

  visible = false;
  isLoading = false;
  currentConfig?: ConfirmDialogConfig;
  private currentResultSubject?: { confirm: () => void; cancel: () => void };

  ngOnInit(): void {
    this.subscription = this.confirmDialogService.getConfirmDialog().subscribe(({ config, resultSubject }) => {
      this.currentConfig = config;
      this.visible = true;
      this.isLoading = false;

      // Store the result subject methods
      const originalConfirm = resultSubject.next.bind(resultSubject);
      const originalCancel = () => resultSubject.next(false);

      this.currentResultSubject = {
        confirm: () => {
          this.isLoading = true;
          originalConfirm(true);
          this.visible = false;
        },
        cancel: () => {
          originalCancel();
          resultSubject.complete();
          this.visible = false;
        }
      };
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onConfirm(): void {
    if (this.currentResultSubject) {
      this.currentResultSubject.confirm();
    }
  }

  onCancel(): void {
    if (this.currentResultSubject) {
      this.currentResultSubject.cancel();
    }
    this.visible = false;
  }

  getIconClass(): string {
    const icon = this.currentConfig?.icon || 'warning';
    return `confirm-icon ${icon}`;
  }

  getIconName(): string {
    const icon = this.currentConfig?.icon || 'warning';
    const iconMap: Record<string, string> = {
      warning: 'fa fa-exclamation-triangle',
      danger: 'fa fa-trash',
      info: 'fa fa-info-circle',
      question: 'fa fa-question-circle'
    };
    return iconMap[icon] || iconMap['warning'];
  }
}
