import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { SelectOption, SelectorComponent } from "../../shared/rule-component/selector/selector.component";
import { MultipleSelectorComponent } from "../../shared/rule-component/multiple-selector/multiple-selector.component";

interface ComponentTest {
    component: string;
    componentType: string;
    description: string;
    form: FormGroup;
    submitted: boolean;
    config?: any;
}

@Component({
    selector: "app-selector-test",
    templateUrl: "./selector-test.component.html",
    styleUrl: "./selector-test.component.css",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectorComponent, MultipleSelectorComponent]
})
export class SelectorTestComponent implements OnInit {
    componentTests: ComponentTest[] = [];

    // Sample data for select options
    sampleProvinces: SelectOption[] = [
        { value: 1, text: "Hà Nội" },
        { value: 2, text: "Hồ Chí Minh" },
        { value: 3, text: "Đà Nẵng" },
        { value: 4, text: "Hải Phòng" },
        { value: 5, text: "Cần Thơ" },
    ];

    sampleGenders: SelectOption[] = [
        { value: 1, text: "Nam" },
        { value: 2, text: "Nữ" },
        { value: 3, text: "Khác" },
    ];

    sampleEducationLevels: SelectOption[] = [
        { value: 1, text: "Tiểu học" },
        { value: 2, text: "Trung học cơ sở" },
        { value: 3, text: "Trung học phổ thông" },
        { value: 4, text: "Cao đẳng" },
        { value: 5, text: "Đại học" },
        { value: 6, text: "Thạc sĩ" },
        { value: 7, text: "Tiến sĩ" },
    ];

    sampleLanguages: SelectOption[] = [
        { value: "vi", text: "Tiếng Việt" },
        { value: "en", text: "English" },
        { value: "fr", text: "Français" },
        { value: "de", text: "Deutsch" },
        { value: "ja", text: "日本語" },
    ];

    constructor(private fb: FormBuilder) {
        this.initializeComponentTests();
    }

    ngOnInit(): void {}

