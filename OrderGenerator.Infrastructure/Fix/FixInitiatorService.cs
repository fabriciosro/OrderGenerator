using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using QuickFix;

namespace OrderGenerator.Infrastructure.Fix;

public class FixInitiatorService : IHostedService
{
    private readonly IInitiator _initiator;
    private readonly ILogger<FixInitiatorService> _logger;
    private bool _isStarted = false;

    public FixInitiatorService(IInitiator initiator, ILogger<FixInitiatorService> logger)
    {
        _initiator = initiator;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            if (!_isStarted)
            {
                _logger.LogInformation("Starting FIX Initiator...");
                _initiator.Start();
                _isStarted = true;
                _logger.LogInformation("FIX Initiator started successfully");
            }
            else
            {
                _logger.LogInformation("FIX Initiator already started");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start FIX Initiator");
            throw;
        }

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        try
        {
            if (_isStarted)
            {
                _logger.LogInformation("Stopping FIX Initiator...");
                _initiator.Stop();
                _isStarted = false;
                _logger.LogInformation("FIX Initiator stopped successfully");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error stopping FIX Initiator");
        }

        return Task.CompletedTask;
    }
}