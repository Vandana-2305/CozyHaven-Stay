using CozyHavenStay.Models;

namespace CozyHavenStay.Interfaces
{
    public interface IBookingRepository : IRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetBookingsByUserAsync(int userId);
        Task<IEnumerable<Booking>> GetBookingsByHotelAsync(int hotelId);
        Task<Booking?> GetBookingWithDetailsAsync(int bookingId);
        Task<IEnumerable<Booking>> GetAllBookingsWithDetailsAsync();
    }
}