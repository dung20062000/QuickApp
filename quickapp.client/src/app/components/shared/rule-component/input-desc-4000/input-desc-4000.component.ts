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
 * Custom validator for description validation
 * Validates that the description has length max 4000
 * @param title
 * @returns {ValidatorFn} The validator function
 */
export function inputDesc4000Validator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check max length (4000)
    if (value.length > 4000) {
      return {
        descMaxLength: { message: `${title || 'Dữ liệu'} sai định dạng` },
      };
    }

    return null;
  };
}

@Component({
  selector: 'input-desc-4000',
  templateUrl: './input-desc-4000.component.html',
  styleUrls: ['./input-desc-4000.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDesc4000Component),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InputDesc4000Component
  implements ControlValueAccessor, OnInit, OnDestroy
{
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
      case 'descMaxLength':
        return errorValue.message;
      default:
        return 'Trường dữ liệu này không được để trống';
    }
  }
}
