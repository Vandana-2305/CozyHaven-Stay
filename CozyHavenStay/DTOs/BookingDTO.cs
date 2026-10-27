using CozyHavenStay.Enums;

namespace CozyHavenStay.DTOs
{
    public class CreateBookingDTO
    {
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfAdults { get; set; }
        public int NumberOfChildren { get; set; }
        public int NumberOfRooms { get; set; }
    }

    public class BookingResponseDTO
    {
        public int BookingId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfAdults { get; set; }
        public int NumberOfChildren { get; set; }
        public int NumberOfRooms { get; set; }
        public decimal TotalFare { get; set; }
        public BookingStatus Status { get; set; }
        public DateTime BookedAt { get; set; }
        public string? CancellationReason { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public string HotelLocation { get; set; } = string.Empty;
    }

    public class CancelBookingDTO
    {
        public string? CancellationReason { get; set; }
    }
}