using Microsoft.Extensions.DependencyInjection;
using OrderGenerator.Application.Interfaces;
using OrderGenerator.Application.Services;

namespace OrderGenerator.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IOrderService, OrderService>();
        return services;
    }
}