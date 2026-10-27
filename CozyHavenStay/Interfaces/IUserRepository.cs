using CozyHavenStay.Data;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;
using CozyHavenStay.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CozyHavenStay.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
    }
}