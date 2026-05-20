// BlogPost List Component

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppTableComponent, AppTableTemplateDirective, TableColumn } from '../../shared/rule-component/app-table/app-table.component';
import { AppButtonComponent } from '../../shared/rule-component/app-button/app-button.component';
import { BlogPostService } from '../../../services/blog-post.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { BlogPost } from '../../../models/blog-post.model';
import { DatePickerComponent } from '../../shared/rule-component/date-picker/date-picker.component';
import { SelectorComponent } from '../../shared/rule-component/selector/selector.component';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppTableComponent,
    AppTableTemplateDirective,
    AppButtonComponent,
    DatePickerComponent,
    SelectorComponent,
  ],
})
export class BlogPostListComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private blogPostService = inject(BlogPostService);
  private alertService = inject(AlertService);
  private confirmDialogService = inject(ConfirmDialogService);

  blogPosts: BlogPost[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10;
  pageIndex = 0;

  sortField = 'createdDate';
  sortOrder = -1;

  searchKeyword = '';
  filterPublishedDate: Date | null = null;
  filterIsAvailable: boolean | null = null;
  filterPanelExpanded = false;
  hoveredRowId: number | null = null;

  private searchTimeout: any;
  private currentRequest: any;

  statusOptions = [
    { text: 'Hoạt động', value: true },
    { text: 'Không hoạt động', value: false },
  ];

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchKeyword) count++;
    if (this.filterPublishedDate) count++;
    if (this.filterIsAvailable !== null) count++;
    return count;
  }

  columns: TableColumn[] = [
    {
      field: 'id',
      header: 'STT',
      type: 'number',
      sortable: false,
      width: '64px',
      align: 'center',
    },
    {
      field: 'thumbnailImage',
      header: '',
      type: 'custom',
      width: '64px',
      align: 'center',
      sortable: false,
    },
    {
      field: 'title',
      header: 'BÀI VIẾT',
      type: 'custom',
      sortable: true,
      minWidth: '280px',
    },
    {
      field: 'publishedDate',
      header: 'NGÀY ĐĂNG',
      type: 'custom',
      sortable: true,
      width: '130px',
      align: 'center',
    },
    {
      field: 'isAvailable',
      header: 'TRẠNG THÁI',
      type: 'custom',
      sortable: true,
      width: '150px',
      align: 'center',
    },
    {
      field: 'actions',
      header: '',
      type: 'custom',
      width: '120px',
      align: 'right',
      sortable: false,
    },
  ];

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  ngOnDestroy(): void {
    clearTimeout(this.searchTimeout);
    if (this.currentRequest) {
      this.currentRequest.unsubscribe();
    }
  }

  loadBlogPosts(): void {
    this.loading = true;

    if (this.currentRequest) {
      this.currentRequest.unsubscribe();
    }

    const request: any = {
      pageIndex: this.pageIndex,
      pageSize: this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    };

    if (this.searchKeyword) request.search = this.searchKeyword;
    if (this.filterPublishedDate) request.publishedDate = this.filterPublishedDate;
    if (this.filterIsAvailable !== null) request.isAvailable = this.filterIsAvailable;

    this.currentRequest = this.blogPostService.getAll(request).subscribe({
      next: (response) => {
        this.blogPosts = response.data ?? [];
        this.totalRecords = response.totalRecords ?? 0;
        this.loading = false;
      },
      error: () => {
        this.alertService.showMessage(
          'Lỗi',
          'Không thể tải danh sách bài viết',
          MessageSeverity.error,
        );
        this.loading = false;
      },
    });
  }

  onTableChange(event: any): void {
    if (event.page !== undefined) {
      this.pageIndex = event.page;
    }
    if (event.rows !== undefined) {
      this.rows = event.rows;
    }
    if (event.sortField !== undefined) {
      this.sortField = event.sortField;
    }
    if (event.sortOrder !== undefined) {
      this.sortOrder = event.sortOrder === 'asc' ? 1 : -1;
    }
    this.loadBlogPosts();
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageIndex = 0;
      this.loadBlogPosts();
    }, 400);
  }

  onSearchInputChange(value: string): void {
    this.searchKeyword = value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageIndex = 0;
      this.loadBlogPosts();
    }, 600);
  }

  clearSearch(): void {
    this.searchKeyword = '';
    clearTimeout(this.searchTimeout);
    this.pageIndex = 0;
    this.loadBlogPosts();
  }

  toggleFilterPanel(): void {
    this.filterPanelExpanded = !this.filterPanelExpanded;
  }

  onFilterDateChange(value: Date | null): void {
    this.filterPublishedDate = value;
    this.pageIndex = 0;
    this.loadBlogPosts();
  }

  onFilterStatusChange(value: boolean | null): void {
    this.filterIsAvailable = value ?? null;
    this.pageIndex = 0;
    this.loadBlogPosts();
  }

  clearAllFilters(): void {
    this.searchKeyword = '';
    this.filterPublishedDate = null;
    this.filterIsAvailable = null;
    this.pageIndex = 0;
    this.loadBlogPosts();
  }

  onView(blogPost: BlogPost): void {
    this.router.navigate(['/management/shop/blog-posts/view', blogPost.id]);
  }

  onEdit(blogPost: BlogPost): void {
    this.router.navigate(['/management/shop/blog-posts/edit', blogPost.id]);
  }

  onDelete(blogPost: BlogPost): void {
    this.confirmDialogService
      .showConfirm({
        title: 'Xác nhận xóa',
        message: `Bạn có chắc chắn muốn xóa bài viết "${blogPost.title}"? Hành động này không thể hoàn tác.`,
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        icon: 'danger',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete(blogPost);
        }
      });
  }

  private executeDelete(blogPost: BlogPost): void {
    this.blogPostService.delete(blogPost.id).subscribe({
      next: (response) => {
        if (response.status === 1 || response.status === 200) {
          this.alertService.showMessage('Thành công', 'Xóa bài viết thành công', MessageSeverity.success);
          this.loadBlogPosts();
        } else {
          this.alertService.showMessage('Lỗi', response.message || 'Xóa bài viết thất bại', MessageSeverity.error);
        }
      },
      error: () => {
        this.alertService.showMessage('Lỗi', 'Không thể xóa bài viết', MessageSeverity.error);
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/management/shop/blog-posts/create']);
  }

  onRowHover(rowId: number | null): void {
    this.hoveredRowId = rowId;
  }

  getImageUrl(blogPost: BlogPost): string | null {
    const thumb = blogPost.thumbnailImage;
    if (!thumb) return null;
    if (thumb.startsWith('http')) return thumb;
    return `${window.location.origin}${thumb}`;
  }

  getStt(index: number): number {
    return this.pageIndex * this.rows + index + 1;
  }

  formatDate(value: any): string {
    if (!value) return '—';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('vi-VN');
  }

  getStatusLabel(value: boolean): string {
    return value ? 'Hoạt động' : 'Không hoạt động';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.removeAttribute('src');
  }
}
