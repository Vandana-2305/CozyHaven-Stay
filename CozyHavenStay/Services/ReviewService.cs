using CozyHavenStay.DTOs;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;

namespace CozyHavenStay.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IHotelRepository _hotelRepository;

        public ReviewService(IReviewRepository reviewRepository, IHotelRepository hotelRepository)
        {
            _reviewRepository = reviewRepository;
            _hotelRepository = hotelRepository;
        }

        public async Task<ReviewResponseDTO> CreateReviewAsync(int userId, CreateReviewDTO dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new Exception("Rating must be between 1 and 5.");

            var review = new Review
            {
                UserId = userId,
                HotelId = dto.HotelId,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            await _reviewRepository.AddAsync(review);

            // Recalculate hotel average rating
            await _hotelRepository.UpdateAverageRatingAsync(dto.HotelId);

            // Fetch with User included so userName is not N/A
            var allReviews = await _reviewRepository.GetReviewsByHotelAsync(dto.HotelId);
            var saved = allReviews.FirstOrDefault(r => r.ReviewId == review.ReviewId);
            return MapToReviewResponseDTO(saved!);
        }

        public async Task<IEnumerable<ReviewResponseDTO>> GetHotelReviewsAsync(int hotelId)
        {
            var reviews = await _reviewRepository.GetReviewsByHotelAsync(hotelId);
            return reviews.Select(MapToReviewResponseDTO);
        }

        public async Task<IEnumerable<ReviewResponseDTO>> GetUserReviewsAsync(int userId)
        {
            var reviews = await _reviewRepository.GetReviewsByUserAsync(userId);
            return reviews.Select(MapToReviewResponseDTO);
        }

        public async Task<bool> DeleteReviewAsync(int reviewId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null) return false;

            int hotelId = review.HotelId;
            await _reviewRepository.DeleteAsync(reviewId);

            // Recalculate average after deletion
            await _hotelRepository.UpdateAverageRatingAsync(hotelId);
            return true;
        }

        private static ReviewResponseDTO MapToReviewResponseDTO(Review review)
        {
            return new ReviewResponseDTO
            {
                ReviewId = review.ReviewId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                UserName = review.User?.Name ?? "N/A",
                HotelId = review.HotelId,
                HotelName = review.Hotel?.Name ?? "N/A"
            };
        }
    }
}