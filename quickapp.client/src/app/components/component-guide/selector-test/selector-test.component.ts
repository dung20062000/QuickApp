import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { SelectOption, SelectorComponent } from "../../shared/rule-component/selector/selector.component";
import { MultipleSelectorComponent } from "../../shared/rule-component/multiple-selector/multiple-selector.component";
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
    selector: "app-selector-test",
    templateUrl: "./selector-test.component.html",
    styleUrl: "./selector-test.component.css",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectorComponent, MultipleSelectorComponent, AppButtonComponent]
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
                `Basic select component:
- Single selection dropdown
- Clearable option
- Searchable option
- Required validation
- Custom placeholder
Validation:
- Required: "Trường dữ liệu này không được để trống"
- Custom messages supported
Value returned:
- Selected option value`,
                {
                    province: ["", [Validators.required]],
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
                `Large dataset with virtual scrolling:
- Virtual scroll enabled for performance
- Large dataset handling
- Searchable for filtering
- Single selection
Performance:
- Optimized for 1000+ items
- Smooth scrolling experience
Value returned:
- Selected option value`,
                {
                    education: ["", [Validators.required]],
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
                `Readonly select component:
- Non-editable dropdown
- Display selected value only
- No user interaction
- Pre-selected value shown
Use case:
- Display mode
- Confirmation forms
- Read-only data presentation`,
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
                `Multiple selection dropdown:
- Multiple selections allowed
- Tag display for selected items
- Selection counter badge
- Clearable all selections
Features:
- Add/remove items dynamically
- Visual feedback for selections
- Custom validation support
Value returned:
- Array of selected values`,
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
                `Limited multiple selection:
- Maximum 3 items can be selected
- Visual warning when limit reached
- Automatic disable when max reached
- Selection counter with limit display
Features:
- Smart UX for limited selections
- Clear feedback on constraints
- Prevents over-selection
Value returned:
- Array of selected values (max 3)`,
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
                `Multiple selection with virtual scroll:
- Handles large datasets efficiently
- Multiple selections from big lists
- Performance optimized rendering
- Smooth scrolling experience
Performance:
- Virtual scroll for 1000+ items
- Memory efficient rendering
- Fast search and filter
Value returned:
- Array of selected values`,
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
            //         customField: ["", [Validators.required]],
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
