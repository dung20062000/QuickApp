// ---------------------------------------
// Confirm Dialog Service - Reusable confirmation dialog
// ---------------------------------------

import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmDialogConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'warning' | 'danger' | 'info' | 'question';
  confirmButtonStyleClass?: string;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private confirmSubject = new Subject<{ config: ConfirmDialogConfig; resultSubject: Subject<boolean> }>();

  /** Emit confirm dialog request */
  showConfirm(config: ConfirmDialogConfig): Observable<boolean> {
    const resultSubject = new Subject<boolean>();
    this.confirmSubject.next({ config, resultSubject });
    return resultSubject.asObservable();
  }

  /** Get confirm dialog observable */
  getConfirmDialog(): Observable<{ config: ConfirmDialogConfig; resultSubject: Subject<boolean> }> {
    return this.confirmSubject.asObservable();
  }
}
