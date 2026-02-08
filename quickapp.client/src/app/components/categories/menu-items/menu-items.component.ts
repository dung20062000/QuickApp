import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class MenuItemsComponent implements OnInit {

  private router = inject(Router);
  constructor() { }

  ngOnInit() {
  }

}
