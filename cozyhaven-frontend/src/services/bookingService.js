import API from './api';

const bookingService = {
  create: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my-bookings'),
  getById: (id) => API.get(`/bookings/${id}`),
  getHotelBookings: (hotelId) => API.get(`/bookings/hotel/${hotelId}`),
  getAll: () => API.get('/bookings'),
  cancel: (id, data) => API.put(`/bookings/${id}/cancel`, data),
};

export default bookingService;