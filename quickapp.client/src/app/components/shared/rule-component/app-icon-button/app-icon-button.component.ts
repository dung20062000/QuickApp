import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-icon-button',
  templateUrl: './app-icon-button.component.html',
  styleUrls: ['./app-icon-button.component.css'],
  standalone: true,
  imports: [CommonModule, MatRippleModule, TooltipModule],
})
export class AppIconButtonComponent {
  @Input() loading: boolean = false;
  @Input() variant:
    | 'blue'
    | 'blueLight'
    | 'red'
    | 'redLight'
    | 'redGray'
    | 'orange'
    | 'green'
    | 'greenLight'
    | 'gray'
    | 'ghost' = 'blue';

  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() toolTip = '';
  @Input() additionalClass: string = '';
  @Input() icon: string = '';
  @Input() iconClass?: string = '';
  @Output() buttonClick = new EventEmitter<Event>();

  getButtonClasses(): string {
    const baseClasses = 'app-icon-button';
    const variantClass = `app-icon-button--${this.variant}`;
    const sizeClass = `app-icon-button--${this.size}`;
    const disabledClass = this.disabled ? 'app-icon-button--disabled' : '';
    const additionalClasses = this.additionalClass ? this.additionalClass : '';

    return `${baseClasses} ${variantClass} ${sizeClass} ${disabledClass} ${additionalClasses}`.trim();
  }

  onButtonClick(event: Event): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
