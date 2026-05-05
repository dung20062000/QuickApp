import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { inputCCCD12Validator } from '../../shared/rule-component/input-cccd-12/input-cccd-12.component';
import { inputCode20Validator } from '../../shared/rule-component/input-code-20/input-code-20.component';
import { inputNumberValidator } from '../../shared/rule-component/input-number/input-number.component';
import { inputCodeNumber5Validator } from '../../shared/rule-component/input-code-number-5/input-code-number-5.component';
import { inputDesc1000Validator } from '../../shared/rule-component/input-desc-1000/input-desc-1000.component';
import { inputDesc4000Validator } from '../../shared/rule-component/input-desc-4000/input-desc-4000.component';
import { inputDesc500Validator } from '../../shared/rule-component/input-desc-500/input-desc-500.component';
import { inputEmail100Validator } from '../../shared/rule-component/input-email-100/input-email-100.component';
import { inputName255Validator } from '../../shared/rule-component/input-name-255/input-name-255.component';
import { inputPasswordValidator } from '../../shared/rule-component/input-password/input-password.component';
import { inputPhone12Validator } from '../../shared/rule-component/input-phone-12/input-phone-12.component';
import { inputTaxCode14Validator } from '../../shared/rule-component/input-tax-code-14/input-tax-code-14.component';

import { InputName255Component } from '../../shared/rule-component/input-name-255/input-name-255.component';
import { InputDesc500Component } from '../../shared/rule-component/input-desc-500/input-desc-500.component';
import { InputDesc1000Component } from '../../shared/rule-component/input-desc-1000/input-desc-1000.component';
import { InputDesc4000Component } from '../../shared/rule-component/input-desc-4000/input-desc-4000.component';
import { InputTextareaComponent } from '../../shared/rule-component/input-textarea/input-textarea.component';
import { InputCode20Component } from '../../shared/rule-component/input-code-20/input-code-20.component';
import { InputNumberComponent } from '../../shared/rule-component/input-number/input-number.component';
import { InputTaxCode14Component } from '../../shared/rule-component/input-tax-code-14/input-tax-code-14.component';
import { InputCodeNumber5Component } from '../../shared/rule-component/input-code-number-5/input-code-number-5.component';
import { InputPhone12Component } from '../../shared/rule-component/input-phone-12/input-phone-12.component';
import { InputCCCD12Component } from '../../shared/rule-component/input-cccd-12/input-cccd-12.component';
import { InputEmail100Component } from '../../shared/rule-component/input-email-100/input-email-100.component';
import { InputPasswordComponent } from '../../shared/rule-component/input-password/input-password.component';

interface ComponentTest {
  component: string;
  componentType: string; // The actual component selector
  description: string;
  form: FormGroup;
  submitted: boolean;
  config?: any; // Dynamic configuration for the component
}

@Component({
  selector: 'app-input-test',
  templateUrl: './input-test.component.html',
  styleUrl: './input-test.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputName255Component,
    InputDesc500Component,
    InputDesc1000Component,
    InputDesc4000Component,
    InputTextareaComponent,
    InputCode20Component,
    InputNumberComponent,
    InputTaxCode14Component,
    InputCodeNumber5Component,
    InputPhone12Component,
    InputCCCD12Component,
    InputEmail100Component,
    InputPasswordComponent,
  ],
})
export class InputTestComponent implements OnInit {
  componentTests: ComponentTest[] = [];

  constructor(private fb: FormBuilder) {
    this.initializeComponentTests();
  }

  ngOnInit(): void {}

