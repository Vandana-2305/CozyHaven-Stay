using CozyHavenStay.DTOs;

namespace CozyHavenStay.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO dto);
        Task<AuthResponseDTO> LoginAsync(LoginDTO dto);
        Task<UserResponseDTO> GetProfileAsync(int userId);
        Task<UserResponseDTO> UpdateProfileAsync(int userId, UpdateUserDTO dto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDTO dto);
    }
}