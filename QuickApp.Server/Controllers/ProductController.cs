// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickApp.Core.Models.Shop;
using QuickApp.Core.Services.Shop;
using QuickApp.Server.Authorization;
using QuickApp.Server.ViewModels.Shop;

namespace QuickApp.Server.Controllers
{
    [Route("api/products")]
    [Authorize]
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;

        public ProductController(ILogger<ProductController> logger, IMapper mapper, IProductService productService)
            : base(logger, mapper)
        {
            _productService = productService;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<ProductVM>))]
        public IActionResult GetAll()
        {
            var products = _productService.GetAllProducts();
            return Ok(_mapper.Map<IEnumerable<ProductVM>>(products));
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(200, Type = typeof(ProductVM))]
        [ProducesResponseType(404)]
        public IActionResult GetById(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
                return NotFound(id);

            return Ok(_mapper.Map<ProductVM>(product));
        }

        [HttpPost]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [ProducesResponseType(201, Type = typeof(ProductVM))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] ProductVM productVM)
        {
            if (productVM == null)
                return BadRequest("Product data is required.");

            var product = _mapper.Map<Product>(productVM);
            var result = await _productService.CreateProductAsync(product);

            if (!result.Succeeded)
            {
                AddModelError(result.Errors);
                return BadRequest(ModelState);
            }

            var createdProduct = _mapper.Map<ProductVM>(result.Product);
            return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, createdProduct);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update(int id, [FromBody] ProductVM productVM)
        {
            if (productVM == null)
                return BadRequest("Product data is required.");

            var product = _productService.GetProductById(id);
            if (product == null)
                return NotFound(id);

            _mapper.Map(productVM, product);
            var result = await _productService.UpdateProductAsync(product);

            if (!result.Succeeded)
            {
                AddModelError(result.Errors);
                return BadRequest(ModelState);
            }

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize(AuthPolicies.ManageAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(ProductVM))]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id)
        {
            var product = _productService.GetProductById(id);
            if (product == null)
                return NotFound(id);

            var result = await _productService.DeleteProductAsync(product);

            if (!result.Succeeded)
            {
                AddModelError(result.Errors);
                return BadRequest(ModelState);
            }

            return Ok(_mapper.Map<ProductVM>(product));
        }
    }
}