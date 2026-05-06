import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppTableComponent,
  AppTableTemplateDirective,
  TableColumn,
} from '../../shared/rule-component/app-table/app-table.component';
import { AppButtonComponent } from '../../shared/rule-component/app-button/app-button.component';
import { AppIconButtonComponent } from '../../shared/rule-component/app-icon-button/app-icon-button.component';

// --- Sample Data Interfaces ---
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  salary: number;
}

@Component({
  selector: 'app-table-test',
  templateUrl: './app-table-test.component.html',
  standalone: true,
  imports: [
    CommonModule,
    AppTableComponent,
    AppTableTemplateDirective,
    AppButtonComponent,
    AppIconButtonComponent,
  ],
})
export class AppTableTestComponent implements OnInit {
  // --- State for demo controls ---
  isLoading = false;
  showEmpty = false;

  // --- Cột cơ bản ---
  basicColumns: TableColumn[] = [
    {
      field: 'id',
      header: 'ID',
      width: '60px',
      align: 'center',
      sortable: true,
    },
    { field: 'name', header: 'Họ và Tên', sortable: true, filterable: true },
    { field: 'email', header: 'Email', filterable: true },
    {
      field: 'department',
      header: 'Phòng ban',
      sortable: true,
      filterable: true,
      filterType: 'dropdown',
      filterOptions: [
        { text: 'Kỹ thuật', value: 'Kỹ thuật' },
        { text: 'Kinh doanh', value: 'Kinh doanh' },
        { text: 'Nhân sự', value: 'Nhân sự' },
        { text: 'Kế toán', value: 'Kế toán' },
      ],
    },
    {
      field: 'joinDate',
      header: 'Ngày vào làm',
      type: 'date',
      sortable: true,
      width: '130px',
      align: 'center',
    },
    {
      field: 'salary',
      header: 'Lương',
      type: 'number',
      sortable: true,
      width: '120px',
      align: 'right',
    },
    {
      field: 'status',
      header: 'Trạng thái',
      type: 'badge',
      width: '110px',
      align: 'center',
      sortable: true,
      badgeClass: (value: string) => {
        if (value === 'active') return 'badge-success';
        if (value === 'inactive') return 'badge-danger';
        return 'badge-warning';
      },
    },
    {
      field: 'actions',
      header: 'Thao tác',
      width: '100px',
      align: 'center',
      type: 'custom',
    },
  ];

  // --- Dữ liệu mẫu ---
  employees: Employee[] = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@company.com',
      department: 'Kỹ thuật',
      position: 'Senior Dev',
      status: 'active',
      joinDate: '2022-03-15',
      salary: 25000000,
    },
    {
      id: 2,
      name: 'Trần Thị Bích',
      email: 'bich.tran@company.com',
      department: 'Kinh doanh',
      position: 'Sales Manager',
      status: 'active',
      joinDate: '2021-07-01',
      salary: 30000000,
    },
    {
      id: 3,
      name: 'Lê Hoàng Minh',
      email: 'minh.le@company.com',
      department: 'Nhân sự',
      position: 'HR Specialist',
      status: 'inactive',
      joinDate: '2020-01-20',
      salary: 18000000,
    },
    {
      id: 4,
      name: 'Phạm Thị Lan',
      email: 'lan.pham@company.com',
      department: 'Kế toán',
      position: 'Accountant',
      status: 'active',
      joinDate: '2023-05-10',
      salary: 20000000,
    },
    {
      id: 5,
      name: 'Đỗ Quang Huy',
      email: 'huy.do@company.com',
      department: 'Kỹ thuật',
      position: 'DevOps Engineer',
      status: 'pending',
      joinDate: '2024-01-02',
      salary: 28000000,
    },
    {
      id: 6,
      name: 'Vũ Thị Thu',
      email: 'thu.vu@company.com',
      department: 'Kinh doanh',
      position: 'Sales Rep',
      status: 'active',
      joinDate: '2022-11-30',
      salary: 16000000,
    },
    {
      id: 7,
      name: 'Ngô Đình Long',
      email: 'long.ngo@company.com',
      department: 'Kỹ thuật',
      position: 'Frontend Dev',
      status: 'active',
      joinDate: '2023-08-15',
      salary: 22000000,
    },
    {
      id: 8,
      name: 'Hoàng Minh Tuấn',
      email: 'tuan.hoang@company.com',
      department: 'Nhân sự',
      position: 'HR Manager',
      status: 'active',
      joinDate: '2019-04-22',
      salary: 35000000,
    },
    {
      id: 9,
      name: 'Đinh Thị Hoa',
      email: 'hoa.dinh@company.com',
      department: 'Kế toán',
      position: 'Chief Accountant',
      status: 'active',
      joinDate: '2018-09-01',
      salary: 40000000,
    },
    {
      id: 10,
      name: 'Bùi Văn Khoa',
      email: 'khoa.bui@company.com',
      department: 'Kỹ thuật',
      position: 'Backend Dev',
      status: 'inactive',
      joinDate: '2021-03-10',
      salary: 24000000,
    },
    {
      id: 11,
      name: 'Trịnh Thị Hường',
      email: 'huong.trinh@company.com',
      department: 'Kinh doanh',
      position: 'Account Exec',
      status: 'active',
      joinDate: '2022-06-25',
      salary: 21000000,
    },
    {
      id: 12,
      name: 'Lương Quốc Bảo',
      email: 'bao.luong@company.com',
      department: 'Kỹ thuật',
      position: 'QA Engineer',
      status: 'pending',
      joinDate: '2024-02-18',
      salary: 19000000,
    },
  ];

  ngOnInit(): void {}

  // --- Actions ---
  onEdit(row: Employee): void {
    alert(`Chỉnh sửa: ${row.name}`);
  }

  onDelete(row: Employee): void {
    if (confirm(`Xóa nhân viên ${row.name}?`)) {
      this.employees = this.employees.filter((e) => e.id !== row.id);
    }
  }

  toggleLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
  }

  toggleEmpty(): void {
    this.showEmpty = !this.showEmpty;
  }

  get displayData(): Employee[] {
    return this.showEmpty ? [] : this.employees;
  }

  getStatusText(status: string): string {
    if (status === 'active') return 'Hoạt động';
    if (status === 'inactive') return 'Dừng hoạt động';
    return 'Chờ duyệt';
  }
}
