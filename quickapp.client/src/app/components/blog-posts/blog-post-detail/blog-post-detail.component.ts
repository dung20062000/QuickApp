// BlogPost Detail Component - Create / Edit / View modes

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';

import { BlogPostService } from '../../../services/blog-post.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfirmDialogService } from '../../../services/confirm-dialog.service';
import { BlogPost, BlogPostFormData } from '../../../models/blog-post.model';

import { InputVarcharComponent } from '../../shared/rule-component/input-varchar/input-varchar.component';
import { InputTextareaComponent } from '../../shared/rule-component/input-textarea/input-textarea.component';
import { DatePickerComponent } from '../../shared/rule-component/date-picker/date-picker.component';
import { InputCheckboxComponent } from '../../shared/rule-component/input-checkbox/input-checkbox.component';
import { AppIconButtonComponent } from '../../shared/rule-component/app-icon-button/app-icon-button.component';

@Component({
  selector: 'app-blog-post-detail',
  templateUrl: './blog-post-detail.component.html',
  styleUrls: ['./blog-post-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputVarcharComponent,
    InputTextareaComponent,
    DatePickerComponent,
    InputCheckboxComponent,
    AppIconButtonComponent,
  ],
})
export class BlogPostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private blogPostService = inject(BlogPostService);
  private alertService = inject(AlertService);
  private confirmDialogService = inject(ConfirmDialogService);
  private sanitizer = inject(DomSanitizer);

  form!: FormGroup;
  mode: 'create' | 'edit' | 'view' = 'view';
  blogPostId: number | null = null;
  isLoading = false;
  isSaving = false;
  submitted = false;

  previewDialogVisible = false;
  previewContent: SafeHtml = '';
  selectedThumbnailFile: File | null = null;
  thumbnailPreviewUrl: string | null = null;
  deleteThumbnail = false;

  ngOnInit(): void {
    this.initForm();
    this.resolveMode();
  }

  private resolveMode(): void {
    const path = this.route.routeConfig?.path ?? '';
    if (path.includes('create')) {
      this.mode = 'create';
    } else if (path.includes('edit')) {
      this.mode = 'edit';
    } else {
      this.mode = 'view';
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.blogPostId = parseInt(idParam, 10);
      if (!isNaN(this.blogPostId)) {
        this.loadBlogPost(this.blogPostId);
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(500)]],
      slug: ['', [Validators.maxLength(500)]],
      content: ['', [Validators.required]],
      publishedDate: [null],
      isAvailable: [true],
    });
  }

  private loadBlogPost(id: number): void {
    this.isLoading = true;
    this.blogPostService.getById(id).subscribe({
      next: (response) => {
        if (response.data) {
          const bp = response.data;
          this.form.patchValue({
            title: bp.title,
            slug: bp.slug,
            content: bp.content,
            publishedDate: bp.publishedDate ? new Date(bp.publishedDate) : null,
            isAvailable: bp.isAvailable,
          });
          if (bp.thumbnailImage) {
            this.thumbnailPreviewUrl = this.resolveThumbnailUrl(bp.thumbnailImage, bp.id);
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog post:', error);
        this.alertService.showMessage(
          'Lỗi',
          'Không thể tải thông tin bài viết',
          MessageSeverity.error,
        );
        this.isLoading = false;
      },
    });
  }

  private resolveThumbnailUrl(thumbnailImage: string, id: number): string {
    if (!thumbnailImage) return '';
    if (thumbnailImage.startsWith('http')) return thumbnailImage;
    return `https://picsum.photos/seed/${id}/800/400`;
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.alertService.showMessage(
        'Lỗi',
        'Vui lòng chọn file hình ảnh',
        MessageSeverity.warn,
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.alertService.showMessage(
        'Lỗi',
        'Kích thước hình ảnh không được vượt quá 10MB',
        MessageSeverity.warn,
      );
      return;
    }

    this.selectedThumbnailFile = file;
    this.deleteThumbnail = false;
    this.thumbnailPreviewUrl = URL.createObjectURL(file);
  }

  onRemoveThumbnail(): void {
    this.selectedThumbnailFile = null;
    this.deleteThumbnail = true;
    if (this.thumbnailPreviewUrl && !this.thumbnailPreviewUrl.startsWith('http') && this.thumbnailPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.thumbnailPreviewUrl);
    }
    this.thumbnailPreviewUrl = null;
  }

  onPreview(): void {
    this.previewContent = this.sanitizer.bypassSecurityTrustHtml(this.form.value.content || '');
    this.previewDialogVisible = true;
  }

  onSave(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.alertService.showMessage(
        'Validation Error',
        'Vui lòng điền đầy đủ thông tin bắt buộc',
        MessageSeverity.warn,
      );
      return;
    }

    const formData = this.buildFormData();
    this.isSaving = true;

    const request$ =
      this.mode === 'create'
        ? this.blogPostService.create(formData)
        : this.blogPostService.update(this.blogPostId!, formData);

    request$.subscribe({
      next: (response) => {
        if (response.status === 1 || response.status === 200) {
          this.alertService.showMessage(
            'Thành công',
            this.mode === 'create' ? 'Tạo bài viết thành công' : 'Cập nhật bài viết thành công',
            MessageSeverity.success,
          );
          if (this.mode === 'create' && response.data?.id) {
            this.router.navigate(['/management/shop/blog-posts/view', response.data.id]);
          } else {
            this.router.navigate(['/management/shop/blog-posts']);
          }
        } else {
          this.alertService.showMessage(
            'Lỗi',
            response.message || 'Đã xảy ra lỗi',
            MessageSeverity.error,
          );
        }
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error saving blog post:', error);
        this.alertService.showMessage(
          'Lỗi',
          'Không thể lưu bài viết',
          MessageSeverity.error,
        );
        this.isSaving = false;
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const values = this.form.value;

    formData.append('title', values.title ?? '');
    formData.append('content', values.content ?? '');
    if (values.slug) formData.append('slug', values.slug);
    formData.append('isAvailable', String(values.isAvailable ?? true));
    if (values.publishedDate) {
      formData.append('publishedDate', new Date(values.publishedDate).toISOString());
    }
    if (this.selectedThumbnailFile) {
      formData.append('thumbnail', this.selectedThumbnailFile);
    }
    if (this.deleteThumbnail) {
      formData.append('deleteThumbnail', 'true');
    }

    return formData;
  }

  onBack(): void {
    this.router.navigate(['/management/shop/blog-posts']);
  }

  onEdit(): void {
    if (this.blogPostId) {
      this.router.navigate(['/management/shop/blog-posts/edit', this.blogPostId]);
    }
  }

  onDelete(): void {
    if (!this.blogPostId) return;
    this.confirmDialogService
      .showConfirm({
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.',
        confirmText: 'Xóa',
        cancelText: 'Hủy',
        icon: 'danger',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.executeDelete();
        }
      });
  }

  private executeDelete(): void {
    this.isSaving = true;
    this.blogPostService.delete(this.blogPostId!).subscribe({
      next: (response) => {
        if (response.status === 1 || response.status === 200) {
          this.alertService.showMessage(
            'Thành công',
            'Xóa bài viết thành công',
            MessageSeverity.success,
          );
          this.router.navigate(['/management/shop/blog-posts']);
        } else {
          this.alertService.showMessage(
            'Lỗi',
            response.message || 'Xóa bài viết thất bại',
            MessageSeverity.error,
          );
        }
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error deleting blog post:', error);
        this.alertService.showMessage(
          'Lỗi',
          'Không thể xóa bài viết',
          MessageSeverity.error,
        );
        this.isSaving = false;
      },
    });
  }

  get pageTitle(): string {
    switch (this.mode) {
      case 'create':
        return 'Tạo bài viết mới';
      case 'edit':
        return 'Chỉnh sửa bài viết';
      default:
        return 'Chi tiết bài viết';
    }
  }

  get isReadOnly(): boolean {
    return this.mode === 'view';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.png';
  }
}
