using FluentValidation;
using QuickApp.Core.Models.Shop;

namespace QuickApp.Server.Configuration.FluentValidations
{
    public class BlogPostValidator : AbstractValidator<AppBlogPost>
    {
        public BlogPostValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề không được để trống.")
                .MaximumLength(255).WithMessage("Tiêu đề không được vượt quá 255 ký tự.");

            RuleFor(x => x.Slug)
                .NotEmpty().WithMessage("Slug không được để trống.")
                .MaximumLength(255).WithMessage("Slug không được vượt quá 255 ký tự.")
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
                .WithMessage("Slug chỉ chứa chữ thường, số và dấu gạch ngang.");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Nội dung không được để trống.");

            RuleFor(x => x.ThumbnailImage)
                .MaximumLength(255).WithMessage("Đường dẫn ảnh thumbnail không được vượt quá 255 ký tự.")
                .When(x => !string.IsNullOrWhiteSpace(x.ThumbnailImage));

            RuleFor(x => x.PublishedDate)
                .Must(date => date == null || date <= DateTime.UtcNow.AddMinutes(5))
                .WithMessage("Ngày đăng không được là ngày trong tương lai.")
                .When(x => x.PublishedDate.HasValue);
        }
    }
}
