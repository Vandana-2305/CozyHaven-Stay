using CozyHavenStay.DTOs;
using CozyHavenStay.Enums;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;

namespace CozyHavenStay.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IRoomRepository _roomRepository;

        public BookingService(IBookingRepository bookingRepository, IRoomRepository roomRepository)
        {
            _bookingRepository = bookingRepository;
            _roomRepository = roomRepository;
        }

        public async Task<BookingResponseDTO> CreateBookingAsync(int userId, CreateBookingDTO dto)
        {
            if (dto.CheckInDate >= dto.CheckOutDate)
                throw new Exception("Check-out date must be after check-in date.");

            if (dto.CheckInDate < DateTime.Today)
                throw new Exception("Check-in date cannot be in the past.");

            var isAvailable = await _roomRepository.IsRoomAvailableAsync(
                dto.RoomId, dto.CheckInDate, dto.CheckOutDate);

            if (!isAvailable)
                throw new Exception("Room is not available for the selected dates.");

            var room = await _roomRepository.GetByIdAsync(dto.RoomId)
                ?? throw new Exception("Room not found.");

            int totalGuests = dto.NumberOfAdults + dto.NumberOfChildren;
            if (totalGuests > room.MaxOccupancy * dto.NumberOfRooms)
                throw new Exception($"Total guests exceed maximum occupancy of {room.MaxOccupancy} per room.");

            int nights = (dto.CheckOutDate - dto.CheckInDate).Days;
            decimal totalFare = CalculateFare(room, dto.NumberOfAdults, dto.NumberOfChildren, nights, dto.NumberOfRooms);

            var booking = new Booking
            {
                UserId = userId,
                RoomId = dto.RoomId,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                NumberOfAdults = dto.NumberOfAdults,
                NumberOfChildren = dto.NumberOfChildren,
                NumberOfRooms = dto.NumberOfRooms,
                TotalFare = totalFare,
                Status = BookingStatus.Confirmed
            };

            await _bookingRepository.AddAsync(booking);

            var savedBooking = await _bookingRepository.GetBookingWithDetailsAsync(booking.BookingId);
            return MapToBookingResponseDTO(savedBooking!);
        }

        public async Task<IEnumerable<BookingResponseDTO>> GetUserBookingsAsync(int userId)
        {
            var bookings = await _bookingRepository.GetBookingsByUserAsync(userId);
            return bookings.Select(MapToBookingResponseDTO);
        }

        public async Task<IEnumerable<BookingResponseDTO>> GetHotelBookingsAsync(int hotelId)
        {
            var bookings = await _bookingRepository.GetBookingsByHotelAsync(hotelId);
            return bookings.Select(MapToBookingResponseDTO);
        }

        public async Task<BookingResponseDTO?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetBookingWithDetailsAsync(bookingId);
            return booking == null ? null : MapToBookingResponseDTO(booking);
        }

        public async Task<BookingResponseDTO?> CancelBookingAsync(int bookingId, CancelBookingDTO dto)
        {
            var booking = await _bookingRepository.GetBookingWithDetailsAsync(bookingId)
                ?? throw new Exception("Booking not found.");

            if (booking.Status == BookingStatus.Cancelled)
                throw new Exception("Booking is already cancelled.");

            booking.Status = BookingStatus.Cancelled;
            booking.CancellationReason = dto.CancellationReason;

            await _bookingRepository.UpdateAsync(booking);
            return MapToBookingResponseDTO(booking);
        }

        // ← UPDATED: uses GetAllBookingsWithDetailsAsync
        public async Task<IEnumerable<BookingResponseDTO>> GetAllBookingsAsync()
        {
            var bookings = await _bookingRepository.GetAllBookingsWithDetailsAsync();
            return bookings.Select(MapToBookingResponseDTO);
        }

        private static decimal CalculateFare(Room room, int adults, int children, int nights, int numberOfRooms)
        {
            decimal baseFare = room.BaseFare;
            decimal totalFare = 0;

            int baseOccupancy = room.BedType switch
            {
                BedType.SingleBed => 1,
                BedType.DoubleBed => 2,
                BedType.KingSize  => 4,
                _ => 1
            };

            totalFare += baseFare;

            int totalGuests = adults + children;
            int extraGuests = totalGuests - baseOccupancy;

            if (extraGuests > 0)
            {
                int extraAdults = Math.Max(0, adults - baseOccupancy);
                int extraChildren = children;

                if (adults <= baseOccupancy)
                {
                    extraAdults = 0;
                    extraChildren = Math.Max(0, totalGuests - baseOccupancy);
                }

                totalFare += extraAdults * (baseFare * 0.40m);
                totalFare += extraChildren * (baseFare * 0.20m);
            }

            return totalFare * numberOfRooms * nights;
        }

        private static BookingResponseDTO MapToBookingResponseDTO(Booking booking)
        {
            return new BookingResponseDTO
            {
                BookingId = booking.BookingId,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                NumberOfAdults = booking.NumberOfAdults,
                NumberOfChildren = booking.NumberOfChildren,
                NumberOfRooms = booking.NumberOfRooms,
                TotalFare = booking.TotalFare,
                Status = booking.Status,
                BookedAt = booking.BookedAt,
                CancellationReason = booking.CancellationReason,
                UserId = booking.UserId,
                UserName = booking.User?.Name ?? "N/A",
                RoomId = booking.RoomId,
                RoomNumber = booking.Room?.RoomNumber ?? "N/A",
                HotelName = booking.Room?.Hotel?.Name ?? "N/A",
                HotelLocation = booking.Room?.Hotel?.Location ?? "N/A"
            };
        }
    }
}