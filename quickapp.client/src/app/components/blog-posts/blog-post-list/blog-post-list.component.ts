// BlogPost List Component - uses app-table shared component

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppTableComponent, AppTableTemplateDirective, TableColumn } from '../../shared/rule-component/app-table/app-table.component';
import { AppIconButtonComponent } from '../../shared/rule-component/app-icon-button/app-icon-button.component';
import { BlogPostService } from '../../../services/blog-post.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { BlogPost } from '../../../models/blog-post.model';
import { AppButtonComponent } from '../../shared/rule-component/app-button/app-button.component';

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AppTableComponent,
    AppTableTemplateDirective,
    AppIconButtonComponent,
    AppButtonComponent,
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

  filterTitle = '';
  filterSlug = '';
  filterPublishedDate: Date | null = null;
  filterIsAvailable: boolean | null = null;

  columns: TableColumn[] = [
    {
      field: 'id',
      header: 'STT',
      type: 'number',
      sortable: false,
      width: '60px',
      align: 'center',
    },
    {
      field: 'thumbnailImage',
      header: 'Hình ảnh',
      type: 'custom',
      width: '80px',
      align: 'center',
      sortable: false,
    },
    {
      field: 'title',
      header: 'Tiêu đề',
      type: 'text',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      field: 'slug',
      header: 'Slug',
      type: 'text',
      sortable: false,
      filterable: true,
      filterType: 'text',
    },
    {
      field: 'publishedDate',
      header: 'Ngày đăng',
      type: 'date',
      sortable: true,
      dateFormat: 'dd/MM/yyyy',
      width: '120px',
      filterable: true,
      filterType: 'date',
    },
    {
      field: 'isAvailable',
      header: 'Trạng thái',
      type: 'custom',
      sortable: true,
      width: '130px',
      align: 'center',
      filterable: true,
      filterType: 'dropdown',
      filterOptions: [
        { text: 'Hoạt động', value: true },
        { text: 'Không hoạt động', value: false },
      ],
    },
    {
      field: 'actions',
      header: 'Thao tác',
      type: 'custom',
      width: '130px',
      align: 'center',
      sortable: false,
    },
  ];

  private searchTimeout: any;
  private currentRequest: any;

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

    if (this.filterTitle) request.title = this.filterTitle;
    if (this.filterSlug) request.slug = this.filterSlug;
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
    if (event.filters) {
      const filters = event.filters;
      if (filters['title']?.length) this.filterTitle = filters['title'][0].value || '';
      else this.filterTitle = '';
      if (filters['slug']?.length) this.filterSlug = filters['slug'][0].value || '';
      else this.filterSlug = '';
      if (filters['publishedDate']?.length) this.filterPublishedDate = filters['publishedDate'][0].value || null;
      else this.filterPublishedDate = null;
      if (filters['isAvailable']?.length) this.filterIsAvailable = filters['isAvailable'][0].value ?? null;
      else this.filterIsAvailable = null;
      this.pageIndex = 0;
      this.loadBlogPosts();
      return;
    }
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

  onFilterChange(event: any, field: string): void {
    if (field === 'title') this.filterTitle = event?.target?.value || '';
    if (field === 'slug') this.filterSlug = event?.target?.value || '';
    if (field === 'publishedDate') this.filterPublishedDate = event || null;
    if (field === 'isAvailable') this.filterIsAvailable = event ?? null;
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

  getImageUrl(blogPost: BlogPost): string | null {
    const thumb = blogPost.thumbnailImage;
    if (!thumb) return null;
    if (thumb.startsWith('http')) return thumb;
    return `${window.location.origin}${thumb}`;
  }

  getStt(index: number): number {
    return this.pageIndex * this.rows + index + 1;
  }

  getStatusClass(value: boolean): string {
    return value ? 'badge-success' : 'badge-secondary';
  }

  getStatusLabel(value: boolean): string {
    return value ? 'Hoạt động' : 'Không hoạt động';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.removeAttribute('src');
  }
}
