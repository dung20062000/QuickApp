import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-component-guide',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="component-guide-layout">
      <nav class="sidebar">
        <div class="sidebar-header">
          <h3>UI Library</h3>
        </div>
        <ul class="nav-list">
          <li><a routerLink="buttons" routerLinkActive="active">Buttons</a></li>
          <li><a routerLink="inputs" routerLinkActive="active">Inputs</a></li>
          <li>
            <a routerLink="date-pickers" routerLinkActive="active"
              >Date Pickers</a
            >
          </li>
          <li>
            <a routerLink="selectors" routerLinkActive="active">Selectors</a>
          </li>
          <li>
            <a routerLink="gender-radio" routerLinkActive="active"
              >Gender Radio</a
            >
          </li>
          <li>
            <a routerLink="input-radio" routerLinkActive="active"
              >Generic Radio</a
            >
          </li>
          <li>
            <a routerLink="input-checkbox" routerLinkActive="active"
              >Checkbox</a
            >
          </li>
        </ul>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .component-guide-layout {
        display: flex;
        min-height: 100vh;
        background: #f8f9fa;
      }
      .sidebar {
        width: 177px;
        background: #fff;
        border-right: 1px solid #e0e0e0;
        padding: 20px 0;
        position: sticky;
        top: 0;
        height: 100vh;
      }
      .sidebar-header {
        padding: 0 20px 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
      }
      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .nav-list li a {
        display: block;
        padding: 12px 20px;
        color: #444;
        text-decoration: none;
        transition: all 0.2s;
        border-left: 4px solid transparent;
      }
      .nav-list li a:hover {
        background: #f0f7ff;
        color: #007bff;
      }
      .nav-list li a.active {
        background: #e7f1ff;
        color: #007bff;
        border-left-color: #007bff;
        font-weight: 600;
      }
      .content {
        flex: 1;
        overflow-y: auto;
      }
    `,
  ],
})
export class ComponentGuideComponent {}
