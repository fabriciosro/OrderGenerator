using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OrderGenerator.Application.DTOs;
using OrderGenerator.Application.Interfaces;
using OrderGenerator.Application.Services;

namespace OrderGenerator.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExposuresController : ControllerBase
{
    private readonly IExposureService _exposureService;
    private readonly ILogger<ExposuresController> _logger;

    public ExposuresController(IExposureService exposureService, ILogger<ExposuresController> logger)
    {
        _exposureService = exposureService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<ExposureDto>>> GetExposures()
    {
        try
        {
            var exposures = await _exposureService.GetExposuresAsync();
            return Ok(exposures);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult> ResetAccumulator()
    {
        try
        {
            _logger.LogInformation("Received reset request");

            var result = await _exposureService.ResetAccumulatorAsync();

            return Ok(new { message = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in reset controller");
            return BadRequest(new { error = ex.Message });
        }
    }
}