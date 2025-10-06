using Microsoft.AspNetCore.Mvc;
using OrderGenerator.Application.DTOs;
using OrderGenerator.Application.Interfaces;

namespace OrderGenerator.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder([FromBody] OrderDto orderDto)
    {
        try
        {
            var result = await _orderService.CreateOrderAsync(orderDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}