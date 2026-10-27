using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CozyHavenStay.Models
{
    public class HotelImage
    {
        [Key]
        public int ImageId { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsPrimary { get; set; } = false;

        public int HotelId { get; set; }

        [ForeignKey("HotelId")]
        public Hotel Hotel { get; set; } = null!;
    }
}