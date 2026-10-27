namespace CozyHavenStay.DTOs
{
    public class CreateReviewDTO
    {
        public int HotelId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class ReviewResponseDTO
    {
        public int ReviewId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int HotelId { get; set; }
        public string HotelName { get; set; } = string.Empty;
    }
}