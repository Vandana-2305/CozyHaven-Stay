import API from './api';

const hotelService = {
  getAll: () => API.get('/hotels'),
  getById: (id) => API.get(`/hotels/${id}`),
  search: (location) => API.get(`/hotels/search?location=${location}`),
  getMyHotels: () => API.get('/hotels/my-hotels'),
  create: (data) => API.post('/hotels', data),
  update: (id, data) => API.put(`/hotels/${id}`, data),
  delete: (id) => API.delete(`/hotels/${id}`),
};

export default hotelService;