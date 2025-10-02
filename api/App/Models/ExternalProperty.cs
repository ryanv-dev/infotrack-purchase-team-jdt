namespace api.Models;

public record ExternalProperty( 
    string? Provider, 
    string? RequestId, 
    DateTimeOffset? ReceivedAt, 
    AddressParts? AddressParts, 
    string? FormattedAddress, 
    LotPlan? LotPlan, 
    Title? Title 
);

public record Title(
    string Volume,
    string Folio
);

public record LotPlan(
    string? Lot,
    string? Plan
);

public record AddressParts(
    string Street,
    string Suburb,
    string State,
    string Postcode
);
