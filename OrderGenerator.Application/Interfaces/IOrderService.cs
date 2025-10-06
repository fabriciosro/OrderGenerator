using OrderGenerator.Application.DTOs;

namespace OrderGenerator.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderAsync(OrderDto orderDto);
}