using OrderGenerator.Domain.Common;

namespace OrderGenerator.Domain.Entities;

public class Order
{
    public Guid Id { get; private set; }
    public string Symbol { get; private set; }
    public OrderSide Side { get; private set; }
    public decimal Quantity { get; private set; }
    public decimal Price { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public OrderStatus Status { get; private set; }

    private Order() { }

    public Order(string symbol, OrderSide side, decimal quantity, decimal price)
    {
        Id = Guid.NewGuid();
        Symbol = symbol;
        Side = side;
        Quantity = quantity;
        Price = price;
        CreatedAt = DateTime.UtcNow;
        Status = OrderStatus.Pending;

        Validate();
    }

    private void Validate()
    {
        var validSymbols = new[] { "PETR4", "VALE3", "VIIA4" };
        if (!validSymbols.Contains(Symbol))
            throw new DomainException("Símbolo inválido");

        if (Quantity <= 0 || Quantity >= 100000)
            throw new DomainException("Quantidade deve ser positiva e menor que 100.000");

        if (Price <= 0 || Price >= 1000)
            throw new DomainException("Preço deve ser positivo e menor que 1.000");

        if (Price * 100 % 1 != 0)
            throw new DomainException("Preço deve ser múltiplo de 0.01");
    }

    public void UpdateStatus(OrderStatus status)
    {
        Status = status;
    }
}

public enum OrderSide
{
    Buy = 1,
    Sell = 2
}

public enum OrderStatus
{
    Pending,
    Accepted,
    Rejected,
    Error
}