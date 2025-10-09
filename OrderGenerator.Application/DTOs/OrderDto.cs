namespace OrderGenerator.Application.DTOs;

public class OrderDto
{
    public string Symbol { get; set; }
    public int Side { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
}

public class OrderResponseDto
{
    public string OrderID { get; set; }
    public string ExecType { get; set; }
    public string Symbol { get; set; }
    public string Side { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; }
    public string Message { get; set; }
}