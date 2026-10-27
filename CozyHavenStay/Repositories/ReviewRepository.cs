using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Repositories
{
    public class ReviewRepository : Repository<Review>, IReviewRepository
    {
        public ReviewRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Review>> GetReviewsByHotelAsync(int hotelId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.HotelId == hotelId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Review>> GetReviewsByUserAsync(int userId)
        {
            return await _context.Reviews
                .Include(r => r.Hotel)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<double> GetAverageRatingAsync(int hotelId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.HotelId == hotelId)
                .ToListAsync();

            return reviews.Any() ? reviews.Average(r => r.Rating) : 0.0;
        }
    }
}