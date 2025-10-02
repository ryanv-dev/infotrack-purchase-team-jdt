using System.Text.RegularExpressions;
using api.Models;

namespace api.Validation;

public partial class VolumeFolioValidationFilter : IEndpointFilter
{
    [GeneratedRegex(@"^\d{1,6}$")]
    private static partial Regex VolumeRegex();
    
    [GeneratedRegex(@"^\d{1,5}$")]
    private static partial Regex FolioRegex();
    
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        if (context.Arguments[1] is not VolumeFolio volFol)
        {
            return TypedResults.BadRequest("Invalid volume/folio format");
        }

        if (!string.IsNullOrEmpty(volFol.Volume) && !VolumeRegex().IsMatch(volFol.Volume))
        {
            return TypedResults.BadRequest("Volume must be 1-6 digits");
        }

        if (!string.IsNullOrEmpty(volFol.Folio) && !FolioRegex().IsMatch(volFol.Folio))
        {
            return TypedResults.BadRequest("Folio must be 1-5 digits");
        }

        return await next(context);
    }
}
