using CozyHavenStay.DTOs;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;

namespace CozyHavenStay.Services
{
    public class HotelService : IHotelService
    {
        private readonly IHotelRepository _hotelRepository;

        public HotelService(IHotelRepository hotelRepository)
        {
            _hotelRepository = hotelRepository;
        }

        public async Task<IEnumerable<HotelResponseDTO>> GetAllHotelsAsync()
        {
            var hotels = await _hotelRepository.GetAllAsync();
            return hotels.Select(MapToHotelResponseDTO);
        }

        public async Task<HotelResponseDTO?> GetHotelByIdAsync(int hotelId)
        {
            var hotel = await _hotelRepository.GetHotelWithDetailsAsync(hotelId);
            return hotel == null ? null : MapToHotelResponseDTO(hotel);
        }

        public async Task<IEnumerable<HotelResponseDTO>> SearchHotelsAsync(string location)
        {
            var hotels = await _hotelRepository.SearchHotelsAsync(location);
            return hotels.Select(MapToHotelResponseDTO);
        }

        public async Task<IEnumerable<HotelResponseDTO>> GetHotelsByOwnerAsync(int ownerId)
        {
            var hotels = await _hotelRepository.GetHotelsByOwnerAsync(ownerId);
            return hotels.Select(MapToHotelResponseDTO);
        }

        public async Task<HotelResponseDTO> CreateHotelAsync(int ownerId, CreateHotelDTO dto)
        {
            var hotel = new Hotel
            {
                Name = dto.Name,
                Location = dto.Location,
                Description = dto.Description,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                HasDining = dto.HasDining,
                HasParking = dto.HasParking,
                HasFreeWifi = dto.HasFreeWifi,
                HasRoomService = dto.HasRoomService,
                HasSwimmingPool = dto.HasSwimmingPool,
                HasFitnessCenter = dto.HasFitnessCenter,
                OwnerId = ownerId
            };

            await _hotelRepository.AddAsync(hotel);
            return MapToHotelResponseDTO(hotel);
        }

        public async Task<HotelResponseDTO?> UpdateHotelAsync(int hotelId, UpdateHotelDTO dto)
        {
            var hotel = await _hotelRepository.GetByIdAsync(hotelId);
            if (hotel == null) return null;

            if (dto.Name != null) hotel.Name = dto.Name;
            if (dto.Location != null) hotel.Location = dto.Location;
            if (dto.Description != null) hotel.Description = dto.Description;
            if (dto.PhoneNumber != null) hotel.PhoneNumber = dto.PhoneNumber;
            if (dto.Email != null) hotel.Email = dto.Email;
            hotel.HasDining = dto.HasDining;
            hotel.HasParking = dto.HasParking;
            hotel.HasFreeWifi = dto.HasFreeWifi;
            hotel.HasRoomService = dto.HasRoomService;
            hotel.HasSwimmingPool = dto.HasSwimmingPool;
            hotel.HasFitnessCenter = dto.HasFitnessCenter;

            await _hotelRepository.UpdateAsync(hotel);
            return MapToHotelResponseDTO(hotel);
        }

        public async Task<bool> DeleteHotelAsync(int hotelId)
        {
            return await _hotelRepository.DeleteAsync(hotelId);
        }

        private static HotelResponseDTO MapToHotelResponseDTO(Hotel hotel)
        {
            return new HotelResponseDTO
            {
                HotelId = hotel.HotelId,
                Name = hotel.Name,
                Location = hotel.Location,
                Description = hotel.Description,
                PhoneNumber = hotel.PhoneNumber,
                Email = hotel.Email,
                HasDining = hotel.HasDining,
                HasParking = hotel.HasParking,
                HasFreeWifi = hotel.HasFreeWifi,
                HasRoomService = hotel.HasRoomService,
                HasSwimmingPool = hotel.HasSwimmingPool,
                HasFitnessCenter = hotel.HasFitnessCenter,
                AverageRating = hotel.AverageRating,
                OwnerName = hotel.Owner?.Name ?? "N/A",
                ImageUrls = hotel.Images?.Select(i => i.ImageUrl).ToList() ?? new(),
                Rooms = hotel.Rooms?.Select(r => new RoomResponseDTO
                {
                    RoomId = r.RoomId,
                    RoomNumber = r.RoomNumber,
                    RoomSizeInSqFt = r.RoomSizeInSqFt,
                    BedType = r.BedType,
                    MaxOccupancy = r.MaxOccupancy,
                    BaseFare = r.BaseFare,
                    IsAC = r.IsAC,
                    IsAvailable = r.IsAvailable,
                    HotelId = r.HotelId
                }).ToList() ?? new()
            };
        }
    }
}