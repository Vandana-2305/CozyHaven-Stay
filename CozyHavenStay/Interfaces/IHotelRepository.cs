using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using CozyHavenStay.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Interfaces
{
    public interface IHotelRepository : IRepository<Hotel>
    {
        Task<IEnumerable<Hotel>> SearchHotelsAsync(string location);
        Task<IEnumerable<Hotel>> GetHotelsByOwnerAsync(int ownerId);
        Task<Hotel?> GetHotelWithDetailsAsync(int hotelId);
        Task UpdateAverageRatingAsync(int hotelId);
    }
}