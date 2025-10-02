namespace api.Models;

using System.Text.Json.Serialization;

public record InternalProperty( 
    string FullAddress, 
    LotPlan? LotPlan,
    VolumeFolio VolumeFolio,
    VolumeFolioStatus Status,
    SourceTrace SourceTrace
);

public record VolumeFolio(
    string? Volume,
    string? Folio
);

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum VolumeFolioStatus
{
    KnownVolFol,
    UnknownVolFol
}

public record SourceTrace(
    string? Provider,
    string? RequestId,
    DateTimeOffset? ReceivedAt
);
