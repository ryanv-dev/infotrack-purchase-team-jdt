using api.Functions;
using api.Models;
namespace api.Tests.UnitTests.Functions;

public class PropertyNormalizer_NormalizeShould
{
    [Test]
    public void Normalize_HasTitleOrNonEmptyValues_ReturnKnownVolFol()
    {
        var property = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: null,
            FormattedAddress: "addr",
            LotPlan: null,
            Title: new Title("V1", "F1")
        );
        var result = PropertyNormalizer.Normalize(property);
        Assert.That(result.Status, Is.EqualTo(VolumeFolioStatus.KnownVolFol));
    }

    [Test]
    public void Normalize_EmptyTitleValues_ReturnUnknownVolFol()
    {
        var propertyWithEmptyTitleValues = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: null,
            FormattedAddress: "addr",
            LotPlan: null,
            Title: new Title("", "")
        );
        var result = PropertyNormalizer.Normalize(propertyWithEmptyTitleValues);

        Assert.Multiple(() =>
        {
            Assert.That(result.VolumeFolio?.Volume, Is.Null);
            Assert.That(result.VolumeFolio?.Folio, Is.Null);
        });
        Assert.That(result.Status, Is.EqualTo(VolumeFolioStatus.UnknownVolFol));
    }

    [Test]
    public void Normalize_NullTitle_ReturnUnknownVolFol()
    {
        var propertyWithEmptyTitleValues = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: null,
            FormattedAddress: "addr",
            LotPlan: null,
            Title: null
        );
        var result = PropertyNormalizer.Normalize(propertyWithEmptyTitleValues);

        Assert.Multiple(() =>
        {
            Assert.That(result.VolumeFolio?.Volume, Is.Null);
            Assert.That(result.VolumeFolio?.Folio, Is.Null);
        });
        Assert.That(result.Status, Is.EqualTo(VolumeFolioStatus.UnknownVolFol));
    }

    [TestCase(null, " 123 Main St", " Suburb ", " ST ", " 1234 ", "123 Main St, Suburb ST 1234")]
    [TestCase("", "123 Main St", "Suburb", "ST", "1234", "123 Main St, Suburb ST 1234")]
    public void Normalize_NullOrEmptyFormattedAddress_ConstructsFromAddressParts(
        string? formattedAddress,
        string street,
        string suburb,
        string state,
        string postcode,
        string expectedAddress
    )
    {
        var parts = new AddressParts(street, suburb, state, postcode);
        var property = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: parts,
            FormattedAddress: formattedAddress,
            LotPlan: null,
            Title: null
        );
        var result = PropertyNormalizer.Normalize(property);
        Assert.That(result.FullAddress, Is.EqualTo(expectedAddress));
    }

    [TestCase(null)]
    [TestCase("")]
    public void Normalize_NullAddressPartsAndNullOrEmptyFormattedAddress_ThrowsArgumentException(string? formattedAddress)
    {
        var property = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: null,
            FormattedAddress: formattedAddress,
            LotPlan: null,
            Title: null
        );

        var ex = Assert.Throws<ArgumentNullException>(() =>
        {
            PropertyNormalizer.Normalize(property);
        });

        Assert.That(ex.Message, Is.EqualTo("Cannot normalize address: both FormattedAddress and AddressParts are null or empty."));
    }


    [Test]
    public void Normalize_UsesFormattedAddress_WhenPresent()
    {
        var property = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: new AddressParts("1 Test St", "Suburb", "ST", "1234"),
            FormattedAddress: " 123 Main St, Suburb ST 1234 ",
            LotPlan: null,
            Title: null
        );
        var result = PropertyNormalizer.Normalize(property);
        Assert.That(result.FullAddress, Is.EqualTo("123 Main St, Suburb ST 1234"));
    }

    [Test]
    public void Normalize_CollapseMultipleSpacesInAddress()
    {
        var property = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: null,
            FormattedAddress: "10   Example    St,    Carlton   VIC    3053",
            LotPlan: null,
            Title: null
        );
        var result = PropertyNormalizer.Normalize(property);
        Assert.That(result.FullAddress, Is.EqualTo("10 Example St, Carlton VIC 3053"));
    }

    [Test]
    public void Normalize_CollapseSpacesFromAddressParts()
    {
        var property = new ExternalProperty(
            Provider: "p",
            RequestId: "r",
            ReceivedAt: DateTimeOffset.UtcNow,
            AddressParts: new AddressParts(
                "10   Example    St",
                "   Carlton   ",
                "   VIC   ",
                "   3053   "
            ),
            FormattedAddress: null,
            LotPlan: null,
            Title: null
        );
        var result = PropertyNormalizer.Normalize(property);
        Assert.That(result.FullAddress, Is.EqualTo("10 Example St, Carlton VIC 3053"));
    }

    [Test]
    public void Normalize_SourceTraceIsPopulatedCorrectly()
    {
        var receivedAt = DateTimeOffset.UtcNow;
        var property = new ExternalProperty(
            Provider: "ProviderX",
            RequestId: "Req123",
            ReceivedAt: receivedAt,
            AddressParts: null,
            FormattedAddress: "addr",
            LotPlan: null,
            Title: null
        );
        var result = PropertyNormalizer.Normalize(property);
        Assert.Multiple(() =>
        {
            Assert.That(result.SourceTrace.Provider, Is.EqualTo("ProviderX"));
            Assert.That(result.SourceTrace.RequestId, Is.EqualTo("Req123"));
            Assert.That(result.SourceTrace.ReceivedAt, Is.EqualTo(receivedAt));
        });
    }
}
