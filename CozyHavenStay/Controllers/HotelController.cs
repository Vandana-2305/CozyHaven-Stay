using CozyHavenStay.DTOs;
using CozyHavenStay.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CozyHavenStay.Controllers
{
    [ApiController]
    [Route("api/v1/hotels")]
    public class HotelController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HotelController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHotels()
        {
            var hotels = await _hotelService.GetAllHotelsAsync();
            return Ok(hotels);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotelById(int id)
        {
            var hotel = await _hotelService.GetHotelByIdAsync(id);
            if (hotel == null) return NotFound(new { message = "Hotel not found." });
            return Ok(hotel);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchHotels([FromQuery] string location)
        {
            var hotels = await _hotelService.SearchHotelsAsync(location);
            return Ok(hotels);
        }

        [HttpGet("my-hotels")]
        [Authorize(Roles = "HotelOwner")]
        public async Task<IActionResult> GetMyHotels()
        {
            var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var hotels = await _hotelService.GetHotelsByOwnerAsync(ownerId);
            return Ok(hotels);
        }

        [HttpPost]
        [Authorize(Roles = "HotelOwner,Admin")]
        public async Task<IActionResult> CreateHotel([FromBody] CreateHotelDTO dto)
        {
            try
            {
                var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var hotel = await _hotelService.CreateHotelAsync(ownerId, dto);
                return CreatedAtAction(nameof(GetHotelById), new { id = hotel.HotelId }, hotel);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "HotelOwner,Admin")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] UpdateHotelDTO dto)
        {
            try
            {
                var hotel = await _hotelService.UpdateHotelAsync(id, dto);
                if (hotel == null) return NotFound(new { message = "Hotel not found." });
                return Ok(hotel);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var result = await _hotelService.DeleteHotelAsync(id);
            if (!result) return NotFound(new { message = "Hotel not found." });
            return Ok(new { message = "Hotel deleted successfully." });
        }
    }
}