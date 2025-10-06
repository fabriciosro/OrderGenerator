using OrderGenerator.Application.Interfaces;
using OrderGenerator.Application.Services;
using OrderGenerator.Infrastructure;
using OrderGenerator.Presentation;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));

// Add layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Order Generator API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add SPA static files
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.MapControllers();

// SPA fallback
app.MapFallbackToFile("index.html");

var port = 5000;
var url = $"http://localhost:{port}";

app.Run(url);