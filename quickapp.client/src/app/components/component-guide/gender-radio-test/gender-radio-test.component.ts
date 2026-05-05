import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { GenderRadioComponent } from "../../shared/rule-component/gender-radio/gender-radio.component";
import { AppButtonComponent } from "../../shared/rule-component/app-button/app-button.component";

interface ComponentTest {
    component: string;
    componentType: string;
    description: string;
    form: FormGroup;
    submitted: boolean;
    config?: any;
}

@Component({
    selector: "app-gender-radio-test",
    templateUrl: "./gender-radio-test.component.html",
    styleUrl: "./gender-radio-test.component.css",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, GenderRadioComponent, AppButtonComponent]
})
export class GenderRadioTestComponent implements OnInit {
    componentTests: ComponentTest[] = [];

    constructor(private fb: FormBuilder) {
        this.initializeComponentTests();
    }

    ngOnInit(): void {}

    private initializeComponentTests(): void {
        this.componentTests = [
            this.createComponentTest(
                "GenderRadioComponent",
                "gender-radio",
                `Kiểu nhập liệu:
- Radio button cho lựa chọn giới tính
- 2 lựa chọn: Nam (true), Nữ (false)
- Chỉ cho phép chọn 1 giá trị
Thông báo lỗi:
- Nếu bắt buộc hiển thị thông báo: "Trường dữ liệu này không được để trống"
Giá trị trả về:
- Boolean: true (Nam), false (Nữ), null (chưa chọn)`,
                {
                    gender: ["", [Validators.required]],
                },
                {
                    label: "Giới tính",
                    required: true,
                    formControlName: "gender",
                    events: {
                        selectionChange: (value: boolean, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "GenderRadioComponent (Optional)",
                "gender-radio",
                `Giống như trên nhưng không bắt buộc:
- Cho phép không chọn giá trị nào
- Không hiển thị thông báo lỗi khi để trống`,
                {
                    genderOptional: [""],
                },
                {
                    label: "Giới tính (Tùy chọn)",
                    required: false,
                    formControlName: "genderOptional",
                    events: {
                        selectionChange: (value: boolean, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "GenderRadioComponent (Disabled)",
                "gender-radio",
                `Trạng thái vô hiệu hóa:
- Không thể thay đổi giá trị
- Hiển thị với style disabled
- Giá trị mặc định: Nam (true)`,
                {
                    genderDisabled: [true],
                },
                {
                    label: "Giới tính (Disabled)",
                    required: false,
                    readonly: true,
                    formControlName: "genderDisabled",
                    events: {},
                }
            ),
        ];
    }

    // Helper method to create component test configurations
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
        } else {
            console.log(`${componentTest.component} Form has errors:`, componentTest.form.errors);
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

        if (controlValue === null || controlValue === undefined) {
            return "null";
        }
        if (controlValue === true) {
            return "Nam (true)";
        }
        if (controlValue === false) {
            return "Nữ (false)";
        }
        return String(controlValue);
    }

    getValueType(form: FormGroup): string {
        const value = form.value;
        const firstControl = Object.keys(value)[0];
        const controlValue = value[firstControl];
        return typeof controlValue;
    }

    // Event handlers for testing
    onSelectionChange(value: boolean, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} selection changed:`, value);
    }

    onFocus(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} focused`);
    }

    onBlur(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} blurred`);
    }
}
