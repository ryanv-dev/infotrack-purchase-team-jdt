namespace api.Data;

using Microsoft.EntityFrameworkCore;
using api.Models;
using System.ComponentModel.DataAnnotations;

public class PropertyDb(DbContextOptions<PropertyDb> options) : DbContext(options)
{
    public DbSet<Property> Properties { get; set; }
}

public class Property
{
    [Key]
    public int Id { get; set; }
    public required string FullAddress { get; set; }
    public string? Lot { get; set; }
    public string? Plan { get; set; }
    public string? Volume { get; set; }
    public string? Folio { get; set; }
    public VolumeFolioStatus Status { get; set; } = VolumeFolioStatus.UnknownVolFol;
    public string? Provider { get; set; }
    public string? RequestId { get; set; }
    public DateTimeOffset? ReceivedAt { get; set; }
}
