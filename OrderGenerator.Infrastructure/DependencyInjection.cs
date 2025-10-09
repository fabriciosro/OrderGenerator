using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using OrderGenerator.Domain.Interfaces;
using OrderGenerator.Infrastructure.Fix;
using QuickFix;
using QuickFix.Logger;
using QuickFix.Store;
using QuickFix.Transport;

namespace OrderGenerator.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<FixApplication>();
        services.AddSingleton<IFixMessageService>(provider => provider.GetRequiredService<FixApplication>());
        services.AddSingleton<IApplication>(provider => provider.GetRequiredService<FixApplication>());

        // Configure FIX initiator - SEM LOGGER AQUI
        services.AddSingleton(provider =>
        {
            try
            {
                var settings = new SessionSettings("fix-client.cfg");
                var storeFactory = new FileStoreFactory(settings);
                var logFactory = new FileLogFactory(settings);
                var application = provider.GetRequiredService<IApplication>();

                return new SocketInitiator(application, storeFactory, settings, logFactory);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Failed to create FIX Initiator", ex);
            }
        });

        services.AddSingleton<IInitiator>(provider => provider.GetRequiredService<SocketInitiator>());
        services.AddHostedService<FixInitiatorService>();

        return services;
    }
}