    private initializeComponentTests(): void {
        this.componentTests = [
            this.createComponentTest(
                "SelectorComponent - Basic",
                "selector",
                `Component chọn đơn cơ bản:
- Danh sách thả xuống chọn 1 giá trị
- Có nút xóa giá trị đã chọn
- Hỗ trợ tìm kiếm trong danh sách
- Kiểm tra bắt buộc nhập
- Placeholder tùy chỉnh
Kiểm tra dữ liệu:
- Bắt buộc: "Trường dữ liệu này không được để trống"
- Hỗ trợ thông báo tùy chỉnh
Giá trị trả về:
- Giá trị của tùy chọn được chọn`,
                {
                    province: [null, [Validators.required]],
                },
                {
                    label: "Tỉnh/Thành phố",
                    required: true,
                    placeholder: "Chọn tỉnh/thành phố...",
                    formControlName: "province",
                    items: this.sampleProvinces,
                    bindValue: "value",
                    bindLabel: "text",
                    clearable: true,
                    searchable: true,
                    events: {
                        change: (value: any, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "SelectorComponent - Virtual Scroll",
                "selector",
                `Dữ liệu lớn với cuộn ảo:
- Kích hoạt cuộn ảo để tối ưu hiệu suất
- Xử lý tập dữ liệu lớn mượt mà
- Hỗ trợ tìm kiếm và lọc
- Chọn đơn một giá trị
Hiệu suất:
- Tối ưu cho danh sách trên 1000 mục
- Trải nghiệm cuộn mượt mà
Giá trị trả về:
- Giá trị của tùy chọn được chọn`,
                {
                    education: [null, [Validators.required]],
                },
                {
                    label: "Trình độ học vấn",
                    required: true,
                    placeholder: "Chọn trình độ...",
                    formControlName: "education",
                    items: this.sampleEducationLevels,
                    bindValue: "value",
                    bindLabel: "text",
                    clearable: true,
                    searchable: true,
                    virtualScroll: true,
                    events: {
                        change: (value: any, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "SelectorComponent - Readonly",
                "selector",
                `Component chỉ đọc (Readonly):
- Danh sách thả xuống không thể chỉnh sửa
- Chỉ hiển thị giá trị đã được chọn
- Không có tương tác người dùng
- Hiển thị giá trị mặc định sẵn có
Trường hợp sử dụng:
- Chế độ hiển thị thông tin
- Form xác nhận
- Trình bày dữ liệu chỉ đọc`,
                {
                    gender: [2], // Pre-selected value
                },
                {
                    label: "Giới tính (Readonly)",
                    required: false,
                    placeholder: "Chọn giới tính...",
                    formControlName: "gender",
                    items: this.sampleGenders,
                    bindValue: "value",
                    bindLabel: "text",
                    clearable: false,
                    searchable: false,
                    readonly: true,
                    events: {
                        change: (value: any, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                    },
                }
            ),

            // MultipleSelectorComponent Tests
            this.createComponentTest(
                "MultipleSelectorComponent - Basic",
                "multiple-selector",
                `Danh sách thả xuống chọn nhiều (Multiple):
- Cho phép chọn nhiều giá trị cùng lúc
- Hiển thị các mục đã chọn dưới dạng thẻ (tags)
- Có huy hiệu đếm số lượng mục đã chọn
- Có nút xóa toàn bộ lựa chọn
Tính năng:
- Thêm/xóa mục linh hoạt
- Phản hồi trực quan cho các lựa chọn
- Hỗ trợ kiểm tra dữ liệu tùy chỉnh
Giá trị trả về:
- Mảng các giá trị được chọn`,
                {
                    languages: [[], [Validators.required]],
                },
                {
                    label: "Ngôn ngữ",
                    required: true,
                    placeholder: "Chọn ngôn ngữ...",
                    formControlName: "languages",
                    items: this.sampleLanguages,
                    bindValue: "value",
                    bindLabel: "text",
                    clearable: true,
                    searchable: true,
                    closeOnSelect: false,
                    hideSelected: false,
                    events: {
                        change: (value: any, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                        add: (item: any, componentTest: ComponentTest) => this.onItemAdd(item, componentTest),
                        remove: (item: any, componentTest: ComponentTest) => this.onItemRemove(item, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "MultipleSelectorComponent - Limited Selection",
                "multiple-selector",
                `Giới hạn số lượng lựa chọn:
- Chỉ cho phép chọn tối đa 3 mục
- Cảnh báo trực quan khi đạt giới hạn
- Tự động vô hiệu hóa lựa chọn khi đạt mức tối đa
- Bộ đếm hiển thị kèm giới hạn
Tính năng:
- Trải nghiệm người dùng thông minh cho giới hạn chọn
- Phản hồi rõ ràng về các ràng buộc
- Ngăn chặn việc chọn quá số lượng
Giá trị trả về:
- Mảng các giá trị được chọn (tối đa 3)`,
                {
                    skills: [[], [Validators.required, Validators.maxLength(3)]],
                },
                {
                    label: "Kỹ năng (Tối đa 3)",
                    required: true,
                    placeholder: "Chọn kỹ năng...",
                    formControlName: "skills",
                    items: [
                        { value: "js", text: "JavaScript" },
                        { value: "ts", text: "TypeScript" },
                        { value: "angular", text: "Angular" },
                        { value: "react", text: "React" },
                        { value: "vue", text: "Vue.js" },
                        { value: "node", text: "Node.js" },
                        { value: "python", text: "Python" },
                        { value: "java", text: "Java" },
                    ],
                    bindValue: "value",
                    bindLabel: "text",
                    clearable: true,
                    searchable: true,
                    maxSelectedItems: 3,
                    closeOnSelect: false,
                    hideSelected: false,
                    events: {
                        change: (value: any, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                        add: (item: any, componentTest: ComponentTest) => this.onItemAdd(item, componentTest),
                        remove: (item: any, componentTest: ComponentTest) => this.onItemRemove(item, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "MultipleSelectorComponent - Virtual Scroll",
                "multiple-selector",
                `Chọn nhiều với cuộn ảo (Virtual Scroll):
- Xử lý tập dữ liệu lớn hiệu quả
- Chọn nhiều mục từ danh sách dài
- Tối ưu hóa hiệu suất hiển thị
- Trải nghiệm cuộn mượt mà
Hiệu suất:
- Cuộn ảo cho danh sách 1000+ mục
- Sử dụng bộ nhớ hiệu quả
- Tìm kiếm và lọc nhanh chóng
Giá trị trả về:
- Mảng các giá trị được chọn`,
                {
                    departments: [[], [Validators.required]],
                },
                {
                    label: "Phòng ban",
                    required: true,
                    placeholder: "Chọn phòng ban...",
                    formControlName: "departments",
                    items: this.generateLargeDepartmentList(),
                    bindValue: "value",
                    bindLabel: "text",
                    clearable: true,
                    searchable: true,
                    virtualScroll: true,
                    closeOnSelect: false,
                    hideSelected: true,
                    events: {
                        change: (value: any, componentTest: ComponentTest) =>
                            this.onSelectionChange(value, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                        add: (item: any, componentTest: ComponentTest) => this.onItemAdd(item, componentTest),
                        remove: (item: any, componentTest: ComponentTest) => this.onItemRemove(item, componentTest),
                    },
                }
            ),

            // Example: How to add a new component test
            // this.createComponentTest(
            //     "SelectorComponent - Custom",
            //     "selector",
            //     "Description of your custom select test",
            //     {
            //         customField: [null, [Validators.required]],
            //     },
            //     {
            //         label: "Custom Label",
            //         required: true,
            //         placeholder: "Choose option...",
            //         formControlName: "customField",
            //         items: yourCustomOptions,
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

        if (Array.isArray(controlValue)) {
            return JSON.stringify(controlValue);
        }

        return controlValue || "";
    }

    getValueType(form: FormGroup): string {
        const value = form.value;
        const firstControl = Object.keys(value)[0];
        const controlValue = value[firstControl];

        if (Array.isArray(controlValue)) {
            return "array";
        }

        return typeof controlValue;
    }

    // Event handlers for testing
    onSelectionChange(value: any, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} selection changed:`, value);
    }

    onFocus(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} focused`);
    }

    onBlur(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} blurred`);
    }

    onClear(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} cleared`);
    }

    onItemAdd(item: any, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} item added:`, item);
    }

    onItemRemove(item: any, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} item removed:`, item);
    }

    // Generate large dataset for testing virtual scroll
    generateLargeDepartmentList(): SelectOption[] {
        const departments: SelectOption[] = [];
        const departmentTypes = [
            "Nhân sự",
            "Kế toán",
            "Marketing",
            "Kinh doanh",
            "Kỹ thuật",
            "Sản xuất",
            "Chất lượng",
            "Logistics",
            "IT",
            "Pháp chế",
        ];

        for (let i = 1; i <= 100; i++) {
            const typeIndex = Math.floor(Math.random() * departmentTypes.length);
            departments.push({
                value: i,
                text: `${departmentTypes[typeIndex]} ${i.toString().padStart(3, "0")}`,
            });
        }

        return departments.sort((a, b) => a.text.localeCompare(b.text));
    }
}
