using api.Data;
using api.Endpoints;
using Microsoft.EntityFrameworkCore;

namespace api;

public static class MainProgram
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<PropertyDb>(opt => 
            opt.UseSqlite("Data Source=Property.db"));

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddOpenApiDocument(config =>
        {
            config.DocumentName = "PropertyAPI";
            config.Title = "PropertyAPI v1";
            config.Version = "v1";
        });
        builder.Services.AddCors();

        var app = builder.Build();

        app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi();
        }

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PropertyDb>();
            db.Database.EnsureCreated();
        }

        var apiGroup = app.MapGroup("/api");
        apiGroup.MapPropertyEndpoints();

        app.Run();
    }
}
