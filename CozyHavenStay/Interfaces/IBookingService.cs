using CozyHavenStay.DTOs;

namespace CozyHavenStay.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDTO> CreateBookingAsync(int userId, CreateBookingDTO dto);
        Task<IEnumerable<BookingResponseDTO>> GetUserBookingsAsync(int userId);
        Task<IEnumerable<BookingResponseDTO>> GetHotelBookingsAsync(int hotelId);
        Task<BookingResponseDTO?> GetBookingByIdAsync(int bookingId);
        Task<BookingResponseDTO?> CancelBookingAsync(int bookingId, CancelBookingDTO dto);
        Task<IEnumerable<BookingResponseDTO>> GetAllBookingsAsync();
    }
}