  private initializeComponentTests(): void {
    this.componentTests = [
      this.createComponentTest(
        'InputName255Component',
        'input-name-255',
        `Placeholder:
                    - Nhập…
                    Kiểu nhập liệu:
                    - Nhập tối đa 255 ký tự
                    Thông báo lỗi:
                    - Sai định dạng: <Title input> sai định dạng
                    - Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
                    Giá trị trả về:
                    - Text đã trim space đầu cuối`,
        {
          name: ['', [Validators.required, inputName255Validator('Họ và tên')]],
        },
        {
          label: 'Họ và tên',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputDesc500Component',
        'input-desc-500',
        `Placeholder:
                    - Nhập…
                    Kiểu nhập liệu:
                    - Nhập tối đa 500 ký tự
                    Thông báo lỗi:
                    - Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
                    Giá trị trả về:
                    - Text đã trim space đầu cuối`,
        {
          name: ['', [Validators.required, inputDesc500Validator('')]],
        },
        {
          label: '',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputDesc1000Component',
        'input-desc-1000',
        `Placeholder:
                    - Nhập…
                    Kiểu nhập liệu:
                    - Nhập tối đa 1000 ký tự
                    Thông báo lỗi:
                    - Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
                    Giá trị trả về:
                    - Text đã trim space đầu cuối`,
        {
          name: ['', [Validators.required, inputDesc1000Validator('')]],
        },
        {
          label: 'Mô tả',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputDesc4000Component',
        'input-desc-4000',
        `Placeholder:
                    - Nhập…
                    Kiểu nhập liệu:
                    - Nhập tối đa 4000 ký tự
                    Thông báo lỗi:
                    - Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
                    Giá trị trả về:
                    - Text đã trim space đầu cuối`,
        {
          name: ['', [Validators.required, inputDesc4000Validator('')]],
        },
        {
          label: 'Mô tả',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputTextareaComponent',
        'input-textarea',
        `Placeholder:
                    - Nhập…
                    Kiểu nhập liệu:
                    - Nhập tối đa 500 ký tự
                    Thông báo lỗi:
                    - Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
                    Giá trị trả về:
                    - Text đã trim space đầu cuối`,
        {
          name: ['', [Validators.required, inputDesc500Validator('')]],
        },
        {
          label: '',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          maxLength: 500,
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputCode20Component',
        'input-code-20',
        `Placeholder:
                    - Nhập…
                    Kiểu nhập liệu:
                    - Chỉ cho phép nhập chữ và số, dấu chấm và dấu gạch ngang
                    - Nhập tối đa 20 ký tự
                    Thông báo lỗi:
                    - Sai định dạng: <Title input> sai định dạng
                    - Nếu bắt buộc: ""Trường dữ liệu này không được để trống""
                    Giá trị trả về:
                    - Text đã trim space đầu cuối`,
        {
          name: ['', [Validators.required, inputCode20Validator('')]],
        },
        {
          label: 'Mã số',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),

      this.createComponentTest(
        'InputNumberComponent',
        'input-number',
        `Placeholder:
                    - Nhập số…
                    Kiểu nhập liệu:
                    - Chỉ cho phép nhập số và dấu phân cách thập phân
                    - Hỗ trợ format hiển thị với dấu phân cách hàng nghìn
                    - Có thể giới hạn số chữ số thập phân và giá trị tối đa
                    Thông báo lỗi:
                    - Sai định dạng: <Title input> sai định dạng
                    - Nếu bắt buộc: "Trường dữ liệu này không được để trống"
                    Giá trị trả về:
                    - Number hoặc null`,
        {
          numberValue: [
            null,
            [
              Validators.required,
              inputNumberValidator('Số', 9999999999999, undefined),
            ],
          ],
        },
        {
          label: 'Số',
          required: true,
          placeholder: 'Nhập số...',
          formControlName: 'numberValue',
          showClearButton: true,
          thousandSeparator: '.',
          decimalSeparator: ',',
          decimalPlaces: 2,
          max: 9999999999999,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),

      this.createComponentTest(
        'InputTaxCode14Component',
        'input-tax-code-14',
        `Placeholder:
- Nhập…
Kiểu nhập liệu:
- Chỉ cho phép nhập số và dấu gạch ngang (-)
- Chỉ được phép nhập 10 hoặc 14 ký tự; format: [10 số + ""-"" + 3 số cuối]; với 10 số đầu là bắt buộc
Thông báo lỗi:
- Sai định dạng: <Title input> sai định dạng
- Nếu bắt buộc: ""Trường dữ liệu này không được để trống""
Giá trị trả về:
- Text đã trim space đầu cuối`,
        {
          name: [
            '',
            [Validators.required, inputTaxCode14Validator('Mã số thuế')],
          ],
        },
        {
          label: 'Mã số thuế',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputCodeNumber5Component',
        'input-code-number-5',
        `"Placeholder:
- Nhập…
Kiểu nhập liệu:
- Chỉ nhập số nguyên dương
- Nhập tối đa 5 ký tự
Thông báo lỗi:
- Nếu bắt buộc: ""Trường dữ liệu này không được để trống""
Giá trị trả về:
- Text đã trim space đầu cuối"`,
        {
          name: ['', [Validators.required, inputCodeNumber5Validator('')]],
        },
        {
          label: 'Mã số',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'name',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),
      this.createComponentTest(
        'InputPhone12Component',
        'input-phone-12',
        `Placeholder:
- Nhập…
Kiểu nhập liệu:
- Chỉ nhập số, bắt đầu bằng số 0
- Nhập tối đa 12 ký tự, tối thiểu 10 ký tự
Thông báo lỗi:
- Sai định dạng: <Title input> sai định dạng
- Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
Giá trị trả về:
- Text đã trim space đầu cuối`,
        {
          phoneNumber: [
            '',
            [Validators.required, inputPhone12Validator('Số điện thoại')],
          ],
        },
        {
          label: 'Số điện thoại',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'phoneNumber',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),

      this.createComponentTest(
        'InputCCCD12Component',
        'input-cccd-12',
        `Placeholder:
- Nhập…
Kiểu nhập liệu:
- Chỉ nhập số
- Nhập tối đa 12 ký tự
Thông báo lỗi:
- Sai định dạng: <Title input> sai định dạng
- Nếu bắt buộc: ""Trường dữ liệu này không được để trống""
Giá trị trả về:
- Text đã trim space đầu cuối`,
        {
          cccd: ['', [Validators.required, inputCCCD12Validator('Số CCCD')]],
        },
        {
          label: 'Số CCCD',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'cccd',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),

      this.createComponentTest(
        'InputEmail100Component',
        'input-email-100',
        `Placeholder:
- Nhập...
Kiểu nhập liệu:
- Format nhập: local-part@domain-part. Trong đó:
 + Local-part: Không cho phép nhập ký tự đặc biệt trừ “.”, “_”, “-”.
 +Domain-part: Không cho phép nhập ký tự đặc biệt trừ dấu “.” và dấu “-”
- Nhập tối đa 100 ký tự
Thông báo lỗi:
- Sai định dạng: <Title input> sai định dạng
- Nếu bắt buộc: ""Trường dữ liệu này không được để trống""
Giá trị trả về:
- Text đã trim space đầu cuối`,
        {
          email: ['', [Validators.required, inputEmail100Validator('Email')]],
        },
        {
          label: 'Email',
          required: true,
          placeholder: 'Nhập...',
          formControlName: 'email',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),

      this.createComponentTest(
        'InputPasswordComponent',
        'input-password',
        `Placeholder:
                - Nhập mật khẩu...
                Kiểu nhập liệu:
                - Nhập tối đa 50 ký tự
                Thông báo lỗi:
                - Sai định dạng: <Title input> sai định dạng
                - Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
                Giá trị trả về:
                - Text đã trim space đầu cuối`,
        {
          password: [
            '',
            [Validators.required, inputPasswordValidator('Mật khẩu')],
          ],
        },
        {
          label: 'Mật khẩu',
          required: true,
          placeholder: 'Nhập mật khẩu...',
          formControlName: 'password',
          showClearButton: true,
          events: {
            focus: (componentTest: ComponentTest) =>
              this.onFocus(componentTest),
            blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
            keyup: (event: any, componentTest: ComponentTest) =>
              this.onKeyup(event, componentTest),
            clear: (componentTest: ComponentTest) =>
              this.onClear(componentTest),
          },
        },
      ),

      // Example: How to add a new component
      // this.createComponentTest(
      //     "YourNewComponent",
      //     "your-new-component",
      //     "Description of your new component",
      //     {
      //         controlName: ["", [Validators.required]],
      //     },
      //     {
      //         label: "Your Label",
      //         required: true,
      //         placeholder: "Enter value...",
      //         formControlName: "controlName",
      //         // Add other component-specific config here
      //         events: {
      //             // Add event handlers if needed
      //         }
      //     }
      // ),
    ];
  }

  // Helper method to create component test configurations
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
    } else {
      console.log(
        `${componentTest.component} Form has errors:`,
        componentTest.form.errors,
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
    return value[firstControl] || '';
  }

  getValueType(form: FormGroup): string {
    const value = form.value;
    const firstControl = Object.keys(value)[0];
    const controlValue = value[firstControl];
    return typeof controlValue;
  }

  // Event handlers for testing
  onFocus(componentTest: ComponentTest): void {
    console.log(`${componentTest.component} focused`);
  }

  onBlur(componentTest: ComponentTest): void {
    console.log(`${componentTest.component} blurred`);
  }

  onKeyup(event: any, componentTest: ComponentTest): void {
    console.log(`${componentTest.component} keyup:`, event.target.value);
  }

  onClear(componentTest: ComponentTest): void {
    console.log(`${componentTest.component} cleared`);
  }
}
