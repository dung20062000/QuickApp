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
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { AppIconButtonComponent } from '../app-icon-button/app-icon-button.component';

/**
 * Custom validator for time validation
 * @param {string} title - Optional title for error messages
 * @returns {ValidatorFn} The validator function
 */
export function timeValidator(title?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    // Check if the value is a valid date with time
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      return {
        invalidTime: { message: `${title || 'Thời gian'} không hợp lệ` },
      };
    }

    return null;
  };
}

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    AppIconButtonComponent,
  ],
})
export class TimePickerComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = 'Thời gian';
  @Input() placeholder: string = 'HH:mm';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() autofocus: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() showClearButton: boolean = true;
  @Input() customValidationMessages: { [key: string]: string } = {};

  // Time picker specific inputs
  @Input() hourFormat: string = '24'; // "12" or "24"
  @Input() stepHour: number = 1;
  @Input() stepMinute: number = 1;
  @Input() stepSecond: number = 1;
  @Input() showSeconds: boolean = false;
  @Input() disabled: boolean = false;
  @Input() appendTo: string = 'body';
  @Input() styleClass: string = '';

  // Events
  @Output() timeChange = new EventEmitter<Date | null>();
  @Output() inputFocus = new EventEmitter<any>();
  @Output() inputBlur = new EventEmitter<any>();
  @Output() inputClear = new EventEmitter<any>();
  @Output() pickerOpen = new EventEmitter<any>();
  @Output() pickerClose = new EventEmitter<any>();

  value: Date | null = null;
  displayValue: string = '';
  isInputFocused: boolean = false;

  @ViewChild('timePicker', { static: false })
  timePicker!: DatePicker;

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
    // Kiểm tra nếu giá trị truyền vào là chuỗi String (từ API) thì convert sang Date
    if (value && typeof value === 'string') {
      const dateParsed = new Date(value);
      // Kiểm tra xem date có hợp lệ không trước khi gán
      this.value = isNaN(dateParsed.getTime()) ? null : dateParsed;
    } else {
      this.value = value || null;
    }
    this.updateDisplayValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onTimeChange(time: Date | null): void {
    if (time && isNaN(time.getTime())) {
      time = null; // Reset to null if invalid date
    }

    this.value = time;
    this.updateDisplayValue();
    this.onChange(time);
    this.timeChange.emit(time);
  }

  onInputChange(event: any): void {
    // This will be called when the user types in the input
    // We'll let PrimeNG handle the basic input, but add our custom parsing on blur
    const inputValue = event.target?.value || event;
    this.displayValue = inputValue;
  }

  onInputFocus(event: any): void {
    this.isInputFocused = true;
    this.inputFocus.emit(event);
  }

  onInputClick(event: any): void {
    // When user clicks on input, show the time picker
    if (!this.disabled && this.timePicker) {
      console.log('Input clicked, showing time picker');
      this.timePicker.showOverlay();
      this.timePicker.cd.detectChanges();
    }
  }

  onInputBlur(event: any): void {
    this.isInputFocused = false;
    this.onTouched();
    this.inputBlur.emit(event);

    // Get the input value from the event or calendar component
    let inputValue = '';
    if (event.target) {
      inputValue = event.target.value;
    } else if (this.timePicker && this.timePicker.inputFieldValue) {
      inputValue = this.timePicker.inputFieldValue;
    }

    // Try custom parsing for formats like "1111" -> "11:11"
    if (inputValue && typeof inputValue === 'string') {
      const parsedTime = this.parseTimeInput(inputValue);
      if (parsedTime) {
        this.value = parsedTime;
        this.onChange(parsedTime);
        this.timeChange.emit(parsedTime);

        // Update the calendar component with parsed time
        if (this.timePicker) {
          this.timePicker.writeValue(parsedTime);
          this.timePicker.updateInputfield();
        }
        this.updateDisplayValue();
      }
    }
  }

  onPickerOpen(): void {
    this.pickerOpen.emit();
  }

  onPickerClose(): void {
    this.pickerClose.emit();
  }

  clearTime(): void {
    this.value = null;
    this.displayValue = '';
    this.onChange(null);
    this.inputClear.emit();
    if (this.timePicker) {
      this.timePicker.writeValue(null);
    }
  }

  toggleTimePicker(event: any): void {
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    if (this.timePicker) {
      console.log('Toggle time picker clicked', this.timePicker.overlayVisible);
      if (this.timePicker.overlayVisible) {
        this.timePicker.hideOverlay();
      } else {
        this.timePicker.showOverlay();
      }
      this.timePicker.cd.detectChanges();
    } else {
      console.error('Time picker component not found');
    }
  }

  private updateDisplayValue(): void {
    if (this.value) {
      const hours = this.value.getHours().toString().padStart(2, '0');
      const minutes = this.value.getMinutes().toString().padStart(2, '0');

      if (this.showSeconds) {
        const seconds = this.value.getSeconds().toString().padStart(2, '0');
        this.displayValue = `${hours}:${minutes}:${seconds}`;
      } else {
        this.displayValue = `${hours}:${minutes}`;
      }
    } else {
      this.displayValue = '';
    }
  }

  private parseTimeInput(input: string): Date | null {
    // Remove any whitespace
    input = input.trim();

    // Handle different time formats
    let timeMatch;

    // Format: HH:mm:ss or HH:mm
    timeMatch = input.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

      return this.createTimeDate(hours, minutes, seconds);
    }

    // Format: HHmm or HHmmss (without colons)
    timeMatch = input.match(/^(\d{3,4})(\d{2})?$/);
    if (timeMatch) {
      const timeStr = timeMatch[1];
      let hours: number,
        minutes: number,
        seconds = 0;

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

      if (timeMatch[2]) {
        seconds = parseInt(timeMatch[2], 10);
      }

      return this.createTimeDate(hours, minutes, seconds);
    }

    // Format: H:mm or H:m (single digit hour)
    timeMatch = input.match(/^(\d{1}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

      return this.createTimeDate(hours, minutes, seconds);
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
    const timeDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      seconds,
    );

    return timeDate;
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
      case 'invalidTime':
        return errorValue.message || 'Thời gian không hợp lệ';
      default:
        return 'Thời gian không hợp lệ';
    }
  }
}
