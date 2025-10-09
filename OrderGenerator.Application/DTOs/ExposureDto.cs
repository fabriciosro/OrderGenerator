namespace OrderGenerator.Application.DTOs;

public class ExposureDto
{
    public string Symbol { get; set; } = string.Empty;
    public decimal CurrentExposure { get; set; }
    public Guid Id { get; set; }
}