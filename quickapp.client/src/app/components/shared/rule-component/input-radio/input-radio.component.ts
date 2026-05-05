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
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * Interface for radio options
 */
export interface RadioOption {
  value: any;
  text: string;
  disabled?: boolean;
}

@Component({
  selector: 'input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRadioComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InputRadioComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() id: string = 'radio_' + Math.random().toString(36).substring(2, 9);
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() options: RadioOption[] = [];
  @Input() defaultValue: any | null = null;
  @Input() disabled: boolean = false;
  @Input() inline: boolean = true;

  // Events
  @Output() selectionChange = new EventEmitter<any>();
  @Output() selectionFocus = new EventEmitter<any>();
  @Output() selectionBlur = new EventEmitter<any>();

  value: any | null = null;

  private destroy$ = new Subject<void>();
  private onChange = (value: any | null) => {};
  private onTouched = () => {};

  ngOnInit() {
    if (this.defaultValue !== null && this.value === null) {
      this.value = this.defaultValue;
      this.onChange(this.value);
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

  /**
   * Handles option selection and toggle logic
   */
  onOptionClick(event: Event, optionValue: any): void {
    if (this.disabled || this.readonly) return;

    // Prevent default radio behavior to handle toggle manually if needed
    // However, for accessibility, we might want to keep the radio behavior 
    // and just handle the null case.
    
    if (!this.required && this.value === optionValue) {
      // Toggle off if already selected and not required
      setTimeout(() => {
        this.value = null;
        this.onChange(this.value);
        this.selectionChange.emit(this.value);
      }, 0);
    } else {
      this.value = optionValue;
      this.onChange(this.value);
      this.selectionChange.emit(this.value);
    }
    
    this.onTouched();
  }

  onSelectionFocus(event: any): void {
    this.selectionFocus.emit(event);
  }

  onSelectionBlur(event: any): void {
    this.onTouched();
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
