using OrderGenerator.Application.DTOs;

namespace OrderGenerator.Application.Interfaces;
public interface IExposureService
{
    Task<List<ExposureDto>> GetExposuresAsync();
    Task<string> ResetAccumulatorAsync();
}