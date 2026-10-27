using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Repositories
{
    public class HotelRepository : Repository<Hotel>, IHotelRepository
    {
        public HotelRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Hotel>> SearchHotelsAsync(string location)
        {
            return await _context.Hotels
                .Include(h => h.Images)
                .Include(h => h.Rooms)
                .Where(h => h.IsActive &&
                       h.Location.ToLower().Contains(location.ToLower()))
                .ToListAsync();
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByOwnerAsync(int ownerId)
        {
            return await _context.Hotels
                .Include(h => h.Rooms)
                .Include(h => h.Images)
                .Where(h => h.OwnerId == ownerId)
                .ToListAsync();
        }

        public async Task<Hotel?> GetHotelWithDetailsAsync(int hotelId)
        {
            return await _context.Hotels
                .Include(h => h.Rooms)
                .Include(h => h.Images)
                .Include(h => h.Reviews)
                    .ThenInclude(r => r.User)
                .Include(h => h.Owner)
                .FirstOrDefaultAsync(h => h.HotelId == hotelId);
        }

        public async Task UpdateAverageRatingAsync(int hotelId)
        {
            var hotel = await _context.Hotels
                .Include(h => h.Reviews)
                .FirstOrDefaultAsync(h => h.HotelId == hotelId);

            if (hotel != null && hotel.Reviews.Any())
            {
                hotel.AverageRating = hotel.Reviews.Average(r => r.Rating);
                await _context.SaveChangesAsync();
            }
        }
    }
}