import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';


@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, ToolbarModule,
    FileUploadModule, InputNumberModule, InputIconModule, ConfirmDialogModule, RatingModule, TagModule, IconFieldModule]
})
export class MenuItemsComponent implements OnInit {

  private router = inject(Router);
  constructor() { }

  ngOnInit() {
  }

}
