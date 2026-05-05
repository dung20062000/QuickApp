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
import { Subject, takeUntil } from 'rxjs';

/**
 * Interface for gender options
 */
export interface GenderOption {
  value: boolean;
  text: string;
  disabled?: boolean;
}

@Component({
  selector: 'gender-radio',
  templateUrl: './gender-radio.component.html',
  styleUrls: ['./gender-radio.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenderRadioComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class GenderRadioComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = 'Giới tính';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() options: any[] = [];
  @Input() defaultValue: any | null = null;
  @Input() disabled: boolean = false;

  // Events
  @Output() selectionChange = new EventEmitter<boolean>();
  @Output() selectionFocus = new EventEmitter<any>();
  @Output() selectionBlur = new EventEmitter<any>();

  value: boolean | null = null;

  // Default gender options
  // genderOptions: GenderOption[] = [
  //     { value: true, text: "Nam" },
  //     { value: false, text: "Nữ" },
  // ];

  private destroy$ = new Subject<void>();
  private onChange = (value: boolean | null) => {};
  private onTouched = () => {};

  ngOnInit() {
    if (this.defaultValue != null && this.value == null) {
      this.value = this.defaultValue;
      this.onChange(this.value);
    }
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
    if (value !== undefined && value !== null) {
      this.value = value;
    } else if (this.defaultValue !== null && this.defaultValue !== undefined) {
      this.value = this.defaultValue;
      setTimeout(() => this.onChange(this.value), 0);
    } else {
      this.value = null;
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

  onSelectionChange(value: boolean): void {
    this.value = value;
    this.onChange(value);
    this.selectionChange.emit(value);
  }

  onSelectionFocus(event: any): void {
    this.onTouched();
    this.selectionFocus.emit(event);
  }

  onSelectionBlur(event: any): void {
    this.selectionBlur.emit(event);
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
      default:
        return 'Trường dữ liệu này không được để trống';
    }
  }
}
