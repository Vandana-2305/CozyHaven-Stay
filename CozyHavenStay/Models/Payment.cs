using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CozyHavenStay.Enums;

namespace CozyHavenStay.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        [MaxLength(50)]
        public string? PaymentMethod { get; set; }  

        public string? TransactionId { get; set; }

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;

        public int BookingId { get; set; }

        [ForeignKey("BookingId")]
        public Booking Booking { get; set; } = null!;
    }
}