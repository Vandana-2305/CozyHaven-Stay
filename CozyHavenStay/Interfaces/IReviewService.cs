using CozyHavenStay.DTOs;

namespace CozyHavenStay.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewResponseDTO> CreateReviewAsync(int userId, CreateReviewDTO dto);
        Task<IEnumerable<ReviewResponseDTO>> GetHotelReviewsAsync(int hotelId);
        Task<IEnumerable<ReviewResponseDTO>> GetUserReviewsAsync(int userId);
        Task<bool> DeleteReviewAsync(int reviewId);
    }
}