// OrderGenerator.Application/Services/ExposureService.cs
using OrderGenerator.Application.Interfaces;
using OrderGenerator.Application.DTOs;
using Microsoft.Extensions.Logging;

namespace OrderGenerator.Application.Services;

public class ExposureService : IExposureService
{
    private readonly ILogger<ExposureService> _logger;

    public ExposureService(ILogger<ExposureService> logger)
    {
        _logger = logger;
    }

    public async Task<List<ExposureDto>> GetExposuresAsync()
    {
        try
        {
            _logger.LogInformation("Calling OrderAccumulator API for exposures");

            // Criar HttpClient localmente
            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            };

            using var client = new HttpClient(handler);

            var response = await client.GetAsync("https://localhost:5000/api/Exposure");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("OrderAccumulator API response received");

            var exposures = System.Text.Json.JsonSerializer.Deserialize<List<ExposureDto>>(content);
            return exposures ?? new List<ExposureDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling OrderAccumulator API");

            // Fallback
            return new List<ExposureDto>
            {
                new ExposureDto { Symbol = "PETR4", CurrentExposure = 100000000, Id = Guid.NewGuid() },
                new ExposureDto { Symbol = "VALE3", CurrentExposure = 50000000, Id = Guid.NewGuid() },
                new ExposureDto { Symbol = "VIIA4", CurrentExposure = -25000000, Id = Guid.NewGuid() }
            };
        }
    }
}