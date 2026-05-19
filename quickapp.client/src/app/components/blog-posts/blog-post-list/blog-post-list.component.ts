// BlogPost List Component - Master list with table, search, and actions

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppTableComponent, TableColumn } from '../../shared/rule-component/app-table/app-table.component';
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
    AppIconButtonComponent,
    AppButtonComponent,
  ],
})
export class BlogPostListComponent implements OnInit {
  private router = inject(Router);
  private blogPostService = inject(BlogPostService);
  private alertService = inject(AlertService);
  private confirmDialogService = inject(ConfirmDialogService);

  blogPosts: BlogPost[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10;
  pageIndex = 0;

  columns: TableColumn[] = [
    {
      field: 'id',
      header: 'ID',
      type: 'number',
      sortable: true,
      width: '60px',
      align: 'center',
    },
    {
      field: 'thumbnailImage',
      header: 'Hình ảnh',
      type: 'custom',
      width: '90px',
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
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      field: 'publishedDate',
      header: 'Ngày đăng',
      type: 'date',
      sortable: true,
      dateFormat: 'dd/MM/yyyy',
    },
    {
      field: 'isAvailable',
      header: 'Trạng thái',
      type: 'badge',
      sortable: true,
      filterable: true,
      filterType: 'dropdown',
      filterOptions: [
        { text: 'Hoạt động', value: true },
        { text: 'Không hoạt động', value: false },
      ],
      badgeClass: (value: boolean) => (value ? 'badge-success' : 'badge-secondary'),
      width: '140px',
      align: 'center',
    },
    {
      field: 'createdDate',
      header: 'Ngày tạo',
      type: 'datetime',
      sortable: true,
      dateFormat: 'dd/MM/yyyy HH:mm',
    },
    {
      field: 'actions',
      header: 'Thao tác',
      type: 'custom',
      width: '150px',
      align: 'center',
      sortable: false,
    },
  ];

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.loading = true;
    const request = {
      pageIndex: this.pageIndex,
      pageSize: this.rows,
      sortField: 'createdDate',
      sortOrder: -1,
    };

    this.blogPostService.getAll(request).subscribe({
      next: (response) => {
        this.blogPosts = response.data ?? [];
        this.totalRecords = response.totalRecords ?? 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blog posts:', error);
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
    this.pageIndex = event.page ?? 0;
    this.rows = event.rows ?? 10;
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
          this.alertService.showMessage(
            'Thành công',
            'Xóa bài viết thành công',
            MessageSeverity.success,
          );
          this.loadBlogPosts();
        } else {
          this.alertService.showMessage(
            'Lỗi',
            response.message || 'Xóa bài viết thất bại',
            MessageSeverity.error,
          );
        }
      },
      error: (error) => {
        console.error('Error deleting blog post:', error);
        this.alertService.showMessage(
          'Lỗi',
          'Không thể xóa bài viết',
          MessageSeverity.error,
        );
      },
    });
  }

  onCreate(): void {
    this.router.navigate(['/management/shop/blog-posts/create']);
  }

  getThumbnailUrl(blogPost: BlogPost): string | null {
    return blogPost.thumbnailImage ?? null;
  }

  getImageUrl(blogPost: BlogPost): string {
    const thumb = blogPost.thumbnailImage;
    if (!thumb) return '';
    if (thumb.startsWith('http')) return thumb;
    // Trả về URL đầy đủ từ server
    return `${window.location.origin}${thumb}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.png';
  }
}
