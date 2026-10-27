import API from './api';

const roomService = {
  getByHotel: (hotelId) => API.get(`/rooms/hotel/${hotelId}`),
  getById: (id) => API.get(`/rooms/${id}`),
  getAvailable: (hotelId, checkIn, checkOut) =>
    API.get(`/rooms/available?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`),
  create: (data) => API.post('/rooms', data),
  update: (id, data) => API.put(`/rooms/${id}`, data),
  delete: (id) => API.delete(`/rooms/${id}`),
};

export default roomService;