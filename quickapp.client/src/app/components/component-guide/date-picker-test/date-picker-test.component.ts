import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { dateValidator, DatePickerComponent } from "../../shared/rule-component/date-picker/date-picker.component";
import { datetimeValidator, DatetimePickerComponent } from "../../shared/rule-component/datetime-picker/datetime-picker.component";
import { dateRangeValidator, DateRange, DateRangePickerComponent } from "../../shared/rule-component/date-range-picker/date-range-picker.component";
import { timeValidator, TimePickerComponent } from "../../shared/rule-component/time-picker/time-picker.component";
import {
    datetimeRangeValidator,
    DateTimeRange,
    DatetimeRangePickerComponent
} from "../../shared/rule-component/datetime-range-picker/datetime-range-picker.component";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { defineLocale } from "ngx-bootstrap/chronos";
import { viLocale } from "ngx-bootstrap/locale";
import { AppButtonComponent } from "../../shared/rule-component/app-button/app-button.component";

defineLocale("vi", viLocale);

interface ComponentTest {
    component: string;
    componentType: string;
    description: string;
    form: FormGroup;
    submitted: boolean;
    config?: any;
}

@Component({
    selector: "app-date-picker-test",
    templateUrl: "./date-picker-test.component.html",
    styleUrl: "./date-picker-test.component.css",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DatePickerComponent,
        DatetimePickerComponent,
        DateRangePickerComponent,
        TimePickerComponent,
        DatetimeRangePickerComponent,
        AppButtonComponent
    ]
})
export class DatePickerTestComponent implements OnInit {
    componentTests: ComponentTest[] = [];

    // Sample dates for testing
    today = new Date();
    minDate = new Date(2020, 0, 1); // January 1, 2020
    maxDate = new Date(2030, 11, 31); // December 31, 2030
    maxBirthday = new Date(this.today.getFullYear() - 18, this.today.getMonth(), this.today.getDate());

    predefinedRanges = [
        {
            label: "Tuần này",
            value: [new Date(new Date().setDate(new Date().getDate() - new Date().getDay())), new Date()],
        },
        {
            label: "Tháng này",
            value: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
        },
        {
            label: "3 tháng qua",
            value: [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()],
        },
    ];

    constructor(private fb: FormBuilder, private localeService: BsLocaleService) {
        viLocale.invalidDate = "";
        defineLocale("custom locale", viLocale);
        this.localeService.use("custom locale");
        this.initializeComponentTests();
    }

    ngOnInit(): void {}

