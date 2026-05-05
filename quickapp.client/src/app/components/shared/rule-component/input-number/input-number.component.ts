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
 * Custom validator for number input validation
 * @param {string} title - The title for error messages
 * @param max
 * @param min
 * @returns {ValidatorFn} The validator function
 */
export function inputNumberValidator(
  title?: string,
  max?: number | undefined,
  min?: number | undefined,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value && value !== 0) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check if value is a valid number
    if (isNaN(value)) {
      return {
        invalidNumber: {
          message: `${title || 'Dữ liệu'} sai định dạng`,
        },
      };
    }

    //check max
    if (max !== undefined && value > max) {
      return {
        max: {
          message: `${title || 'Dữ liệu'} không được lớn hơn ${max}`,
        },
      };
    }

    //check min
    if (min !== undefined && value < min) {
      return {
        min: {
          message: `${title || 'Dữ liệu'} không được nhỏ hơn ${min}`,
        },
      };
    }

    return null;
  };
}

@Component({
  selector: 'input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InputNumberComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = 'Số';
  @Input() placeholder: string = 'Nhập số...';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};

  // Number-specific properties
  @Input() thousandSeparator: string = ',';
  @Input() decimalSeparator: string = '.';
  @Input() decimalPlaces: number = 20;
  @Input() max: number | undefined = undefined;
  @Input() disabled: boolean = false;

  // Events
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputKeyup = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();

  value: number | null = null;
  inputValue: string = '';

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
    this.value = value;
    if (value !== undefined && value !== null && value !== '') {
      this.inputValue = this.formatNumber(value.toString());
    } else {
      this.inputValue = '';
    }
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

  private formatNumber(value: string): string {
    if (!value) {
      return '';
    }

    let [integerPart, decimalPart] = value.split('.');

    integerPart = integerPart.replace(/\D/g, '') || '0';
    let formattedInteger = integerPart;
    if (this.thousandSeparator) {
      formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        this.thousandSeparator,
      );
    }

    if (decimalPart !== undefined) {
      decimalPart = decimalPart.replace(/\D/g, '').slice(0, this.decimalPlaces);
      return `${formattedInteger}${this.decimalSeparator}${decimalPart}`;
    }

    return formattedInteger;
  }

  onInputChange(event: any): void {
    const rawInput = event.target.value;
    const cursorIndex = event.target.selectionStart || 0;
    let endsWithDecimal = false;

    // Clean input - remove all non-numeric characters except decimal separator
    const cleaned = rawInput.replace(
      new RegExp(`[^0-9\\${this.decimalSeparator}]`, 'g'),
      '',
    );

    let normalized = cleaned;
    if (this.decimalSeparator) {
      endsWithDecimal = rawInput.endsWith(this.decimalSeparator);
      normalized = cleaned.replace(this.decimalSeparator, '.');
    }

    const offsetFromEnd = rawInput.length - cursorIndex;

    // Handle decimal places
    const [intPart, decimalPartRaw] = normalized.split('.');
    let limitedValue = intPart;
    if (this.decimalPlaces > 0 && decimalPartRaw !== undefined) {
      if (this.decimalPlaces < decimalPartRaw.length) {
        // Prevent input and restore previous value
        event.target.value = this.inputValue;
        setTimeout(() => {
          const safePos = Math.max(
            0,
            Math.min(this.inputValue.length, cursorIndex - 1),
          );
          event.target.setSelectionRange(safePos, safePos);
        });
        return;
      }
      const limitedDecimal = decimalPartRaw.slice(0, this.decimalPlaces);
      limitedValue = `${intPart}.${limitedDecimal}`;
    }

    // Format for display
    let formatted = this.formatNumber(limitedValue);

    this.inputValue = formatted;

    let changedValue: any = parseFloat(limitedValue);
    if (isNaN(changedValue)) {
      changedValue = null;
    }

    this.value = changedValue;
    this.onChange(changedValue);
    this.inputKeyup.emit(event);

    // Restore cursor position
    setTimeout(() => {
      let newCursor = formatted.length - offsetFromEnd;
      const safePos = Math.max(0, Math.min(formatted.length, newCursor));
      event.target.setSelectionRange(safePos, safePos);
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    const char = event.key;

    if (char === 'Enter') {
      this.onTouched();
      this.inputKeyup.emit(event);
      return;
    }

    // Allow backspace, delete, arrow keys, etc.
    if (
      event.ctrlKey ||
      event.metaKey ||
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)
    ) {
      return;
    }

    // Allow only numbers and decimal separator
    const regex = new RegExp(`^[0-9\\${this.decimalSeparator}]$`);
    if (!regex.test(char)) {
      event.preventDefault();
      return;
    }

    // Check for multiple decimal separators
    const currentValue = (event.target as HTMLInputElement).value;
    if (
      char === this.decimalSeparator &&
      currentValue.includes(this.decimalSeparator)
    ) {
      event.preventDefault();
      return;
    }

    this.inputKeyup.emit(event);
  }

  onInputFocus(event: any): void {
    this.onTouched();
    this.inputFocus.emit(event);
  }

  onInputBlur(event: any): void {
    this.inputBlur.emit(event);
  }

  clearInput(): void {
    this.value = null;
    this.inputValue = '';
    this.onChange(null);
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
      case 'invalidNumber':
        return errorValue.message;
      case 'max':
        return errorValue.message;
      case 'min':
        return errorValue.message;
      default:
        return 'Dữ liệu không hợp lệ';
    }
  }
}
