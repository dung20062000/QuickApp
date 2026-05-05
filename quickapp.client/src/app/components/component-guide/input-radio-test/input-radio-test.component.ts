import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { InputRadioComponent, RadioOption } from "../../shared/rule-component/input-radio/input-radio.component";

interface ComponentTest {
    component: string;
    componentType: string;
    description: string;
    form: FormGroup;
    submitted: boolean;
    config?: any;
}

@Component({
    selector: "app-input-radio-test",
    templateUrl: "./input-radio-test.component.html",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputRadioComponent]
})
export class InputRadioTestComponent implements OnInit {
    componentTests: ComponentTest[] = [];

    genderOptions: RadioOption[] = [
        { value: "M", text: "Nam" },
        { value: "F", text: "Nữ" },
        { value: "O", text: "Khác" }
    ];

    statusOptions: RadioOption[] = [
        { value: 1, text: "Hoạt động" },
        { value: 0, text: "Tạm dừng" },
        { value: -1, text: "Đã xóa", disabled: true }
    ];

    constructor(private fb: FormBuilder) {
        this.initializeComponentTests();
    }

    ngOnInit(): void {}

    private initializeComponentTests(): void {
        this.componentTests = [
            this.createComponentTest(
                "InputRadioComponent (Required)",
                "input-radio",
                `Trường hợp bắt buộc (Required: true):
- Bắt buộc phải chọn 1 giá trị.
- Không thể bỏ chọn (uncheck) bằng cách click lại vào lựa chọn đang chọn.
- Hiển thị thông báo lỗi nếu chưa chọn.`,
                {
                    gender: [null, [Validators.required]],
                },
                {
                    label: "Giới tính (Bắt buộc)",
                    required: true,
                    options: this.genderOptions,
                    formControlName: "gender",
                }
            ),

            this.createComponentTest(
                "InputRadioComponent (Optional - Toggleable)",
                "input-radio",
                `Trường hợp không bắt buộc (Required: false):
- Có thể bỏ chọn (uncheck) bằng cách click lại vào lựa chọn đang chọn.
- Giá trị sẽ chuyển về null.
- Rất hữu ích cho các bộ lọc hoặc thông tin tùy chọn.`,
                {
                    status: [null],
                },
                {
                    label: "Trạng thái (Tùy chọn - Có thể bỏ chọn)",
                    required: false,
                    options: this.statusOptions,
                    formControlName: "status",
                }
            ),

            this.createComponentTest(
                "InputRadioComponent (Vertical Layout)",
                "input-radio",
                `Bố cục dọc (Inline: false):
- Các lựa chọn hiển thị theo hàng dọc.`,
                {
                    choice: ["M"],
                },
                {
                    label: "Lựa chọn của bạn",
                    required: false,
                    inline: false,
                    options: this.genderOptions,
                    formControlName: "choice",
                }
            ),
        ];
    }

    private createComponentTest(
        component: string,
        componentType: string,
        description: string,
        formConfig: any,
        componentConfig: any = {}
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
            console.log(`${componentTest.component} Form Data:`, componentTest.form.value);
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
        return controlValue === null ? "null" : JSON.stringify(controlValue);
    }

    getValueType(form: FormGroup): string {
        const value = form.value;
        const firstControl = Object.keys(value)[0];
        const controlValue = value[firstControl];
        return typeof controlValue;
    }
}
