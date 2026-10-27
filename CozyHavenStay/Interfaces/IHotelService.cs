using CozyHavenStay.DTOs;

namespace CozyHavenStay.Interfaces
{
    public interface IHotelService
    {
        Task<IEnumerable<HotelResponseDTO>> GetAllHotelsAsync();
        Task<HotelResponseDTO?> GetHotelByIdAsync(int hotelId);
        Task<IEnumerable<HotelResponseDTO>> SearchHotelsAsync(string location);
        Task<IEnumerable<HotelResponseDTO>> GetHotelsByOwnerAsync(int ownerId);
        Task<HotelResponseDTO> CreateHotelAsync(int ownerId, CreateHotelDTO dto);
        Task<HotelResponseDTO?> UpdateHotelAsync(int hotelId, UpdateHotelDTO dto);
        Task<bool> DeleteHotelAsync(int hotelId);
    }
}