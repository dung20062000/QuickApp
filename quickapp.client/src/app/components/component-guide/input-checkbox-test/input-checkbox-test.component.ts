import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  InputCheckboxComponent,
  CheckboxOption,
} from '../../shared/rule-component/input-checkbox/input-checkbox.component';

interface ComponentTest {
  component: string;
  componentType: string;
  description: string;
  form: FormGroup;
  submitted: boolean;
  config?: any;
}

@Component({
  selector: 'app-input-checkbox-test',
  templateUrl: './input-checkbox-test.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputCheckboxComponent],
})
export class InputCheckboxTestComponent implements OnInit {
  componentTests: ComponentTest[] = [];

  hobbyOptions: CheckboxOption[] = [
    { value: 'coding', text: 'Lập trình' },
    { value: 'music', text: 'Nghe nhạc' },
    { value: 'travel', text: 'Du lịch' },
    { value: 'sports', text: 'Thể thao', disabled: true },
  ];

  constructor(private fb: FormBuilder) {
    this.initializeComponentTests();
  }

  ngOnInit(): void {}

  private initializeComponentTests(): void {
    this.componentTests = [
      this.createComponentTest(
        'InputCheckboxComponent (Single)',
        'input-checkbox',
        `Chọn đơn (Boolean):
- Sử dụng cho các trường hợp true/false.
- Tích chọn để đồng ý hoặc kích hoạt tính năng.`,
        {
          agreement: [false, [Validators.requiredTrue]],
        },
        {
          label: 'Tôi đồng ý với điều khoản sử dụng',
          required: true,
          formControlName: 'agreement',
        },
      ),

      this.createComponentTest(
        'InputCheckboxComponent (Group)',
        'input-checkbox',
        `Chọn nhiều (Group):
- Truyền vào danh sách 'options'.
- Trả về một mảng các giá trị được chọn.
- Hỗ trợ layout inline hoặc vertical.`,
        {
          hobbies: [['coding', 'music']],
        },
        {
          label: 'Sở thích của bạn',
          required: false,
          options: this.hobbyOptions,
          formControlName: 'hobbies',
        },
      ),

      this.createComponentTest(
        'InputCheckboxComponent (Disabled - Single)',
        'input-checkbox',
        `Vô hiệu hóa (Chọn đơn):
- Trạng thái vô hiệu hóa khi chọn đơn.
- Giao diện xám và không thể tương tác.`,
        {
          disabledSingle: [true],
        },
        {
          label: 'Lựa chọn này bị vô hiệu hóa',
          required: false,
          disabled: true,
          formControlName: 'disabledSingle',
        },
      ),

      this.createComponentTest(
        'InputCheckboxComponent (Disabled - Group)',
        'input-checkbox',
        `Vô hiệu hóa (Chọn nhóm):
- Vô hiệu hóa toàn bộ danh sách lựa chọn.
- Các item đều không thể tương tác.`,
        {
          disabledGroup: [['opt1']],
        },
        {
          label: 'Nhóm lựa chọn bị vô hiệu hóa',
          required: false,
          disabled: true,
          options: [
            { value: 'opt1', text: 'Lựa chọn 1' },
            { value: 'opt2', text: 'Lựa chọn 2' },
          ],
          formControlName: 'disabledGroup',
        },
      ),
    ];
  }

  private createComponentTest(
    component: string,
    componentType: string,
    description: string,
    formConfig: any,
    componentConfig: any = {},
  ): ComponentTest {
    return {
      component,
      componentType,
      description,
      form: this.fb.group(formConfig),
      submitted: false,
      config: componentConfig,
    };
  }

  onSubmit(componentTest: ComponentTest): void {
    componentTest.submitted = true;
    if (componentTest.form.valid) {
      console.log(
        `${componentTest.component} Form Data:`,
        componentTest.form.value,
      );
    }
  }

  onReset(componentTest: ComponentTest): void {
    componentTest.submitted = false;
    componentTest.form.reset();
  }

  getFormValue(form: FormGroup): string {
    const value = form.value;
    const firstControl = Object.keys(value)[0];
    const controlValue = value[firstControl];

    if (Array.isArray(controlValue)) {
      return JSON.stringify(controlValue);
    }
    return String(controlValue);
  }

  getValueType(form: FormGroup): string {
    const value = form.value;
    const firstControl = Object.keys(value)[0];
    const controlValue = value[firstControl];
    return Array.isArray(controlValue) ? 'array' : typeof controlValue;
  }
}
