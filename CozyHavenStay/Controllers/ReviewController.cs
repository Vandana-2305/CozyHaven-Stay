using CozyHavenStay.DTOs;
using CozyHavenStay.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CozyHavenStay.Controllers
{
    [ApiController]
    [Route("api/v1/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var review = await _reviewService.CreateReviewAsync(userId, dto);
                return CreatedAtAction(nameof(GetHotelReviews), new { hotelId = review.HotelId }, review);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetHotelReviews(int hotelId)
        {
            var reviews = await _reviewService.GetHotelReviewsAsync(hotelId);
            return Ok(reviews);
        }

        [HttpGet("my-reviews")]
        [Authorize]
        public async Task<IActionResult> GetMyReviews()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var reviews = await _reviewService.GetUserReviewsAsync(userId);
            return Ok(reviews);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var result = await _reviewService.DeleteReviewAsync(id);
            if (!result) return NotFound(new { message = "Review not found." });
            return Ok(new { message = "Review deleted successfully." });
        }
    }
}