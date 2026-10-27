using CozyHavenStay.DTOs;

namespace CozyHavenStay.Interfaces
{
    public interface IRoomService
    {
        Task<IEnumerable<RoomResponseDTO>> GetRoomsByHotelAsync(int hotelId);
        Task<RoomResponseDTO?> GetRoomByIdAsync(int roomId);
        Task<IEnumerable<RoomResponseDTO>> GetAvailableRoomsAsync(int hotelId, DateTime checkIn, DateTime checkOut);
        Task<RoomResponseDTO> CreateRoomAsync(CreateRoomDTO dto);
        Task<RoomResponseDTO?> UpdateRoomAsync(int roomId, UpdateRoomDTO dto);
        Task<bool> DeleteRoomAsync(int roomId);
    }
}