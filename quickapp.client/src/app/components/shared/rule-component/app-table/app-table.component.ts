import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  TemplateRef,
  Directive,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

/**
 * Interface for table column configuration
 */
export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'datetime' | 'badge' | 'custom';
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  dateFormat?: string;
  headerClass?: string;
  cellClass?: string;
  badgeClass?: (value: any, row: any) => string;
  filterable?: boolean;
  filterType?: 'text' | 'dropdown' | 'date' | 'date-range';
  filterOptions?: { text: string; value: any }[];
}

/**
 * Directive to identify custom cell templates
 */
@Directive({
  selector: '[appTableTemplate]',
  standalone: true,
})
export class AppTableTemplateDirective {
  @Input('appTableTemplate') field!: string;
  constructor(public templateRef: TemplateRef<any>) {}
}

export const TABLE_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const TABLE_DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    SkeletonModule,
  ],
})
export class AppTableComponent implements AfterContentInit, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'Không tìm thấy dữ liệu phù hợp';
  @Input() paginator: boolean = true;
  @Input() rows: number = TABLE_DEFAULT_PAGE_SIZE;
  @Input() rowsPerPageOptions: number[] = TABLE_PAGE_SIZE_OPTIONS;
  @Input() totalRecords: number | null = null;
  @Input() dataKey: string = 'id';
  @Input() scrollHeight: string = '';
  @Input() skeletonRows: number = 5;

  @Output() tableChange = new EventEmitter<any>();
  @Output() rowHover = new EventEmitter<any>();

  @ContentChildren(AppTableTemplateDirective, { descendants: true })
  templates!: QueryList<AppTableTemplateDirective>;

  templateMap: { [key: string]: TemplateRef<any> } = {};
  skeletonArray: any[] = [];
  hoveredRowId: any = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['skeletonRows']) {
      this.skeletonArray = Array.from({ length: this.skeletonRows }).map((_, i) => ({ [this.dataKey]: `skeleton_${i}` }));
    }
  }

  ngAfterContentInit(): void {
    this.updateTemplateMap();
    this.skeletonArray = Array.from({ length: this.skeletonRows }).map((_, i) => ({ [this.dataKey]: `skeleton_${i}` }));
    this.templates.changes.subscribe(() => {
      this.updateTemplateMap();
    });
  }

  private updateTemplateMap(): void {
    this.templateMap = {};
    if (this.templates) {
      this.templates.forEach((dir) => {
        this.templateMap[dir.field] = dir.templateRef;
      });
    }
  }

  getCellValue(row: any, field: string): any {
    if (!field || !row) return null;
    return field.split('.').reduce((obj, key) => obj?.[key], row);
  }

  formatDate(value: any): string {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('vi-VN');
  }

  formatDatetime(value: any): string {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '—';
    return (
      date.toLocaleDateString('vi-VN') +
      ' ' +
      date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    );
  }

  formatNumber(value: any): string {
    if (value === null || value === undefined) return '—';
    return Number(value).toLocaleString('vi-VN');
  }

  onTableChange(event: any): void {
    this.tableChange.emit(event);
  }

  onRowHover(rowId: any): void {
    this.hoveredRowId = rowId;
    this.rowHover.emit(rowId);
  }

  onRowLeave(): void {
    this.hoveredRowId = null;
  }
}
