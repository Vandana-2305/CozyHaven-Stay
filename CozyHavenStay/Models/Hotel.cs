using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CozyHavenStay.Models
{
    public class Hotel
    {
        [Key]
        public int HotelId { get; set; }

        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        // Amenities as boolean flags
        public bool HasDining { get; set; }
        public bool HasParking { get; set; }
        public bool HasFreeWifi { get; set; }
        public bool HasRoomService { get; set; }
        public bool HasSwimmingPool { get; set; }
        public bool HasFitnessCenter { get; set; }

        public double AverageRating { get; set; } = 0.0;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public User Owner { get; set; } = null!;

        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<HotelImage> Images { get; set; } = new List<HotelImage>();
    }
}