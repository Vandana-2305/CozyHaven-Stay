using CozyHavenStay.DTOs;
using CozyHavenStay.Interfaces;
using CozyHavenStay.Models;

namespace CozyHavenStay.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;

        public RoomService(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<IEnumerable<RoomResponseDTO>> GetRoomsByHotelAsync(int hotelId)
        {
            var rooms = await _roomRepository.GetRoomsByHotelAsync(hotelId);
            return rooms.Select(MapToRoomResponseDTO);
        }

        public async Task<RoomResponseDTO?> GetRoomByIdAsync(int roomId)
        {
            var room = await _roomRepository.GetByIdAsync(roomId);
            return room == null ? null : MapToRoomResponseDTO(room);
        }

        public async Task<IEnumerable<RoomResponseDTO>> GetAvailableRoomsAsync(int hotelId, DateTime checkIn, DateTime checkOut)
        {
            var rooms = await _roomRepository.GetAvailableRoomsAsync(hotelId, checkIn, checkOut);
            return rooms.Select(MapToRoomResponseDTO);
        }

        public async Task<RoomResponseDTO> CreateRoomAsync(CreateRoomDTO dto)
        {
            var room = new Room
            {
                RoomNumber = dto.RoomNumber,
                RoomSizeInSqFt = dto.RoomSizeInSqFt,
                BedType = dto.BedType,
                MaxOccupancy = dto.MaxOccupancy,
                BaseFare = dto.BaseFare,
                IsAC = dto.IsAC,
                HotelId = dto.HotelId
            };

            await _roomRepository.AddAsync(room);
            return MapToRoomResponseDTO(room);
        }

        public async Task<RoomResponseDTO?> UpdateRoomAsync(int roomId, UpdateRoomDTO dto)
        {
            var room = await _roomRepository.GetByIdAsync(roomId);
            if (room == null) return null;

            if (dto.RoomSizeInSqFt.HasValue) room.RoomSizeInSqFt = dto.RoomSizeInSqFt.Value;
            if (dto.BedType.HasValue) room.BedType = dto.BedType.Value;
            if (dto.MaxOccupancy.HasValue) room.MaxOccupancy = dto.MaxOccupancy.Value;
            if (dto.BaseFare.HasValue) room.BaseFare = dto.BaseFare.Value;
            if (dto.IsAC.HasValue) room.IsAC = dto.IsAC.Value;
            if (dto.IsAvailable.HasValue) room.IsAvailable = dto.IsAvailable.Value;

            await _roomRepository.UpdateAsync(room);
            return MapToRoomResponseDTO(room);
        }

        public async Task<bool> DeleteRoomAsync(int roomId)
        {
            return await _roomRepository.DeleteAsync(roomId);
        }

        private static RoomResponseDTO MapToRoomResponseDTO(Room room)
        {
            return new RoomResponseDTO
            {
                RoomId = room.RoomId,
                RoomNumber = room.RoomNumber,
                RoomSizeInSqFt = room.RoomSizeInSqFt,
                BedType = room.BedType,
                MaxOccupancy = room.MaxOccupancy,
                BaseFare = room.BaseFare,
                IsAC = room.IsAC,
                IsAvailable = room.IsAvailable,
                HotelId = room.HotelId
            };
        }
    }
}