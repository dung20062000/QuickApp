import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantInfo, RestaurantInfoResponse } from '../../../models/sushi-menu.model';
import { SushiMenuService } from '../../../services/sushi-menu.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RestaurantInfoComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private sushiMenuService = inject(SushiMenuService);
  private alertService = inject(AlertService);

  restaurantForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  currentTab: 'basic' | 'contact' | 'social' = 'basic';

  ngOnInit() {
    this.initForm();
    this.loadRestaurantInfo();
  }

  initForm(): void {
    this.restaurantForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      descriptionVi: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      addressVi: ['', [Validators.required]],
      openHours: ['', [Validators.required]],
      openHoursVi: ['', [Validators.required]],
      facebook: [''],
      instagram: [''],
      twitter: ['']
    });
  }

  loadRestaurantInfo(): void {
    this.isLoading = true;
    this.sushiMenuService.getRestaurantInfo().subscribe({
      next: (response: RestaurantInfoResponse) => {
        // Check if response has data property (API wrapper) or is direct data
        const info: RestaurantInfo = (response as any).data || response;

        this.restaurantForm.patchValue({
          name: info.name,
          description: info.description,
          descriptionVi: info.descriptionVi,
          phone: info.phone,
          email: info.email,
          address: info.address,
          addressVi: info.addressVi,
          openHours: info.openHours,
          openHoursVi: info.openHoursVi,
          facebook: info.socialMedia?.facebook || '',
          instagram: info.socialMedia?.instagram || '',
          twitter: info.socialMedia?.twitter || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading restaurant info:', error);
        this.alertService.showMessage('Error', 'Failed to load restaurant information', MessageSeverity.error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      this.alertService.showMessage('Validation Error', 'Please fill in all required fields correctly', MessageSeverity.warn);
      Object.keys(this.restaurantForm.controls).forEach(key => {
        this.restaurantForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;
    const formValue = this.restaurantForm.value;

    const restaurantData: RestaurantInfo = {
      name: formValue.name,
      description: formValue.description,
      descriptionVi: formValue.descriptionVi,
      phone: formValue.phone,
      email: formValue.email,
      address: formValue.address,
      addressVi: formValue.addressVi,
      openHours: formValue.openHours,
      openHoursVi: formValue.openHoursVi,
      socialMedia: {
        facebook: formValue.facebook || undefined,
        instagram: formValue.instagram || undefined,
        twitter: formValue.twitter || undefined
      }
    };

    // TODO: Implement save API when backend ready
    setTimeout(() => {
      this.alertService.showMessage('Success', 'Restaurant information updated successfully', MessageSeverity.success);
      this.isSaving = false;
      console.log('Saved data:', restaurantData);
    }, 1000);
  }

  switchTab(tab: 'basic' | 'contact' | 'social'): void {
    this.currentTab = tab;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.restaurantForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.restaurantForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'This field is required';
    }
    if (field.hasError('email')) {
      return 'Invalid email format';
    }
    if (field.hasError('pattern')) {
      return 'Invalid phone number format';
    }
    return '';
  }

  // Navigation methods for demo
  navigateToList(): void {
    this.router.navigate(['/management/shop/restaurant-info']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/management/shop/restaurant-info/create']);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/management/shop/restaurant-info/detail', id]);
  }
}
