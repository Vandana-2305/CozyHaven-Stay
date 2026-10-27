namespace CozyHavenStay.DTOs
{
    public class CreateHotelDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool HasDining { get; set; }
        public bool HasParking { get; set; }
        public bool HasFreeWifi { get; set; }
        public bool HasRoomService { get; set; }
        public bool HasSwimmingPool { get; set; }
        public bool HasFitnessCenter { get; set; }
    }

    public class HotelResponseDTO
    {
        public int HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool HasDining { get; set; }
        public bool HasParking { get; set; }
        public bool HasFreeWifi { get; set; }
        public bool HasRoomService { get; set; }
        public bool HasSwimmingPool { get; set; }
        public bool HasFitnessCenter { get; set; }
        public double AverageRating { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();
        public List<RoomResponseDTO> Rooms { get; set; } = new();
    }

    public class UpdateHotelDTO
    {
        public string? Name { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool HasDining { get; set; }
        public bool HasParking { get; set; }
        public bool HasFreeWifi { get; set; }
        public bool HasRoomService { get; set; }
        public bool HasSwimmingPool { get; set; }
        public bool HasFitnessCenter { get; set; }
    }
}