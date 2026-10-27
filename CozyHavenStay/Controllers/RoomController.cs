using CozyHavenStay.DTOs;
using CozyHavenStay.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CozyHavenStay.Controllers
{
    [ApiController]
    [Route("api/v1/rooms")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetRoomsByHotel(int hotelId)
        {
            var rooms = await _roomService.GetRoomsByHotelAsync(hotelId);
            return Ok(rooms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            if (room == null) return NotFound(new { message = "Room not found." });
            return Ok(room);
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRooms(
            [FromQuery] int hotelId,
            [FromQuery] DateTime checkIn,
            [FromQuery] DateTime checkOut)
        {
            var rooms = await _roomService.GetAvailableRoomsAsync(hotelId, checkIn, checkOut);
            return Ok(rooms);
        }

        [HttpPost]
        [Authorize(Roles = "HotelOwner,Admin")]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDTO dto)
        {
            try
            {
                var room = await _roomService.CreateRoomAsync(dto);
                return CreatedAtAction(nameof(GetRoomById), new { id = room.RoomId }, room);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "HotelOwner,Admin")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomDTO dto)
        {
            try
            {
                var room = await _roomService.UpdateRoomAsync(id, dto);
                if (room == null) return NotFound(new { message = "Room not found." });
                return Ok(room);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "HotelOwner,Admin")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var result = await _roomService.DeleteRoomAsync(id);
            if (!result) return NotFound(new { message = "Room not found." });
            return Ok(new { message = "Room deleted successfully." });
        }
    }
}