using FluentValidation;
using QuickApp.Core.Models.Shop;

namespace QuickApp.Server.Configuration.FluentValidations
{
    public class NhaCungCapValidator : AbstractValidator<NhaCungCap>
    {
        public NhaCungCapValidator()
        {
            RuleFor(x => x.MaNhaCungCap)
                .Must(x => string.IsNullOrEmpty(x)) // người dùng không nhập
                .WithMessage("Mã nhà cung cấp được sinh tự động, không được nhập.")
                .MustAsync(async (ma, _) => await IsMaNhaCungCapUnique(ma))
                .WithMessage("Mã nhà cung cấp đã tồn tại.")
                .When(x => !string.IsNullOrEmpty(x.MaNhaCungCap)); // chỉ check khi có giá trị

            RuleFor(x => x.TenNhaCungCap)
                .NotEmpty().WithMessage("Tên nhà cung cấp không được để trống.")
                .MaximumLength(50).WithMessage("Tên nhà cung cấp vượt quá 50 ký tự.");

            RuleFor(x => x.SoDienThoai)
                .NotEmpty().WithMessage("Số điện thoại không được để trống.")
                .Matches(@"^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$")
                .WithMessage("Số điện thoại không hợp lệ (phải là số Việt Nam).");

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Email không đúng định dạng.")
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.TenNguoiLienHe)
                .NotEmpty().WithMessage("Tên người liên hệ không được để trống.");
            // Không set .MaximumLength nên sẽ không báo lỗi nếu dài quá
        }

        // 👇 Giả lập hàm kiểm tra mã nhà cung cấp có tồn tại hay chưa (bạn sẽ thay thế bằng DB thực)
        private async Task<bool> IsMaNhaCungCapUnique(string ma)
        {
            // Gọi DB check trùng ở đây, ví dụ EF Core:
            // return !await _context.NhaCungCaps.AnyAsync(x => x.MaNhaCungCap == ma);
            await Task.Delay(10); // Giả lập async
            return true; // Luôn đúng trong demo
        }
    }
}
