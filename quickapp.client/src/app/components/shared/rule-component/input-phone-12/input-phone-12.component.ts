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
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Custom validator for phone number validation
 * Validates that the phone number contains only digits, starts with 0, and has length between 10-12
 * @param title
 * @returns {ValidatorFn} The validator function
 */
export function inputPhone12Validator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check if value contains only numbers
    if (!/^\d+$/.test(value)) {
      return {
        phoneNumberFormat: { message: `${title || 'Dữ liệu'} sai định dạng` },
      };
    }

    // Check if phone number starts with 0
    if (!value.startsWith('0')) {
      return {
        phoneNumberStart: { message: `${title || 'Dữ liệu'} sai định dạng` },
      };
    }

    // Check min length (10)
    if (value.length < 10) {
      return {
        phoneNumberMinLength: {
          message: `${title || 'Dữ liệu'} sai định dạng`,
        },
      };
    }

    // Check max length (12)
    if (value.length > 12) {
      return {
        phoneNumberMaxLength: {
          message: `${title || 'Dữ liệu'} sai định dạng`,
        },
      };
    }

    return null;
  };
}

@Component({
  selector: 'input-phone-12',
  templateUrl: './input-phone-12.component.html',
  styleUrls: ['./input-phone-12.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPhone12Component),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InputPhone12Component
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = 'Số điện thoại';
  @Input() placeholder: string = 'Nhập...';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() disabled: boolean = false;

  // Events
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputKeyup = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();

  value: string = '';

  private destroy$ = new Subject<void>();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    if (this.control) {
      this.control.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // Update component when control status changes
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    let value = event.target.value;

    // Only allow numbers and limit to 12 characters
    value = value.replace(/\D/g, '').substring(0, 12);

    // Update the input field value
    event.target.value = value;

    this.value = value;
    this.onChange(value);
    this.inputKeyup.emit(event);
  }

  onKeyPress(event: KeyboardEvent): void {
    // Only allow numbers (0-9)
    const char = event.key;
    if (char === 'Enter') {
      const trimmedValue = this.value.trim();
      if (trimmedValue !== this.value) {
        this.value = trimmedValue;
        this.onChange(this.value);
      }
      this.onTouched();
      this.inputKeyup.emit(event);
      return; // Exit early to skip other validations
    }
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }

    // Prevent input if already at max length
    const currentValue = (event.target as HTMLInputElement).value;
    if (currentValue.length >= 12) {
      event.preventDefault();
    }
  }

  onInputFocus(event: any): void {
    this.inputFocus.emit(event);
  }

  onInputBlur(event: any): void {
    this.onTouched();
    this.inputBlur.emit(event);
  }

  clearInput(): void {
    this.value = '';
    this.onChange('');
    this.inputClear.emit();
  }

  get hasError(): boolean {
    if (!this.control) {
      return false;
    }
    return (
      this.control.invalid &&
      (this.control.dirty || this.control.touched || this.submitted)
    );
  }

  get errorMessages(): string[] {
    if (!this.control || !this.hasError) {
      return [];
    }

    const errors = this.control.errors;
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
        return 'Trường dữ liệu này không được để trống';
      case 'phoneNumberFormat':
        return errorValue.message;
      case 'phoneNumberStart':
        return errorValue.message;
      case 'phoneNumberMinLength':
        return errorValue.message;
      case 'phoneNumberMaxLength':
        return errorValue.message;
      default:
        return 'Số điện thoại sai định dạng';
    }
  }
}