    private initializeComponentTests(): void {
        this.componentTests = [
            this.createComponentTest(
                "DatePickerComponent",
                "date-picker",
                `Date Picker Component:
- Placeholder: Nhập...
- Format: DD/MM/YYYY
- Single date selection
- Min/Max date validation
- Required validation support
- Clear button functionality
Thông báo lỗi:
- Required: "Trường dữ liệu này không được để trống"
- Invalid date: "Ngày không hợp lệ"
Giá trị trả về:
- Date object or null`,
                {
                    birthDate: [null, [Validators.required, dateValidator("Ngày sinh")]],
                },
                {
                    label: "Ngày sinh",
                    required: true,
                    placeholder: "Chọn ngày sinh...",
                    formControlName: "birthDate",
                    showClearButton: true,
                    maxDate: this.maxBirthday,
                    dateInputFormat: "DD/MM/YYYY",
                    containerClass: "theme-dark-blue",
                    showWeekNumbers: false,
                    adaptivePosition: true,
                    showTodayButton: true,
                    events: {
                        dateChange: (date: Date | null, componentTest: ComponentTest) =>
                            this.onDateChange(date, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                        pickerOpen: (componentTest: ComponentTest) => this.onPickerOpen(componentTest),
                        pickerClose: (componentTest: ComponentTest) => this.onPickerClose(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DatePickerComponent (Start Date)",
                "date-picker",
                `Date Picker for Start Date:
- Min date: ${this.minDate.toLocaleDateString()}
- Max date: Today
- Connected to end date validation
- Custom validation messages`,
                {
                    startDate: [null, [Validators.required, dateValidator("Ngày bắt đầu")]],
                },
                {
                    label: "Ngày bắt đầu",
                    required: true,
                    placeholder: "Chọn ngày bắt đầu...",
                    formControlName: "startDate",
                    showClearButton: true,
                    minDate: this.minDate,
                    maxDate: this.today,
                    customValidationMessages: {
                        required: "Vui lòng chọn ngày bắt đầu",
                        invalidDate: "Ngày bắt đầu không hợp lệ",
                    },
                    events: {
                        dateChange: (date: Date | null, componentTest: ComponentTest) =>
                            this.onDateChange(date, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DateRangePickerComponent",
                "date-range-picker",
                `Date Range Picker Component:
- Dual date selection (start and end)
- Format: DD/MM/YYYY - DD/MM/YYYY
- Predefined ranges support
- Maximum date range validation (365 days)
- Range validation (start < end)
Thông báo lỗi:
- Required: "Trường dữ liệu này không được để trống"
- Invalid range: "Ngày bắt đầu phải trước ngày kết thúc"
Giá trị trả về:
- DateRange object with startDate and endDate`,
                {
                    reportPeriod: [null, [Validators.required, dateRangeValidator("Khoảng thời gian báo cáo")]],
                },
                {
                    label: "Khoảng thời gian báo cáo",
                    required: true,
                    startPlaceholder: "Từ ngày...",
                    endPlaceholder: "Đến ngày...",
                    formControlName: "reportPeriod",
                    showClearButton: true,
                    minDate: this.minDate,
                    maxDate: this.today,
                    maxDateRange: 365,
                    ranges: this.predefinedRanges,
                    showTodayButton: true,
                    customValidationMessages: {
                        required: "Vui lòng chọn khoảng thời gian báo cáo",
                        invalidDateRange: "Khoảng thời gian không hợp lệ",
                    },
                    events: {
                        dateRangeChange: (dateRange: DateRange | null, componentTest: ComponentTest) =>
                            this.onDateRangeChange(dateRange, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DateRangePickerComponent (Simple)",
                "date-range-picker",
                `Simple Date Range Picker:
- Basic configuration
- No predefined ranges
- No maximum date range limit
- Standard validation`,
                {
                    simpleDateRange: [null, [Validators.required]],
                },
                {
                    label: "Khoảng thời gian đơn giản",
                    required: true,
                    startPlaceholder: "Ngày bắt đầu...",
                    endPlaceholder: "Ngày kết thúc...",
                    formControlName: "simpleDateRange",
                    showClearButton: true,
                    events: {
                        dateRangeChange: (dateRange: DateRange | null, componentTest: ComponentTest) =>
                            this.onDateRangeChange(dateRange, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DatetimePickerComponent",
                "datetime-picker",
                `Datetime Picker Component:
- Placeholder: Nhập...
- Format: DD/MM/YYYY HH:mm
- Single datetime selection
- Time picker included (24-hour format)
- Min/Max date validation
- Required validation support
- Clear button functionality
Thông báo lỗi:
- Required: "Trường dữ liệu này không được để trống"
- Invalid datetime: "Ngày giờ không hợp lệ"
Giá trị trả về:
- Date object or null`,
                {
                    appointmentDateTime: [null, [Validators.required, datetimeValidator("Ngày giờ hẹn")]],
                },
                {
                    label: "Ngày giờ hẹn",
                    required: true,
                    placeholder: "Chọn ngày giờ hẹn...",
                    formControlName: "appointmentDateTime",
                    showClearButton: true,
                    minDate: this.today,
                    dateInputFormat: "DD/MM/YYYY HH:mm",
                    containerClass: "theme-dark-blue",
                    showWeekNumbers: false,
                    adaptivePosition: true,
                    showTodayButton: true,
                    showTimePicker: true,
                    hourStep: 1,
                    minuteStep: 15,
                    showSeconds: false,
                    showMeridian: false,
                    events: {
                        datetimeChange: (datetime: Date | null, componentTest: ComponentTest) =>
                            this.onDatetimeChange(datetime, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                        pickerOpen: (componentTest: ComponentTest) => this.onPickerOpen(componentTest),
                        pickerClose: (componentTest: ComponentTest) => this.onPickerClose(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DatetimePickerComponent (Meeting)",
                "datetime-picker",
                `Datetime Picker for Meeting Scheduling:
- Custom time steps (30 minutes)
- Business hours validation
- Custom validation messages
- Different format options`,
                {
                    meetingDateTime: [null, [Validators.required, datetimeValidator("Thời gian họp")]],
                },
                {
                    label: "Thời gian họp",
                    required: true,
                    placeholder: "Chọn thời gian họp...",
                    formControlName: "meetingDateTime",
                    showClearButton: true,
                    minDate: this.today,
                    maxDate: new Date(2025, 11, 31),
                    dateInputFormat: "DD/MM/YYYY HH:mm",
                    showTimePicker: true,
                    hourStep: 1,
                    minuteStep: 30,
                    showSeconds: false,
                    showMeridian: false,
                    customValidationMessages: {
                        required: "Vui lòng chọn thời gian họp",
                        invalidDatetime: "Thời gian họp không hợp lệ",
                    },
                    events: {
                        datetimeChange: (datetime: Date | null, componentTest: ComponentTest) =>
                            this.onDatetimeChange(datetime, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "TimePickerComponent",
                "time-picker",
                `Time Picker Component:
- Placeholder: HH:mm
- Format: HH:mm (24-hour format)
- Single time selection
- Custom input parsing (supports HH:mm, HHmm formats)
- Smart parsing: 1111 → 11:11, 930 → 09:30
- Required validation support
- Clear button functionality
Thông báo lỗi:
- Required: "Trường dữ liệu này không được để trống"
- Invalid time: "Thời gian không hợp lệ"
Giá trị trả về:
- Date object with time or null
Parsing examples:
- "11:30" → 11:30
- "1130" → 11:30
- "930" → 09:30
- "9:30" → 09:30`,
                {
                    startTime: [null, [Validators.required, timeValidator("Thời gian bắt đầu")]],
                },
                {
                    label: "Thời gian bắt đầu",
                    required: true,
                    placeholder: "HH:mm",
                    formControlName: "startTime",
                    showClearButton: true,
                    hourFormat: "24",
                    stepHour: 1,
                    stepMinute: 5,
                    showSeconds: false,
                    events: {
                        timeChange: (time: Date | null, componentTest: ComponentTest) =>
                            this.onTimeChange(time, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                        pickerOpen: (componentTest: ComponentTest) => this.onPickerOpen(componentTest),
                        pickerClose: (componentTest: ComponentTest) => this.onPickerClose(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "TimePickerComponent (End Time)",
                "time-picker",
                `Time Picker for End Time:
- Custom validation messages
- Different step minutes (15 minutes)
- 12-hour format support
- Advanced parsing validation`,
                {
                    endTime: [null, [Validators.required, timeValidator("Thời gian kết thúc")]],
                },
                {
                    label: "Thời gian kết thúc",
                    required: true,
                    placeholder: "HH:mm",
                    formControlName: "endTime",
                    showClearButton: true,
                    hourFormat: "24",
                    stepHour: 1,
                    stepMinute: 15,
                    showSeconds: false,
                    customValidationMessages: {
                        required: "Vui lòng chọn thời gian kết thúc",
                        invalidTime: "Thời gian kết thúc không hợp lệ",
                    },
                    events: {
                        timeChange: (time: Date | null, componentTest: ComponentTest) =>
                            this.onTimeChange(time, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "TimePickerComponent (With Seconds)",
                "time-picker",
                `Time Picker with Seconds:
- Includes seconds selection
- Format: HH:mm:ss
- More precise time input
- Custom step values`,
                {
                    preciseTime: [null, [Validators.required, timeValidator("Thời gian chính xác")]],
                },
                {
                    label: "Thời gian chính xác",
                    required: true,
                    placeholder: "HH:mm:ss",
                    formControlName: "preciseTime",
                    showClearButton: true,
                    hourFormat: "24",
                    stepHour: 1,
                    stepMinute: 1,
                    stepSecond: 1,
                    showSeconds: true,
                    events: {
                        timeChange: (time: Date | null, componentTest: ComponentTest) =>
                            this.onTimeChange(time, componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DatetimeRangePickerComponent",
                "datetime-range-picker",
                `Datetime Range Picker Component:
- Combines date picker with start and end time pickers
- Format: Date + Start Time + End Time
- Automatic datetime combination (startDateTime, endDateTime)
- Time validation (start < end)
- Custom time parsing support (1111 → 11:11)
- Individual clear buttons for each field
- Clear all functionality
Thông báo lỗi:
- Required: "Trường dữ liệu này không được để trống"
- Invalid range: "Thời gian bắt đầu phải trước thời gian kết thúc"
- Missing date: "Vui lòng chọn ngày"
Giá trị trả về:
- DateTimeRange object with date, startTime, endTime, startDateTime, endDateTime`,
                {
                    scheduleTime: [null, [Validators.required, datetimeRangeValidator("Thời gian lịch hẹn")]],
                },
                {
                    label: "Thời gian lịch hẹn",
                    dateLabel: "Ngày",
                    startTimeLabel: "Bắt đầu",
                    endTimeLabel: "Kết thúc",
                    required: true,
                    datePlaceholder: "Chọn ngày...",
                    startTimePlaceholder: "Từ giờ",
                    endTimePlaceholder: "Đến giờ",
                    formControlName: "scheduleTime",
                    showClearButton: true,
                    minDate: this.today,
                    maxDate: new Date(2025, 11, 31),
                    hourFormat: "24",
                    stepMinute: 15,
                    showSeconds: false,
                    events: {
                        datetimeRangeChange: (dateTimeRange: DateTimeRange | null, componentTest: ComponentTest) =>
                            this.onDateTimeRangeChange(dateTimeRange, componentTest),
                        dateChange: (date: Date | null, componentTest: ComponentTest) =>
                            this.onDateChange(date, componentTest),
                        startTimeChange: (time: Date | null, componentTest: ComponentTest) =>
                            this.onTimeChange(time, componentTest),
                        endTimeChange: (time: Date | null, componentTest: ComponentTest) =>
                            this.onTimeChange(time, componentTest),
                        focus: (componentTest: ComponentTest) => this.onFocus(componentTest),
                        blur: (componentTest: ComponentTest) => this.onBlur(componentTest),
                        clear: (componentTest: ComponentTest) => this.onClear(componentTest),
                    },
                }
            ),

            this.createComponentTest(
                "DatetimeRangePickerComponent (Meeting)",
                "datetime-range-picker",
                `Datetime Range Picker for Meeting Scheduling:
- Different step values (30 minutes)
- Custom validation messages
- Business meeting context
- Flexible time slots`,
                {
                    meetingSchedule: [null, [Validators.required, datetimeRangeValidator("Thời gian họp")]],
                },
                {
                    label: "Lịch họp",
                    dateLabel: "Ngày họp",
                    startTimeLabel: "Giờ bắt đầu",
                    endTimeLabel: "Giờ kết thúc",
                    required: true,
                    datePlaceholder: "Chọn ngày họp...",
                    startTimePlaceholder: "Bắt đầu",
                    endTimePlaceholder: "Kết thúc",
                    formControlName: "meetingSchedule",
                    showClearButton: true,
                    minDate: this.today,
                    hourFormat: "24",
                    stepMinute: 30,
                    showSeconds: false,
                    customValidationMessages: {
                        required: "Vui lòng chọn thời gian họp đầy đủ",
                        invalidDateTimeRange: "Thời gian họp không hợp lệ",
                    },
                    events: {
                        datetimeRangeChange: (dateTimeRange: DateTimeRange | null, componentTest: ComponentTest) =>
                            this.onDateTimeRangeChange(dateTimeRange, componentTest),
                    },
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

        if (controlValue instanceof Date) {
            // Check if this is a time-only value (for time picker components)
            if (firstControl.includes("Time") || firstControl.includes("time")) {
                // Format as time only
                const timeOptions: Intl.DateTimeFormatOptions = {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                };

                // Add seconds if the time has non-zero seconds
                if (controlValue.getSeconds() !== 0) {
                    timeOptions.second = "2-digit";
                }

                return controlValue.toLocaleTimeString("vi-VN", timeOptions);
            }

            // Check if this is a datetime value (has time components)
            const hasTime =
                controlValue.getHours() !== 0 || controlValue.getMinutes() !== 0 || controlValue.getSeconds() !== 0;
            if (hasTime) {
                // Format as datetime
                return (
                    controlValue.toLocaleDateString("vi-VN") +
                    " " +
                    controlValue.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                );
            } else {
                // Format as date only
                return controlValue.toLocaleDateString("vi-VN");
            }
        } else if (
            controlValue &&
            typeof controlValue === "object" &&
            (controlValue.startDate || controlValue.endDate)
        ) {
            // DateRange object
            const startStr = controlValue.startDate ? controlValue.startDate.toLocaleDateString("vi-VN") : "";
            const endStr = controlValue.endDate ? controlValue.endDate.toLocaleDateString("vi-VN") : "";
            if (startStr && endStr) {
                return `${startStr} - ${endStr}`;
            } else if (startStr) {
                return `Từ ${startStr}`;
            } else if (endStr) {
                return `Đến ${endStr}`;
            }
        } else if (
            controlValue &&
            typeof controlValue === "object" &&
            (controlValue.date || controlValue.startTime || controlValue.endTime)
        ) {
            // DateTimeRange object
            const parts: string[] = [];

            if (controlValue.date) {
                parts.push(`Ngày: ${controlValue.date.toLocaleDateString("vi-VN")}`);
            }

            if (controlValue.startTime) {
                const timeStr = controlValue.startTime.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                parts.push(`Bắt đầu: ${timeStr}`);
            }

            if (controlValue.endTime) {
                const timeStr = controlValue.endTime.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                parts.push(`Kết thúc: ${timeStr}`);
            }

            if (controlValue.startDateTime) {
                const dateTimeStr =
                    controlValue.startDateTime.toLocaleDateString("vi-VN") +
                    " " +
                    controlValue.startDateTime.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    });
                parts.push(`Từ: ${dateTimeStr}`);
            }

            if (controlValue.endDateTime) {
                const dateTimeStr =
                    controlValue.endDateTime.toLocaleDateString("vi-VN") +
                    " " +
                    controlValue.endDateTime.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    });
                parts.push(`Đến: ${dateTimeStr}`);
            }

            return parts.join(" | ");
        }

        return controlValue ? String(controlValue) : "";
    }

    getValueType(form: FormGroup): string {
        const value = form.value;
        const firstControl = Object.keys(value)[0];
        const controlValue = value[firstControl];

        if (controlValue instanceof Date) {
            // Check if this is a time-only value
            if (firstControl.includes("Time") || firstControl.includes("time")) {
                return "Time";
            }
            return "Date";
        } else if (
            controlValue &&
            typeof controlValue === "object" &&
            (controlValue.startDate || controlValue.endDate)
        ) {
            return "DateRange";
        } else if (
            controlValue &&
            typeof controlValue === "object" &&
            (controlValue.date || controlValue.startTime || controlValue.endTime)
        ) {
            return "DateTimeRange";
        }

        return typeof controlValue;
    }

    // Event handlers for testing
    onDateChange(date: Date | null, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} date changed:`, date);
    }

    onDatetimeChange(datetime: Date | null, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} datetime changed:`, datetime);
    }

    onTimeChange(time: Date | null, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} time changed:`, time);
    }

    onDateTimeRangeChange(dateTimeRange: DateTimeRange | null, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} datetime range changed:`, dateTimeRange);
    }

    onDateRangeChange(dateRange: DateRange | null, componentTest: ComponentTest): void {
        console.log(`${componentTest.component} date range changed:`, dateRange);
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

    onPickerOpen(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} picker opened`);
    }

    onPickerClose(componentTest: ComponentTest): void {
        console.log(`${componentTest.component} picker closed`);
    }
}
