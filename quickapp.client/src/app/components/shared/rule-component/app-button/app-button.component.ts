import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.css'],
  standalone: true,
  imports: [CommonModule, MatRippleModule],
})
export class AppButtonComponent {
  @Input() loading: boolean = false;
  @Input() variant:
    | 'blue'
    | 'blueLight'
    | 'red'
    | 'redLight'
    | 'redGray'
    | 'green'
    | 'greenLight'
    | 'gray'
    | 'ghost'
    | 'ghostBlue'
    | 'indigo'
    | 'ghostIndigo'
    | 'ghostRed' = 'blue';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() title: string = '';
  @Input() additionalClass: string = '';
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;
  @Input() leftIconClass: string = '';
  @Input() rightIconClass: string = '';
  @Output() buttonClick = new EventEmitter<Event>();

  getButtonClasses(): string {
    const baseClasses = 'app-button';
    const variantClass = `app-button--${this.variant}`;
    const sizeClass = `app-button--${this.size}`;
    const disabledClass = this.disabled ? 'app-button--disabled' : '';
    const additionalClasses = this.additionalClass ? this.additionalClass : '';

    return `${baseClasses} ${variantClass} ${sizeClass} ${disabledClass} ${additionalClasses}`.trim();
  }

  onButtonClick(event: Event): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
