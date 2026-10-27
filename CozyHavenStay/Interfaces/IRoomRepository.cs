using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using CozyHavenStay.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Interfaces
{
    public interface IRoomRepository : IRepository<Room>
    {
        Task<IEnumerable<Room>> GetRoomsByHotelAsync(int hotelId);
        Task<IEnumerable<Room>> GetAvailableRoomsAsync(int hotelId, DateTime checkIn, DateTime checkOut);
        Task<bool> IsRoomAvailableAsync(int roomId, DateTime checkIn, DateTime checkOut);
    }
}