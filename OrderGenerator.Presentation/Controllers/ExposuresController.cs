using Microsoft.AspNetCore.Mvc;
using OrderGenerator.Application.DTOs;
using OrderGenerator.Application.Interfaces;
using OrderGenerator.Application.Services;

namespace OrderGenerator.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExposuresController : ControllerBase
{
    private readonly IExposureService _exposureService;

    public ExposuresController(IExposureService exposureService)
    {
        _exposureService = exposureService;
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
}