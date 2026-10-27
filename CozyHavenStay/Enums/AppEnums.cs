namespace CozyHavenStay.Enums
{
    public enum BedType
    {
        SingleBed,
        DoubleBed,
        KingSize
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }

    public enum PaymentStatus
    {
        Pending,
        Completed,
        Refunded,
        Failed
    }
}