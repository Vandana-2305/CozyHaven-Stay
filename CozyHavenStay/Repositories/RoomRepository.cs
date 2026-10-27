using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Repositories
{
    public class RoomRepository : Repository<Room>, IRoomRepository
    {
        public RoomRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Room>> GetRoomsByHotelAsync(int hotelId)
        {
            return await _context.Rooms
                .Where(r => r.HotelId == hotelId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetAvailableRoomsAsync(int hotelId, DateTime checkIn, DateTime checkOut)
        {
            // Get all rooms in the hotel
            // Exclude rooms that have a confirmed booking overlapping the requested dates
            return await _context.Rooms
                .Where(r => r.HotelId == hotelId && r.IsAvailable &&
                    !r.Bookings.Any(b =>
                        b.Status != CozyHavenStay.Enums.BookingStatus.Cancelled &&
                        b.CheckInDate < checkOut &&
                        b.CheckOutDate > checkIn))
                .ToListAsync();
        }

        public async Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut)
        {
            return !await _context.Bookings
                .AnyAsync(b =>
                    b.RoomId == roomId &&
                    b.Status != CozyHavenStay.Enums.BookingStatus.Cancelled &&
                    b.CheckInDate < checkOut &&
                    b.CheckOutDate > checkIn);
        }
    }
}