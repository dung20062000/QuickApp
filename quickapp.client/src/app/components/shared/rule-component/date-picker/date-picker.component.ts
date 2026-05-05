import { AppIconButtonComponent } from '../app-icon-button/app-icon-button.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { viLocale } from 'ngx-bootstrap/locale'; // Import locale
import { defineLocale } from 'ngx-bootstrap/chronos';

/**
 * Custom validator for date validation
 * @param {string} title - Optional title for error messages
 * @returns {ValidatorFn} The validator function
 */
export function dateValidator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check if the value is a valid date
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return { invalidDate: { message: `${title || 'Ngày'} không hợp lệ` } };
    }

    return null;
  };
}

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule, AppIconButtonComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  constructor(private localeService: BsLocaleService) {}
  @Input() label: string = 'Ngày';
  @Input() placeholder: string = 'Nhập...';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};

  // Date picker specific inputs
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() dateInputFormat: string = 'DD/MM/YYYY';
  @Input() containerClass: string = 'theme-dark-blue';
  @Input() showWeekNumbers: boolean = false;
  @Input() adaptivePosition: boolean = true;
  @Input() showTodayButton: boolean = false;
  @Input() disabled: boolean = false;

  // Events
  @Output() dateChange = new EventEmitter<Date | null>();
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();
  @Output() pickerOpen = new EventEmitter<any>();
  @Output() pickerClose = new EventEmitter<any>();

  value: Date | null = null;

  @ViewChild('datePicker', { static: false })
  datePicker!: BsDatepickerDirective;

  private destroy$ = new Subject<void>();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Date picker configuration
  get bsConfig(): Partial<BsDatepickerConfig> {
    return {
      dateInputFormat: this.dateInputFormat,
      showWeekNumbers: this.showWeekNumbers,
      containerClass: this.containerClass,
      adaptivePosition: this.adaptivePosition,
      showTodayButton: this.showTodayButton,
      isAnimated: true,
      value: this.value || undefined,
    };
  }

  ngOnInit() {
    defineLocale('vi', viLocale);
    this.localeService.use('vi');
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
    this.value = value || null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(date: Date | null): void {
    this.minDate && this.minDate.setHours(0, 0, 0, 0);
    this.maxDate && this.maxDate.setHours(23, 59, 59, 999);
    if (date && isNaN(date.getTime())) {
      date = null; // Reset to null if invalid date
      this.value = null;
      this.onChange(null);
      this.dateChange.emit(date);
      return;
    }
    if (date) {
      date.setHours(0, 0, 0, 0); // Reset time to midnight
      if (this.minDate && date < this.minDate) {
        date = this.minDate;
      }
      if (this.maxDate && date > this.maxDate) {
        date = this.maxDate;
      }
    }
    this.value = date;
    this.onChange(date);
    this.dateChange.emit(date);
  }

  onInputFocus(event: any): void {
    this.inputFocus.emit(event);
  }

  onInputBlur(event: any): void {
    this.onTouched();
    this.inputBlur.emit(event);
  }

  onPickerOpen(): void {
    this.pickerOpen.emit();
  }

  onPickerClose(): void {
    this.pickerClose.emit();
  }

  clearDate(): void {
    this.value = null;
    this.onChange(null);
    this.inputClear.emit();
    if (this.datePicker) {
      this.datePicker.bsValue = undefined; // clears internal selected date
      this.datePicker.hide(); // optional: close popup
    }
  }

  toggleDatePicker(datePicker: any): void {
    if (this.disabled) {
      return;
    }
    datePicker.toggle();
  }

  get hasError(): boolean {
    if (!this.control) {
      return false;
    }
    //(submitted  && f.hoten.invalid) || (f.hoten.invalid && (f.hoten.dirty || f.hoten.touched))
    return this.control.invalid && (this.control.touched || this.submitted);
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
      case 'invalidDate':
        return errorValue.message;
      case 'bsDate':
        return 'Ngày không hợp lệ';
      default:
        return 'Ngày không hợp lệ';
    }
  }
}
