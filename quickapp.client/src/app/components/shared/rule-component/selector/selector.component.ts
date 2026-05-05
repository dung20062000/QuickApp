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
 * Interface for select options
 */
export interface SelectOption {
  value: any;
  text: string;
  disabled?: boolean;
}

@Component({
  selector: 'selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SelectorComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = '';
  @Input() placeholder: string = 'Chọn';
  @Input() notFoundText: string = 'Không có dữ liệu phù hợp';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() items: SelectOption[] = [];
  @Input() bindValue: string = 'value';
  @Input() bindLabel: string = 'text';
  @Input() appendTo: string = '';
  @Input() clearable: boolean = true;
  @Input() searchable: boolean = true;
  @Input() virtualScroll: boolean = false;
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;

  @Input() enableCustomSearch: boolean = false;
  @Input() searchFields: string[] = []; // trường cần tìm kiếm: ['text', 'code', 'email', 'phone']
  @Input() searchFn: ((term: string, item: any) => boolean) | null = null;

  // Events
  @Output() selectionChange = new EventEmitter<any>();
  @Output() selectionFocus = new EventEmitter<any>();
  @Output() selectionBlur = new EventEmitter<any>();
  @Output() selectionClear = new EventEmitter<any>();
  @Output() selectionOpen = new EventEmitter<any>();
  @Output() selectionClose = new EventEmitter<any>();

  value: any = null;

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

  onSelectionChange(value: any): void {
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

  onSelectionClear(): void {
    this.value = null;
    this.onChange(null);
    this.selectionClear.emit();
  }

  onSelectionOpen(): void {
    this.selectionOpen.emit();
  }

  onSelectionClose(): void {
    this.selectionClose.emit();
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
  customSearchFn = (term: string, item: any): boolean => {
    if (this.searchFn) {
      return this.searchFn(term, item);
    }
    const termNormalized = this.normalizeVietnamese(term);
    const labelNormalized = this.normalizeVietnamese(
      item[this.bindLabel]?.toString() || '',
    );
    if (!this.enableCustomSearch) {
      return labelNormalized.includes(termNormalized);
    }
    if (labelNormalized.includes(termNormalized)) {
      return true;
    }
    if (this.searchFields && this.searchFields.length > 0) {
      return this.searchFields.some((field) => {
        if (field === this.bindLabel) {
          return false;
        }
        const fieldValue = this.normalizeVietnamese(
          item[field]?.toString() || '',
        );
        return fieldValue.includes(termNormalized);
      });
    }
    return false;
  };

  normalizeVietnamese = (str: string): string => {
    return str
      .normalize('NFD') // tách dấu ra ký tự riêng
      .replace(/[\u0300-\u036f]/g, '') // xóa dấu
      .replace(/đ/g, 'd') // thay đ
      .replace(/Đ/g, 'D') // thay Đ
      .toLowerCase()
      .trim();
  };
}
