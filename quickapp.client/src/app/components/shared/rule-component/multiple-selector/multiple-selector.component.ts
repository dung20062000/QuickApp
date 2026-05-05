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
  FormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

/**
 * Interface for select options
 */
export interface SelectOption {
  [key: string]: any;
  value: any;
  text: string;
  disabled?: boolean;
}

@Component({
  selector: 'multiple-selector',
  templateUrl: './multiple-selector.component.html',
  styleUrls: ['./multiple-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleSelectorComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
})
export class MultipleSelectorComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() label: string = '';
  @Input() placeholder: string = 'Chọn';
  @Input() notFoundText: string = 'Không có kết quả phù hợp';
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() readonly: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() submitted: boolean = false;
  @Input() customClass: string = '';
  @Input() items: SelectOption[] = [];
  @Input() bindValue: string = 'value';
  @Input() bindLabel: string = 'text';
  @Input() clearable: boolean = true;
  @Input() searchable: boolean = true;
  @Input() virtualScroll: boolean = false;
  @Input() maxSelectedItems?: number;
  @Input() closeOnSelect: boolean = false;
  @Input() hideSelected: boolean = false;
  @Input() customValidationMessages: { [key: string]: string } = {};
  @Input() enableCustomSearch: boolean = false;
  @Input() searchFields: string[] = []; // trường cần tìm kiếm: ['text', 'code', 'email', 'phone']
  @Input() searchFn: ((term: string, item: any) => boolean) | null = null;
  @Input() disabled: boolean = false;
  @Input() appendTo: string = '';
  @Input() hasSelectAll: boolean = false;

  // Events
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() selectionFocus = new EventEmitter<any>();
  @Output() selectionBlur = new EventEmitter<any>();
  @Output() selectionClear = new EventEmitter<any>();
  @Output() selectionOpen = new EventEmitter<any>();
  @Output() selectionClose = new EventEmitter<any>();
  @Output() itemAdd = new EventEmitter<any>();
  @Output() itemRemove = new EventEmitter<any>();

  value: any[] = [];
  searchTerm: string = '';

  private destroy$ = new Subject<void>();
  private onChange = (value: any[]) => {};
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

  writeValue(value: any[]): void {
    this.value = value || [];
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

  onSelectionChange(value: any[]): void {
    this.value = value || [];
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  onSelectionFocus(event: any): void {
    this.onTouched();
    this.selectionFocus.emit(event);
  }

  onSelectionBlur(event: any): void {
    this.selectionBlur.emit(event);
  }

  onSelectionClear(): void {
    this.value = [];
    this.searchTerm = '';
    this.onChange(this.value);
    this.selectionClear.emit();
  }

  onSelectionOpen(): void {
    this.selectionOpen.emit();
  }

  onSelectionClose(): void {
    this.selectionClose.emit();
  }

  onItemAdd(item: any): void {
    this.itemAdd.emit(item);
  }

  onItemRemove(item: any): void {
    this.itemRemove.emit(item);
  }

  onSearch(searchTerm: { term: string }): void {
    this.searchTerm = searchTerm.term || '';
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

  get selectedCount(): number {
    return this.value ? this.value.length : 0;
  }

  get isMaxSelected(): boolean {
    return this.maxSelectedItems
      ? this.selectedCount >= this.maxSelectedItems
      : false;
  }

  get canShowSelectAll(): boolean {
    if (!this.hasSelectAll) {
      return false;
    }
    // Không hiển thị "Chọn tất cả" nếu có giới hạn maxSelectedItems
    if (this.maxSelectedItems) {
      return false;
    }
    // không hiển thị khi đang search
    if (this.searchTerm) {
      return false;
    }
    // không hiển thị khi không có item nào
    if (this.availableItems.length === 0) {
      return false;
    }
    // Chỉ hiển thị nếu có ít nhất 1 item không bị disabled
    return this.availableItems.length > 0;
  }

  get availableItems(): SelectOption[] {
    return this.items.filter((item) => !item.disabled);
  }

  get isAllSelected(): boolean {
    if (this.availableItems.length === 0) {
      return false;
    }
    const availableValues = this.availableItems.map(
      (item) => item[this.bindValue],
    );
    return availableValues.every((val) => this.value.includes(val));
  }

  get isPartiallySelected(): boolean {
    if (this.availableItems.length === 0 || this.value.length === 0) {
      return false;
    }
    const availableValues = this.availableItems.map(
      (item) => item[this.bindValue],
    );
    const selectedAvailableCount = availableValues.filter((val) =>
      this.value.includes(val),
    ).length;
    return (
      selectedAvailableCount > 0 &&
      selectedAvailableCount < availableValues.length
    );
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.unselectAll();
    } else {
      this.selectAll();
    }
  }

  selectAll(): void {
    if (!this.canShowSelectAll) {
      return;
    }

    const availableValues = this.availableItems.map(
      (item) => item[this.bindValue],
    );
    const newValue = [...new Set([...this.value, ...availableValues])];

    this.value = newValue;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  unselectAll(): void {
    if (!this.canShowSelectAll) {
      return;
    }

    const availableValues = this.availableItems.map(
      (item) => item[this.bindValue],
    );
    const newValue = this.value.filter((val) => !availableValues.includes(val));

    this.value = newValue;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  private getDefaultErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return 'Trường dữ liệu này không được để trống';
      case 'minlength':
        return `Vui lòng chọn ít nhất ${errorValue.requiredLength} mục`;
      case 'maxlength':
        return `Chỉ được chọn tối đa ${errorValue.requiredLength} mục`;
      default:
        return 'Trường dữ liệu này không được để trống';
    }
  }
  customSearchFn = (term: string, item: any): boolean => {
    if (this.searchFn) {
      return this.searchFn(term, item);
    }

    // If term is empty, show all items
    if (!term || term.trim() === '') {
      return true;
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
