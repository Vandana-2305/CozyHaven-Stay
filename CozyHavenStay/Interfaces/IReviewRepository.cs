using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using CozyHavenStay.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Interfaces
{
    public interface IReviewRepository : IRepository<Review>
    {
        Task<IEnumerable<Review>> GetReviewsByHotelAsync(int hotelId);
        Task<IEnumerable<Review>> GetReviewsByUserAsync(int userId);
        Task<double> GetAverageRatingAsync(int hotelId);
    }
}