using OrderGenerator.Domain.Entities;

namespace OrderGenerator.Domain.Interfaces;

public interface IFixMessageService
{
    Task<string> SendNewOrderSingleAsync(Order order);
}