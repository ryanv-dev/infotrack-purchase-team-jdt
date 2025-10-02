using api.Data;
using api.Functions;
using api.Models;
using api.Validation;
using Microsoft.EntityFrameworkCore;

namespace api.Endpoints;

public static class PropertyEndpoints
{
    private static readonly string groupPath = "/property";
    public static void MapPropertyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup(groupPath);
        // POST /api/property/normalize
        group.MapPost("/normalize", async Task<IResult> (ExternalProperty p, PropertyDb db) =>
        {
            try
            {
                var normalized = PropertyNormalizer.Normalize(p);

                // Check if property with this address already exists
                var existingProperty = await db.Properties.FirstOrDefaultAsync(p => p.FullAddress == normalized.FullAddress);

                if (existingProperty != null)
                {
                    return TypedResults.Ok(new { exist_id = existingProperty.Id });
                }

                // Save the new normalized property to the database
                var newProperty = new Property
                {
                    FullAddress = normalized.FullAddress,
                    Lot = normalized.LotPlan?.Lot,
                    Plan = normalized.LotPlan?.Plan,
                    Volume = normalized.VolumeFolio?.Volume,
                    Folio = normalized.VolumeFolio?.Folio,
                    Status = normalized.Status,
                    Provider = normalized.SourceTrace.Provider,
                    RequestId = normalized.SourceTrace.RequestId,
                    ReceivedAt = normalized.SourceTrace.ReceivedAt
                };

                await db.Properties.AddAsync(newProperty);
                await db.SaveChangesAsync();

                return TypedResults.Created($"/property/{newProperty.Id}", normalized);
            }
            catch (Exception ex)
            {
                return TypedResults.BadRequest(new { error = ex.Message });
            }
        });

        // Simple GET endpoint to retrieve a property
        group.MapGet("/{id}", async Task<IResult> (int id, PropertyDb db) =>
        {
            var property = await db.Properties.FindAsync(id);

            if (property is null)
            {
                return TypedResults.NotFound();
            }

            return TypedResults.Ok(new InternalProperty (
                FullAddress: property.FullAddress,
                LotPlan: new (property.Lot, property.Plan),
                VolumeFolio: new (property.Volume, property.Folio),
                Status: property.Status,
                SourceTrace: new (property.Provider, property.RequestId, property.ReceivedAt)    
            ));
        });

        // Update volume/folio with validation

        group.MapPut("/{id}/volume-folio", async Task<IResult> (int id, VolumeFolio volFol, PropertyDb db) =>
        {
            if (await db.Properties.FindAsync(id) is not Property property)
                return TypedResults.NotFound();

            var (volume, folio, status) =
                PropertyNormalizer.NormalizeVolumeFolio(volFol.Volume, volFol.Folio);

            property.Volume = volume;
            property.Folio = folio;
            property.Status = status;

            await db.SaveChangesAsync();
            return TypedResults.Ok();
        })
        .AddEndpointFilter<VolumeFolioValidationFilter>();
    }
}
