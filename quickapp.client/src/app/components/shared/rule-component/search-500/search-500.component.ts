import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppIconButtonComponent } from '../app-icon-button/app-icon-button.component';

@Component({
  selector: 'search-500',
  templateUrl: './search-500.component.html',
  styleUrls: ['./search-500.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Search500Component),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, AppIconButtonComponent],
})
export class Search500Component
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() placeholder: string = 'Nhập...';
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() readonly: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() maxLength: number | null = null;
  @Input() disabled: boolean = false;

  // Events
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputKeyup = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();
  @Output() inputConfirm = new EventEmitter<string>(); // Emits the value string

  value: string = '';
  private lastConfirmValue: string = '';

  private destroy$ = new Subject<void>();
  private confirmSubject$ = new Subject<string>();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    // Set up debounced confirm emission
    this.confirmSubject$
      .pipe(
        debounceTime(300), // 300ms debounce
      )
      .subscribe((val) => {
        // Only emit if value has changed from last confirm
        if (val !== this.lastConfirmValue) {
          this.lastConfirmValue = val;
          this.inputConfirm.emit(val);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.confirmSubject$.complete();
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
    this.inputKeyup.emit(event);
    // Trigger debounced confirm on every input
    this.confirmSubject$.next(this.value);
  }

  onKeyPress(event: KeyboardEvent): void {
    this.inputKeyup.emit(event);
    if (event.key === 'Enter') {
      const trimmedValue = this.value.trim();
      if (trimmedValue !== this.value) {
        this.value = trimmedValue;
        this.onChange(this.value);
      }
      this.onTouched();
      // Force immediate confirm on Enter by resetting lastConfirmValue
      this.lastConfirmValue = ''; 
      this.confirmSubject$.next(this.value);
    }
  }

  onInputFocus(event: any): void {
    this.inputFocus.emit(event);
  }

  onInputBlur(event: any): void {
    const trimmedValue = this.value.trim();
    if (trimmedValue !== this.value) {
      this.value = trimmedValue;
      this.onChange(this.value);
    }

    this.onTouched();
    this.inputBlur.emit(event);
    
    // If empty, ensure we confirm the clearing
    if (!this.value) {
      this.inputClear.emit();
    }
    this.confirmSubject$.next(this.value);
  }

  clearInput(): void {
    this.value = '';
    this.onChange('');
    this.inputClear.emit();
    this.confirmSubject$.next('');
  }
}
