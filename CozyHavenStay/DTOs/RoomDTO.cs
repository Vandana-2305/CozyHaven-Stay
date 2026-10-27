using CozyHavenStay.Enums;

namespace CozyHavenStay.DTOs
{
    public class CreateRoomDTO
    {
        public string RoomNumber { get; set; } = string.Empty;
        public double RoomSizeInSqFt { get; set; }
        public BedType BedType { get; set; }
        public int MaxOccupancy { get; set; }
        public decimal BaseFare { get; set; }
        public bool IsAC { get; set; }
        public int HotelId { get; set; }
    }

    public class RoomResponseDTO
    {
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public double RoomSizeInSqFt { get; set; }
        public BedType BedType { get; set; }
        public int MaxOccupancy { get; set; }
        public decimal BaseFare { get; set; }
        public bool IsAC { get; set; }
        public bool IsAvailable { get; set; }
        public int HotelId { get; set; }
    }

    public class UpdateRoomDTO
    {
        public double? RoomSizeInSqFt { get; set; }
        public BedType? BedType { get; set; }
        public int? MaxOccupancy { get; set; }
        public decimal? BaseFare { get; set; }
        public bool? IsAC { get; set; }
        public bool? IsAvailable { get; set; }
    }
}