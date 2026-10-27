using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CozyHavenStay.Enums;

namespace CozyHavenStay.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public int NumberOfAdults { get; set; }

        public int NumberOfChildren { get; set; }

        public int NumberOfRooms { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal TotalFare { get; set; }

        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        public DateTime BookedAt { get; set; } = DateTime.UtcNow;

        public string? CancellationReason { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; } = null!;

        public Payment? Payment { get; set; }
    }
}