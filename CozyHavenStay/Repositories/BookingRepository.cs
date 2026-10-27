using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Repositories
{
    public class BookingRepository : Repository<Booking>, IBookingRepository
    {
        public BookingRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Booking>> GetBookingsByUserAsync(int userId)
        {
            return await _context.Bookings
                .Include(b => b.Room)
                    .ThenInclude(r => r.Hotel)
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookedAt)
                .ToListAsync();
        }
        

        public async Task<IEnumerable<Booking>> GetBookingsByHotelAsync(int hotelId)
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Include(b => b.Payment)
                .Where(b => b.Room.HotelId == hotelId)
                .OrderByDescending(b => b.BookedAt)
                .ToListAsync();
        }

        public async Task<Booking?> GetBookingWithDetailsAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.Room)
                    .ThenInclude(r => r.Hotel)
                .Include(b => b.User)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }
        public async Task<IEnumerable<Booking>> GetAllBookingsWithDetailsAsync()
        {
            return await _context.Bookings
            .Include(b => b.Room)
            .ThenInclude(r => r.Hotel)
            .Include(b => b.User).Include(b => b.Payment)
            .OrderByDescending(b => b.BookedAt)
            .ToListAsync();
        }
        
    }
}