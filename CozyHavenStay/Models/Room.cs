using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CozyHavenStay.Enums;

namespace CozyHavenStay.Models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        [Required, MaxLength(10)]
        public string RoomNumber { get; set; } = string.Empty;

        public double RoomSizeInSqFt { get; set; }

        [Required]
        public BedType BedType { get; set; }

        public int MaxOccupancy { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal BaseFare { get; set; }

        public bool IsAC { get; set; }

        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int HotelId { get; set; }

        [ForeignKey("HotelId")]
        public Hotel Hotel { get; set; } = null!;

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}