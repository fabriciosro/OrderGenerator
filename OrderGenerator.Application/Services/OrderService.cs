using OrderGenerator.Application.DTOs;
using OrderGenerator.Application.Interfaces;
using OrderGenerator.Domain.Entities;
using OrderGenerator.Domain.Interfaces;
using System.Text.Json;

namespace OrderGenerator.Application.Services;

public class OrderService : IOrderService
{
    private readonly IFixMessageService _fixMessageService;

    public OrderService(IFixMessageService fixMessageService)
    {
        _fixMessageService = fixMessageService;
    }

    public async Task<OrderResponseDto> CreateOrderAsync(OrderDto orderDto)
    {
        var orderSide = orderDto.Side.Equals("COMPRA", StringComparison.CurrentCultureIgnoreCase) ? OrderSide.Buy : OrderSide.Sell;

        var order = new Order(orderDto.Symbol, orderSide, orderDto.Quantity, orderDto.Price);

        var result = await _fixMessageService.SendNewOrderSingleAsync(order);

        return JsonSerializer.Deserialize<OrderResponseDto>(result);
    }
}