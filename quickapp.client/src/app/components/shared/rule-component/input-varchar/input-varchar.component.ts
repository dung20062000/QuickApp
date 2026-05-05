import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Custom validator for name validation
 * Validates that the name has length max 255
 * @param title
 * @param maxLength
 * @returns {ValidatorFn} The validator function
 */
export function inputVarcharValidator(
  title?: string,
  maxLength?: number,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Regex: chỉ cho phép A-Z, a-z, 0-9, khoảng trắng và một số ký tự đặc biệt nhẹ
    const varcharPattern = /^[a-zA-Z0-9 _.\-']*$/;
    if (value && !varcharPattern.test(value)) {
      return {
        invalidFormat: {
          message: `${title || 'Dữ liệu'} sai định dạng`,
        },
      };
    }

    // Check max length
    if (maxLength && value.length > maxLength) {
      return {
        invalidMaxLength: {
          message: `${title || 'Dữ liệu'} vượt quá độ dài tối đa ${maxLength} ký tự`,
        },
      };
    }

    return null;
  };
}
@Component({
  selector: 'app-input-varchar',
  templateUrl: './input-varchar.component.html',
  styleUrls: ['./input-varchar.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputVarcharComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InputVarcharComponent implements OnInit {
  @Input() label: string = '';
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
  @Input() maxLength: number = 4000;

  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputKeyup = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();

  value: string = '';
  private destroy$ = new Subject<void>();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {}

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
    this.value = event.target.value;
    this.onChange(this.value);
    this.inputKeyup.emit(event);
  }

  onKeyPress(event: KeyboardEvent): void {
    //trim value when pressing enter
    if (event.key === 'Enter') {
      const trimmedValue = this.value.trim();
      if (trimmedValue !== this.value) {
        this.value = trimmedValue;
        this.onChange(this.value);
      }
      this.onTouched();
    }
    this.inputKeyup.emit(event);
  }

  onInputFocus(event: any): void {
    this.inputFocus.emit(event);
  }

  onInputBlur(event: any): void {
    // Trim the input value on blur
    const trimmedValue = this.value.trim();
    if (trimmedValue !== this.value) {
      this.value = trimmedValue;
      this.onChange(this.value);
    }

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
      case 'invalidFormat':
        return errorValue.message;
      case 'invalidMaxLength':
        return errorValue.message;
      default:
        return 'Trường dữ liệu này không được để trống';
    }
  }
}
