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
import { Calendar } from 'primeng/calendar';
import { viLocale } from 'ngx-bootstrap/locale'; // Import locale
import { defineLocale } from 'ngx-bootstrap/chronos';

/**
 * Interface for datetime range value
 */
export interface DateTimeRange {
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  startDateTime?: Date | null; // Combined date + start time
  endDateTime?: Date | null; // Combined date + end time
}

/**
 * Custom validator for datetime range validation
 * @param {string} title - Optional title for error messages
 * @returns {ValidatorFn} The validator function
 */
export function datetimeRangeValidator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as DateTimeRange;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }
    if (!value.date || !value.startTime || !value.endTime) {
      return {
        invalidDateTimeRange: {
          message: 'Trường dữ liệu này không được để trống',
        },
      };
    }

    const startHours = value.startTime.getHours();
    const startMinutes = value.startTime.getMinutes();
    const endHours = value.endTime.getHours();
    const endMinutes = value.endTime.getMinutes();

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    if (startTotalMinutes >= endTotalMinutes) {
      return {
        invalidDateTimeRange: {
          message: 'Giờ kết thúc phải lớn hơn giờ bắt đầu',
        },
      };
    }

    return null;
  };
}

@Component({
  selector: 'datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html',
  styleUrls: ['./datetime-range-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeRangePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DatetimeRangePickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  constructor(private localeService: BsLocaleService) {}

  @Input() label: string = 'Thời gian';
  @Input() dateLabel: string = 'Ngày';
  @Input() startTimeLabel: string = 'Bắt đầu';
  @Input() endTimeLabel: string = 'Kết thúc';
  @Input() datePlaceholder: string = 'Chọn ngày...';
  @Input() startTimePlaceholder: string = 'Từ giờ';
  @Input() endTimePlaceholder: string = 'Đến giờ';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};

  // Date picker specific inputs
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() dateInputFormat: string = 'DD/MM/YYYY';
  @Input() containerClass: string = 'theme-dark-blue';
  @Input() showWeekNumbers: boolean = false;
  @Input() adaptivePosition: boolean = false;
  @Input() showTodayButton: boolean = false;
  @Input() disabled: boolean = false;
  @Input() disableDatePicker: boolean = false;
  @Input() dateColSpan: number = 2;
  @Input() timeColSpan: number = 1;

  // Time picker specific inputs
  @Input() hourFormat: string = '24';
  @Input() stepHour: number = 1;
  @Input() stepMinute: number = 15;
  @Input() stepSecond: number = 1;
  @Input() showSeconds: boolean = false;
  @Input() appendTo: string = 'body';

  // Events
  @Output() datetimeRangeChange = new EventEmitter<DateTimeRange | null>();
  @Output() dateChange = new EventEmitter<Date | null>();
  @Output() startTimeChange = new EventEmitter<Date | null>();
  @Output() endTimeChange = new EventEmitter<Date | null>();
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();

  value: DateTimeRange = {
    date: null,
    startTime: null,
    endTime: null,
    startDateTime: null,
    endDateTime: null,
  };

  @ViewChild('datePicker', { static: false })
  datePicker!: BsDatepickerDirective;

  @ViewChild('startTimePicker', { static: false })
  startTimePicker!: Calendar;

  @ViewChild('endTimePicker', { static: false })
  endTimePicker!: Calendar;

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
      value: this.value.date,
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
    if (value && typeof value === 'object') {
      this.value = {
        date: value.date || null,
        startTime: value.startTime || null,
        endTime: value.endTime || null,
        startDateTime: value.startDateTime || null,
        endDateTime: value.endDateTime || null,
      };
    } else {
      this.value = {
        date: null,
        startTime: null,
        endTime: null,
        startDateTime: null,
        endDateTime: null,
      };
    }
    this.updateCombinedDateTimes();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(date: Date | null): void {
    if (date && isNaN(date.getTime())) {
      date = null;
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

    this.value.date = date;
    this.updateCombinedDateTimes();
    this.emitChanges();
    this.dateChange.emit(date);
  }

  onStartTimeChange(time: Date | null): void {
    if (time && isNaN(time.getTime())) {
      time = null;
    }

    this.value.startTime = time;
    this.updateCombinedDateTimes();
    this.emitChanges();
    this.startTimeChange.emit(time);
  }

  onEndTimeChange(time: Date | null): void {
    if (time && isNaN(time.getTime())) {
      time = null;
    }

    this.value.endTime = time;
    this.updateCombinedDateTimes();
    this.emitChanges();
    this.endTimeChange.emit(time);
  }

  private updateCombinedDateTimes(): void {
    this.value.startDateTime = null;
    this.value.endDateTime = null;

    if (this.value.date && this.value.startTime) {
      this.value.startDateTime = new Date(
        this.value.date.getFullYear(),
        this.value.date.getMonth(),
        this.value.date.getDate(),
        this.value.startTime.getHours(),
        this.value.startTime.getMinutes(),
        0,
      );
    }

    if (this.value.date && this.value.endTime) {
      this.value.endDateTime = new Date(
        this.value.date.getFullYear(),
        this.value.date.getMonth(),
        this.value.date.getDate(),
        this.value.endTime.getHours(),
        this.value.endTime.getMinutes(),
        0,
      );
    }
  }

  private emitChanges(): void {
    const hasAnyValue =
      this.value.date || this.value.startTime || this.value.endTime;
    const emitValue = hasAnyValue ? { ...this.value } : null;

    this.onChange(emitValue);
    this.datetimeRangeChange.emit(emitValue);
  }

  onInputFocus(event: any): void {
    this.inputFocus.emit(event);
  }

  onInputBlur(event: any): void {
    this.onTouched();
    this.inputBlur.emit(event);
  }

  clearDate(): void {
    this.onTouched();
    this.value.date = null;
    this.updateCombinedDateTimes();
    this.emitChanges();
    if (this.datePicker) {
      this.datePicker.bsValue = null;
      this.datePicker.hide();
    }
  }

  clearStartTime(): void {
    this.onTouched();
    this.value.startTime = null;
    this.updateCombinedDateTimes();
    this.emitChanges();
    if (this.startTimePicker) {
      this.startTimePicker.writeValue(null);
    }
  }

  clearEndTime(): void {
    this.onTouched();
    this.value.endTime = null;
    this.updateCombinedDateTimes();
    this.emitChanges();
    if (this.endTimePicker) {
      this.endTimePicker.writeValue(null);
    }
  }

  clearAll(): void {
    this.value = {
      date: null,
      startTime: null,
      endTime: null,
      startDateTime: null,
      endDateTime: null,
    };
    this.emitChanges();
    this.inputClear.emit();

    if (this.datePicker) {
      this.datePicker.bsValue = null;
      this.datePicker.hide();
    }
    if (this.startTimePicker) {
      this.startTimePicker.writeValue(null);
    }
    if (this.endTimePicker) {
      this.endTimePicker.writeValue(null);
    }
  }

  toggleDatePicker(): void {
    if (this.disabled || !this.datePicker) {
      return;
    }
    this.datePicker.toggle();
  }

  get hasError(): boolean {
    if (!this.control) {
      return false;
    }
    return this.control.invalid && (this.control.touched || this.submitted);
  }

  get errorMessages(): string[] {
    if (!this.control || !this.hasError) {
      return [];
    }

    const errors = this.control.errors;
    const messages: string[] = [];

    if (errors) {
      let errorKeys = Object.keys(errors);
      let key = errorKeys[0];
      if (this.customValidationMessages[key]) {
        messages.push(this.customValidationMessages[key]);
      } else {
        messages.push(this.getDefaultErrorMessage(key, errors[key]));
      }
      // Object.keys(errors).forEach((key) => {
      //     if (this.customValidationMessages[key]) {
      //         messages.push(this.customValidationMessages[key]);
      //     } else {
      //         messages.push(this.getDefaultErrorMessage(key, errors[key]));
      //     }
      // });
    }

    return messages;
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return 'Trường dữ liệu này không được để trống';
      case 'invalidDateTimeRange':
        return errorValue.message || 'Dữ liệu không đúng định dạng';
      case 'bsDate':
        return 'Dữ liệu không đúng định dạng';
      default:
        return '';
    }
  }

  // Helper method to parse time input for custom formats like "1111" -> "11:11"
  private parseTimeInput(input: string): Date | null {
    if (!input) {
      return null;
    }

    input = input.trim();
    let timeMatch;

    // Format: HH:mm:ss or HH:mm
    timeMatch = input.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
      return this.createTimeDate(hours, minutes, seconds);
    }

    // Format: HHmm (without colons)
    timeMatch = input.match(/^(\d{3,4})$/);
    if (timeMatch) {
      const timeStr = timeMatch[1];
      let hours: number, minutes: number;

      if (timeStr.length === 3) {
        // Format: Hmm (e.g., 930 = 9:30)
        hours = parseInt(timeStr.substring(0, 1), 10);
        minutes = parseInt(timeStr.substring(1, 3), 10);
      } else if (timeStr.length === 4) {
        // Format: HHmm (e.g., 1130 = 11:30)
        hours = parseInt(timeStr.substring(0, 2), 10);
        minutes = parseInt(timeStr.substring(2, 4), 10);
      } else {
        return null;
      }

      return this.createTimeDate(hours, minutes, 0);
    }

    return null;
  }

  private createTimeDate(
    hours: number,
    minutes: number,
    seconds: number = 0,
  ): Date | null {
    // Validate time values
    if (
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      return null;
    }

    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds,
    );
  }

  // Additional methods for time picker interactions (following time-picker component pattern)
  onStartTimeBlur(event: any): void {
    this.onTouched();

    // Get the input value for custom parsing
    let inputValue = '';
    if (event.target) {
      inputValue = event.target.value;
    } else if (this.startTimePicker && this.startTimePicker.inputFieldValue) {
      inputValue = this.startTimePicker.inputFieldValue;
    }

    // Try custom parsing for formats like "1111" -> "11:11"
    if (inputValue && typeof inputValue === 'string') {
      const parsedTime = this.parseTimeInput(inputValue);
      if (parsedTime) {
        this.onStartTimeChange(parsedTime);

        // Update the calendar component with parsed time
        if (this.startTimePicker) {
          this.startTimePicker.writeValue(parsedTime);
          this.startTimePicker.updateInputfield();
        }
      }
    }
  }

  onEndTimeBlur(event: any): void {
    this.onTouched();

    // Get the input value for custom parsing
    let inputValue = '';
    if (event.target) {
      inputValue = event.target.value;
    } else if (this.endTimePicker && this.endTimePicker.inputFieldValue) {
      inputValue = this.endTimePicker.inputFieldValue;
    }

    // Try custom parsing for formats like "1111" -> "11:11"
    if (inputValue && typeof inputValue === 'string') {
      const parsedTime = this.parseTimeInput(inputValue);
      if (parsedTime) {
        this.onEndTimeChange(parsedTime);

        // Update the calendar component with parsed time
        if (this.endTimePicker) {
          this.endTimePicker.writeValue(parsedTime);
          this.endTimePicker.updateInputfield();
        }
      }
    }
  }

  onStartTimeInputChange(event: any): void {
    // Handle input change - this will be called when user types
    const inputValue = event.target?.value || event;
  }

  onEndTimeInputChange(event: any): void {
    // Handle input change - this will be called when user types
    const inputValue = event.target?.value || event;
  }

  onStartTimeInputClick(event: any): void {
    // When user clicks on start time input, show the time picker
    if (!this.disabled && this.startTimePicker) {
      this.startTimePicker.showOverlay();
    }
  }

  onEndTimeInputClick(event: any): void {
    // When user clicks on end time input, show the time picker
    if (!this.disabled && this.endTimePicker) {
      this.endTimePicker.showOverlay();
    }
  }

  onStartTimePickerOpen(): void {}

  onStartTimePickerClose(): void {}

  onEndTimePickerOpen(): void {}

  onEndTimePickerClose(): void {}

  toggleStartTimePicker(): void {
    if (this.disabled) {
      return;
    }
    if (this.startTimePicker) {
      if (this.startTimePicker.overlayVisible) {
        this.startTimePicker.hideOverlay();
      } else {
        this.startTimePicker.showOverlay();
      }
      this.startTimePicker.cd.detectChanges();
    } else {
      console.error('Start time picker component not found');
    }
  }

  toggleEndTimePicker(): void {
    if (this.disabled) {
      return;
    }
    if (this.endTimePicker) {
      if (this.endTimePicker.overlayVisible) {
        this.endTimePicker.hideOverlay();
      } else {
        this.endTimePicker.showOverlay();
      }
      this.endTimePicker.cd.detectChanges();
    } else {
      console.error('End time picker component not found');
    }
  }
}
