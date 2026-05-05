import { AppIconButtonComponent } from '../app-icon-button/app-icon-button.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  BsDaterangepickerConfig,
  BsDaterangepickerDirective,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { viLocale } from 'ngx-bootstrap/locale'; // Import locale
import { defineLocale } from 'ngx-bootstrap/chronos';

export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
}

/**
 * Custom validator for date range validation
 * @param {string} title - Optional title for error messages
 * @returns {ValidatorFn} The validator function
 */
export function dateRangeValidator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: DateRange = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check if start date is valid
    if (
      value.startDate &&
      (!(value.startDate instanceof Date) || isNaN(value.startDate.getTime()))
    ) {
      return {
        invalidStartDate: {
          message: `${title || 'Ngày bắt đầu'} không hợp lệ`,
        },
      };
    }

    // Check if end date is valid
    if (
      value.endDate &&
      (!(value.endDate instanceof Date) || isNaN(value.endDate.getTime()))
    ) {
      return {
        invalidEndDate: { message: `${title || 'Ngày kết thúc'} không hợp lệ` },
      };
    }

    // Check if start date is before end date
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      return {
        invalidDateRange: {
          message: `${title || 'Ngày bắt đầu'} phải trước ngày kết thúc`,
        },
      };
    }

    return null;
  };
}

@Component({
  selector: 'date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BsDatepickerModule, AppIconButtonComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
})
export class DateRangePickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  constructor(private localeService: BsLocaleService) {}

  @Input() label: string = 'Khoảng ngày';
  @Input() placeholder: string = '';
  @Input() startPlaceholder: string = 'Từ ngày...';
  @Input() endPlaceholder: string = 'Đến ngày...';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};

  // Date range picker specific inputs
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() dateInputFormat: string = 'DD/MM/YYYY';
  @Input() containerClass: string = 'theme-dark-blue';
  @Input() showWeekNumbers: boolean = false;
  @Input() adaptivePosition: boolean = true;
  @Input() showTodayButton: boolean = false;
  @Input() ranges: any[] = [];
  @Input() maxDateRange: number | null = null; // Maximum number of days in range
  @Input() disabled: boolean = false;

  // Events
  @Output() dateRangeChange = new EventEmitter<DateRange | null>();
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();
  @Output() pickerOpen = new EventEmitter<any>();
  @Output() pickerClose = new EventEmitter<any>();

  value: DateRange | null = null;

  private destroy$ = new Subject<void>();
  private onChange = (value: any) => {};
  private onTouched = () => {};

  @ViewChild('dateRangePicker', { static: false })
  dateRangePicker!: BsDaterangepickerDirective;

  // Date range picker configuration
  get bsConfig(): Partial<BsDaterangepickerConfig> {
    return {
      dateInputFormat: this.dateInputFormat,
      showWeekNumbers: this.showWeekNumbers,
      containerClass: this.containerClass,
      adaptivePosition: this.adaptivePosition,
      showTodayButton: this.showTodayButton,
      ranges: this.ranges && this.ranges.length > 0 ? this.ranges : undefined,
      maxDateRange: this.maxDateRange || undefined,
      isAnimated: true,
      value: (this.value && this.value.startDate && this.value.endDate) ? [this.value.startDate, this.value.endDate] : undefined,
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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateRangeChange(dateRange: any): void {
    this.minDate && this.minDate.setHours(0, 0, 0, 0);
    this.maxDate && this.maxDate.setHours(23, 59, 59, 999);
    let value: DateRange | null = null;

    if (dateRange && dateRange.length === 2) {
      dateRange[0].setHours(0, 0, 0, 0);
      dateRange[1].setHours(23, 59, 59, 999);
      if (this.maxDate && dateRange[1] > this.maxDate) {
        dateRange[1] = this.maxDate;
      }
      if (this.minDate && dateRange[0] < this.minDate) {
        dateRange[0] = this.minDate;
      }
      if (dateRange[0] > dateRange[1]) {
        dateRange[0] = dateRange[1];
      }
      value = {
        startDate: dateRange[0],
        endDate: dateRange[1],
      };
    }

    this.value = value;
    this.onChange(value);
    this.dateRangeChange.emit(value);
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

  clearDateRange(): void {
    this.value = null;
    this.onChange(null);
    this.inputClear.emit();
    if (this.dateRangePicker) {
      this.dateRangePicker.bsValue = undefined; // clears internal selection
      this.dateRangePicker.hide(); // optional: close popup
    }
  }

  toggleDateRangePicker(dateRangePicker: any): void {
    if (this.disabled || this.readonly) {
      return;
    }
    dateRangePicker.toggle();
  }

  get displayValue(): string {
    if (!this.value || (!this.value.startDate && !this.value.endDate)) {
      return '';
    }

    const formatDate = (date: Date | null): string => {
      if (!date) {
        return '';
      }
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    const startStr = formatDate(this.value.startDate || null);
    const endStr = formatDate(this.value.endDate || null);

    if (startStr && endStr) {
      return `${startStr} - ${endStr}`;
    } else if (startStr) {
      return `Từ ${startStr}`;
    } else if (endStr) {
      return `Đến ${endStr}`;
    }

    return '';
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
      case 'invalidStartDate':
        return errorValue.message;
      case 'invalidEndDate':
        return errorValue.message;
      case 'invalidDateRange':
        return errorValue.message;
      case 'bsDate':
        return 'Khoảng ngày không hợp lệ';
      default:
        return 'Khoảng ngày không hợp lệ';
    }
  }
}
