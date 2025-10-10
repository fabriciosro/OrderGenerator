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

            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            };

            using var client = new HttpClient(handler);

            var response = await client.GetAsync("https://localhost:5000/api/Exposure");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("OrderAccumulator API response received");

            var options = new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var exposures = System.Text.Json.JsonSerializer.Deserialize<List<ExposureDto>>(content, options);
            return exposures ?? new List<ExposureDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling OrderAccumulator API");

            return new List<ExposureDto>
            {
                new ExposureDto { Symbol = "PETR4", CurrentExposure = 100000000, Id = Guid.NewGuid() },
                new ExposureDto { Symbol = "VALE3", CurrentExposure = 50000000, Id = Guid.NewGuid() },
                new ExposureDto { Symbol = "VIIA4", CurrentExposure = -25000000, Id = Guid.NewGuid() }
            };
        }
    }

    public async Task<string> ResetAccumulatorAsync()
    {
        try
        {
            _logger.LogInformation("Resetting OrderAccumulator exposures");

            var handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
            };

            using var client = new HttpClient(handler);

            var response = await client.PostAsync("https://localhost:5000/api/Exposure", null);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("OrderAccumulator reset successfully: {Response}", responseContent);

                var result = System.Text.Json.JsonSerializer.Deserialize<ResetResponseDto>(responseContent);
                return result?.Message ?? "Reset completed successfully";
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Reset failed with status {StatusCode}: {Error}",
                    response.StatusCode, errorContent);
                return $"Reset failed: {response.StatusCode}";
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resetting OrderAccumulator");
            return $"Reset error: {ex.Message}";
        }
    }
}