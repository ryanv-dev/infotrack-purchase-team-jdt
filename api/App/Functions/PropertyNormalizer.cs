using api.Models;

namespace api.Functions;

/// <summary>
/// Handles property normalization logic
/// </summary>
public static class PropertyNormalizer
{
    /// <summary>
    /// Normalizes the property data from external to internal format
    /// </summary>
    public static InternalProperty Normalize(ExternalProperty property)
    {
        // Get the full address without normalizing
        var fullAddress = GetAddress(property.FormattedAddress, property.AddressParts);
        if (string.IsNullOrWhiteSpace(fullAddress))
        {
            throw new ArgumentNullException(
                null,
                "Cannot normalize address: both FormattedAddress and AddressParts are null or empty."
            );
        }

        // Extract and normalize volume and folio from title
        var (volume, folio, status) = NormalizeVolumeFolio(
            property.Title?.Volume,
            property.Title?.Folio
        );
        
        var volumeFolio = new VolumeFolio(volume, folio);

        // Create the normalized internal property
        return new InternalProperty(
            FullAddress: fullAddress,
            LotPlan: property.LotPlan,
            VolumeFolio: volumeFolio,
            Status: status,
            SourceTrace: new (
                property.Provider,
                property.RequestId,
                property.ReceivedAt
            )
        );
    }

    private static string GetAddress(string? formattedAddress, AddressParts? parts)
    {
        string addressToNormalize;

        // Use formatted address if available
        if (!string.IsNullOrWhiteSpace(formattedAddress))
        {
            addressToNormalize = formattedAddress;
        }
        // Otherwise compose from parts
        else if (parts != null)
        {
            var composedParts = new[] 
            {
                parts.Street + ",",
                parts.Suburb,
                parts.State,
                parts.Postcode
            }.Where(s => !string.IsNullOrWhiteSpace(s));
            
            addressToNormalize = string.Join(" ", composedParts);
        }
        else
        {
            return string.Empty;
        }

        return string.Join(" ", addressToNormalize.Split([' '], StringSplitOptions.RemoveEmptyEntries));
    }

    /// <summary>
    /// Updates volume and folio information and determines the appropriate status
    /// </summary>
    /// <returns>A tuple containing the normalized volume, folio and the determined status</returns>
    public static (string? Volume, string? Folio, VolumeFolioStatus Status) NormalizeVolumeFolio(string? volume, string? folio)
    {
        var normalizedVolume = volume?.Trim();
        var normalizedFolio = folio?.Trim();
        
        var status = string.IsNullOrWhiteSpace(normalizedVolume) || 
                    string.IsNullOrWhiteSpace(normalizedFolio)
            ? VolumeFolioStatus.UnknownVolFol
            : VolumeFolioStatus.KnownVolFol;

        return (
            Volume: string.IsNullOrWhiteSpace(normalizedVolume) ? null : normalizedVolume,
            Folio: string.IsNullOrWhiteSpace(normalizedFolio) ? null : normalizedFolio,
            Status: status
        );
    }


}
