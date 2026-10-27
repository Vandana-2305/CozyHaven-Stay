using CozyHavenStay.DTOs;
using CozyHavenStay.Helpers;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;

namespace CozyHavenStay.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IUserRepository userRepository, JwtHelper jwtHelper)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO dto)
        {
            if (await _userRepository.EmailExistsAsync(dto.Email))
                throw new Exception("Email already registered.");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                Gender = dto.Gender,
                Role = dto.Role
            };

            await _userRepository.AddAsync(user);

            var token = _jwtHelper.GenerateToken(user);

            return new AuthResponseDTO
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                UserId = user.UserId
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginDTO dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email)
                ?? throw new Exception("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid email or password.");

            var token = _jwtHelper.GenerateToken(user);

            return new AuthResponseDTO
            {
                Token = token,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                UserId = user.UserId
            };
        }

        public async Task<UserResponseDTO> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new Exception("User not found.");

            return MapToUserResponseDTO(user);
        }

        public async Task<UserResponseDTO> UpdateProfileAsync(int userId, UpdateUserDTO dto)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new Exception("User not found.");

            if (dto.Name != null) user.Name = dto.Name;
            if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber;
            if (dto.Address != null) user.Address = dto.Address;
            if (dto.Gender != null) user.Gender = dto.Gender;

            await _userRepository.UpdateAsync(user);
            return MapToUserResponseDTO(user);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDTO dto)
        {
            var user = await _userRepository.GetByIdAsync(userId)
                ?? throw new Exception("User not found.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                throw new Exception("Current password is incorrect.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _userRepository.UpdateAsync(user);
            return true;
        }

        private static UserResponseDTO MapToUserResponseDTO(User user)
        {
            return new UserResponseDTO
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Gender = user.Gender,
                ProfilePicture = user.ProfilePicture,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
    }
}