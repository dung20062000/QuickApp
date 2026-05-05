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
import { debounceTime } from 'rxjs/operators';

/**
 * Custom validator for datetime validation
 * @param {string} title - Optional title for error messages
 * @returns {ValidatorFn} The validator function
 */
export function datetimeValidator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check if the value is a valid date
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return {
        invalidDatetime: { message: `${title || 'Ngày giờ'} không hợp lệ` },
      };
    }

    return null;
  };
}

@Component({
  selector: 'datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
  ],
})
export class DatetimePickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  constructor(private localeService: BsLocaleService) {}

  @Input() label: string = 'Ngày giờ';
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

  // Datetime picker specific inputs
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() dateInputFormat: string = 'DD/MM/YYYY HH:mm';
  @Input() containerClass: string = 'theme-dark-blue';
  @Input() showWeekNumbers: boolean = false;
  @Input() adaptivePosition: boolean = true;
  @Input() showTodayButton: boolean = false;
  @Input() hourStep: number = 1;
  @Input() minuteStep: number = 15;
  @Input() showSeconds: boolean = false;
  @Input() showMeridian: boolean = false; // 24-hour format by default
  @Input() disabled: boolean = false;

  // Events
  @Output() datetimeChange = new EventEmitter<Date | null>();
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();
  @Output() pickerOpen = new EventEmitter<any>();
  @Output() pickerClose = new EventEmitter<any>();

  value: Date | null = null;
  @ViewChild('datePicker', { static: false })
  datePicker!: BsDatepickerDirective;

  private destroy$ = new Subject<void>();
  private confirmSubject$ = new Subject<any>();
  private lastConfirmValue: Date | null = null;
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
      withTimepicker: true,
      keepDatepickerOpened: true,
      isAnimated: true,
      value: this.value,
    };
  }

  ngOnInit() {
    defineLocale('vi', viLocale);
    this.localeService.use('vi');
    this.confirmSubject$
      .pipe(
        debounceTime(300), // 300ms debounce
      )
      .subscribe((event) => {
        // Only emit if value has changed from last confirm
        if (this.value !== this.lastConfirmValue) {
          this.lastConfirmValue = this.value;
          this.datetimeChange.emit(event);
        }
      });
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

  onDatetimeChange(datetime: Date | null): void {
    this.minDate && this.minDate.setSeconds(0, 0);
    this.maxDate && this.maxDate.setSeconds(0, 0);
    if (datetime && isNaN(datetime.getTime())) {
      datetime = null; // Reset to null if invalid date
      this.value = null;
      this.onChange(null);
      this.confirmSubject$.next(datetime);
      return;
    }
    if (datetime) {
      datetime.setSeconds(0, 0); // Reset seconds and milliseconds
      if (this.minDate && datetime < this.minDate) {
        datetime = this.minDate;
      }
      if (this.maxDate && datetime > this.maxDate) {
        datetime = this.maxDate;
      }
    }
    this.value = datetime;
    this.onChange(datetime);
    this.confirmSubject$.next(datetime);
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

  clearDatetime(): void {
    this.value = null;
    this.onChange(null);
    this.inputClear.emit();
    if (this.datePicker) {
      this.datePicker.bsValue = null; // clears internal selected date
      this.datePicker.hide(); // optional: close popup
    }
  }

  toggleDatetimePicker(datetimePicker: any): void {
    if (this.disabled || this.readonly) {
      return;
    }
    datetimePicker.toggle();
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
      case 'invalidDatetime':
        return errorValue.message;
      case 'bsDate':
        return 'Ngày giờ không hợp lệ';
      default:
        return 'Ngày giờ không hợp lệ';
    }
  }
}
