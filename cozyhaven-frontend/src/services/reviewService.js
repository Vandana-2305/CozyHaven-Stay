import API from './api';

const reviewService = {
  create: (data) => API.post('/reviews', data),
  getByHotel: (hotelId) => API.get(`/reviews/hotel/${hotelId}`),
  getMyReviews: () => API.get('/reviews/my-reviews'),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export default reviewService;