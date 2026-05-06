import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
} from '@angular/forms';
import { Subject } from 'rxjs';

/**
 * Interface for checkbox options (for checkbox group)
 */
export interface CheckboxOption {
  value: any;
  text: string;
  disabled?: boolean;
}

@Component({
  selector: 'input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckboxComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class InputCheckboxComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() id: string = 'checkbox_' + Math.random().toString(36).substring(2, 9);
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() defaultValue: any = null;
  @Input() disabled: boolean = false; // Manual input
  @Input() options: CheckboxOption[] | null = null;
  @Input() inline: boolean = true;

  // Events
  @Output() statusChange = new EventEmitter<any>();
  @Output() checkboxFocus = new EventEmitter<any>();
  @Output() checkboxBlur = new EventEmitter<any>();

  value: any = null;
  private _formDisabled: boolean = false;

  private destroy$ = new Subject<void>();
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    if (this.defaultValue !== null && this.value === null) {
      this.value = this.defaultValue;
      this.onChange(this.value);
    } else if (this.value === null) {
      this.value = this.options ? [] : false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Final disabled state (combination of Input, Form state, and Readonly)
   */
  get isDisabled(): boolean {
    return this.disabled || this._formDisabled || this.readonly;
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.value = value;
    } else {
      this.value = this.options ? [] : false;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._formDisabled = isDisabled;
  }

  /**
   * Handle toggle for single checkbox
   */
  onToggle(event: Event): void {
    if (this.isDisabled) return;
    
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.statusChange.emit(this.value);
    this.onTouched();
  }

  /**
   * Handle toggle for a specific option in a group
   */
  onOptionToggle(event: Event, optionValue: any): void {
    if (this.isDisabled) return;

    if (!Array.isArray(this.value)) {
      this.value = [];
    }

    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    
    if (isChecked) {
      if (!this.value.includes(optionValue)) {
        this.value = [...this.value, optionValue];
      }
    } else {
      this.value = (this.value as any[]).filter(v => v !== optionValue);
    }

    this.onChange(this.value);
    this.statusChange.emit(this.value);
    this.onTouched();
  }

  /**
   * Check if a specific option is checked
   */
  isOptionChecked(optionValue: any): boolean {
    if (Array.isArray(this.value)) {
      return this.value.includes(optionValue);
    }
    return false;
  }

  onFocus(event: any): void {
    this.checkboxFocus.emit(event);
  }

  onBlur(event: any): void {
    this.onTouched();
    this.checkboxBlur.emit(event);
  }

  get hasError(): boolean {
    const ctrl = this.control;
    if (!ctrl) {
      return false;
    }
    return (
      ctrl.invalid &&
      (ctrl.dirty || ctrl.touched || this.submitted)
    );
  }

  get errorMessages(): string[] {
    const ctrl = this.control;
    if (!ctrl || !this.hasError) {
      return [];
    }

    const errors = ctrl.errors;
    const messages: string[] = [];

    if (errors) {
      Object.keys(errors).forEach((key) => {
        if (this.customValidationMessages[key]) {
          messages.push(this.customValidationMessages[key]);
        } else {
          messages.push(this.getDefaultErrorMessage(key, errors[key]));
        }
      });
    }

    return messages;
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
      case 'requiredTrue':
        return 'Bạn phải đồng ý hoặc chọn trường này';
      default:
        return 'Trường dữ liệu này không hợp lệ';
    }
  }
}
