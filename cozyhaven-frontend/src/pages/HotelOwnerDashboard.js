import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import hotelService from '../services/hotelService';
import roomService from '../services/roomService';
import bookingService from '../services/bookingService';

const HotelOwnerDashboard = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    roomNumber: '', roomSizeInSqFt: 753, bedType: 0,
    maxOccupancy: 2, baseFare: '', isAC: true, hotelId: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await hotelService.getMyHotels();
      setHotels(response.data);
      if (response.data.length > 0) {
        setSelectedHotel(response.data[0]);
        setRoomForm(prev => ({ ...prev, hotelId: response.data[0].hotelId }));
        fetchBookings(response.data[0].hotelId);
      }
    } catch (err) {
      console.error('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (hotelId) => {
    try {
      const response = await bookingService.getHotelBookings(hotelId);
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings');
    }
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setRoomForm(prev => ({ ...prev, hotelId: hotel.hotelId }));
    fetchBookings(hotel.hotelId);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.create({
        ...roomForm,
        roomSizeInSqFt: parseFloat(roomForm.roomSizeInSqFt),
        bedType: parseInt(roomForm.bedType),
        maxOccupancy: parseInt(roomForm.maxOccupancy),
        baseFare: parseFloat(roomForm.baseFare),
        hotelId: parseInt(roomForm.hotelId),
      });
      alert('Room added successfully!');
      setShowAddRoom(false);
      fetchHotels();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add room.');
    }
  };

  const getStatusLabel = (status) => {
    const labels = { 0: 'Pending', 1: 'Confirmed', 2: 'Cancelled', 3: 'Completed' };
    return labels[status] || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colors = { 0: '#856404', 1: '#155724', 2: '#721c24', 3: '#0c5460' };
    return colors[status] || '#333';
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>Hotel Owner Dashboard</h1>
        <p style={styles.subtitle}>Welcome back, {user?.name}! 🏨</p>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : hotels.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🏨</div>
            <h3>No hotels yet!</h3>
            <p>Contact admin to add your hotel listing.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            <div style={styles.sidebar}>
              <h2 style={styles.sectionTitle}>My Hotels</h2>
              {hotels.map((hotel) => (
                <div
                  key={hotel.hotelId}
                  style={selectedHotel?.hotelId === hotel.hotelId
                    ? styles.hotelCardActive : styles.hotelCard}
                  onClick={() => handleSelectHotel(hotel)}
                >
                  <h3 style={styles.hotelName}>{hotel.name}</h3>
                  <p style={styles.hotelLocation}>📍 {hotel.location}</p>
                  <p style={styles.hotelRooms}>
                    {hotel.rooms?.length || 0} rooms · ⭐ {hotel.averageRating > 0 ? hotel.averageRating.toFixed(1) : 'New'}
                  </p>
                </div>
              ))}
            </div>

            {selectedHotel && (
              <div style={styles.details}>
                <h2 style={styles.sectionTitle}>{selectedHotel.name}</h2>

                <div style={styles.tabs}>
                  <button
                    style={activeTab === 'rooms' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('rooms')}>
                    🛏️ Rooms ({selectedHotel.rooms?.length || 0})
                  </button>
                  <button
                    style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('bookings')}>
                    📅 Bookings ({bookings.length})
                  </button>
                </div>

                {activeTab === 'rooms' && (
                  <div>
                    <button
                      onClick={() => setShowAddRoom(!showAddRoom)}
                      style={styles.addBtn}>
                      {showAddRoom ? '✕ Cancel' : '+ Add New Room'}
                    </button>

                    {showAddRoom && (
                      <form onSubmit={handleAddRoom} style={styles.roomForm}>
                        <h3 style={styles.formTitle}>Add New Room</h3>
                        <div style={styles.formRow}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Room Number</label>
                            <input
                              value={roomForm.roomNumber}
                              onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                              placeholder="e.g. 101"
                              style={styles.input} required
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Base Fare (₹/night)</label>
                            <input
                              type="number" value={roomForm.baseFare}
                              onChange={(e) => setRoomForm({...roomForm, baseFare: e.target.value})}
                              placeholder="e.g. 3500"
                              style={styles.input} required
                            />
                          </div>
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Bed Type</label>
                            <select
                              value={roomForm.bedType}
                              onChange={(e) => setRoomForm({...roomForm, bedType: e.target.value})}
                              style={styles.input}>
                              <option value={0}>Single Bed (max 2)</option>
                              <option value={1}>Double Bed (max 4)</option>
                              <option value={2}>King Size (max 6)</option>
                            </select>
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Max Occupancy</label>
                            <input
                              type="number" value={roomForm.maxOccupancy}
                              onChange={(e) => setRoomForm({...roomForm, maxOccupancy: e.target.value})}
                              style={styles.input} required
                            />
                          </div>
                        </div>
                        <div style={styles.formRow}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Room Size (sq ft)</label>
                            <input
                              type="number" value={roomForm.roomSizeInSqFt}
                              onChange={(e) => setRoomForm({...roomForm, roomSizeInSqFt: e.target.value})}
                              style={styles.input} required
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>AC</label>
                            <select
                              value={roomForm.isAC}
                              onChange={(e) => setRoomForm({...roomForm, isAC: e.target.value === 'true'})}
                              style={styles.input}>
                              <option value={true}>AC</option>
                              <option value={false}>Non-AC</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" style={styles.saveBtn}>✓ Add Room</button>
                      </form>
                    )}

                    <div style={styles.roomList}>
                      {selectedHotel.rooms?.length === 0 ? (
                        <p style={styles.noData}>No rooms yet. Add your first room!</p>
                      ) : (
                        selectedHotel.rooms?.map((room) => (
                          <div key={room.roomId} style={styles.roomCard}>
                            <div>
                              <span style={styles.roomNumber}>Room {room.roomNumber}</span>
                              <span style={styles.roomType}>
                                {room.bedType === 0 ? '🛏️ Single' : room.bedType === 1 ? '🛏️🛏️ Double' : '👑 King'}
                              </span>
                            </div>
                            <div style={styles.roomMeta}>
                              <span>👥 Max {room.maxOccupancy}</span>
                              <span>{room.isAC ? '❄️ AC' : '🌀 Non-AC'}</span>
                              <span style={styles.roomFare}>₹{room.baseFare}/night</span>
                              <span style={room.isAvailable ? styles.available : styles.unavailable}>
                                {room.isAvailable ? '✅ Available' : '❌ Booked'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'bookings' && (
                  <div>
                    {bookings.length === 0 ? (
                      <p style={styles.noData}>No bookings yet for this hotel.</p>
                    ) : (
                      bookings.map((b) => (
                        <div key={b.bookingId} style={styles.bookingCard}>
                          <div style={styles.bookingTop}>
                            <div>
                              <span style={styles.guestName}>👤 {b.userName}</span>
                              <span style={styles.roomLabel}> · Room {b.roomNumber}</span>
                            </div>
                            <span style={{
                              ...styles.statusBadge,
                              color: getStatusColor(b.status)
                            }}>
                              {getStatusLabel(b.status)}
                            </span>
                          </div>
                          <div style={styles.bookingInfo}>
                            <span>📅 {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}</span>
                            <span>👥 {b.numberOfAdults} adults, {b.numberOfChildren} children</span>
                            <span style={styles.fare}>₹{b.totalFare}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  subtitle: { color: '#888', marginBottom: '32px', fontSize: '16px' },
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  empty: {
    textAlign: 'center', padding: '60px',
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  emptyIcon: { fontSize: '60px', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' },
  sidebar: {},
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  hotelCard: {
    background: 'white', borderRadius: '12px', padding: '16px',
    marginBottom: '12px', cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    border: '2px solid transparent',
  },
  hotelCardActive: {
    background: 'white', borderRadius: '12px', padding: '16px',
    marginBottom: '12px', cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    border: '2px solid #667eea',
  },
  hotelName: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  hotelLocation: { color: '#888', fontSize: '13px', margin: '0 0 4px' },
  hotelRooms: { color: '#667eea', fontSize: '13px', fontWeight: '600', margin: 0 },
  details: {
    background: 'white', borderRadius: '16px',
    padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  tabs: { display: 'flex', gap: '12px', marginBottom: '20px' },
  tab: {
    padding: '8px 20px', background: '#f8f9fa',
    border: '2px solid #e8e8e8', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', color: '#888', fontSize: '14px',
  },
  activeTab: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '2px solid transparent', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', color: 'white', fontSize: '14px',
  },
  addBtn: {
    padding: '10px 20px', background: '#27ae60',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', marginBottom: '16px', fontSize: '14px',
  },
  roomForm: {
    background: '#f8f9fa', borderRadius: '12px',
    padding: '20px', marginBottom: '20px',
    border: '1px solid #e8e8e8',
  },
  formTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { marginBottom: '12px' },
  label: { display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#444' },
  input: {
    width: '100%', padding: '8px 12px',
    border: '2px solid #e8e8e8', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none',
  },
  saveBtn: {
    padding: '10px 24px', background: '#667eea',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  roomList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  roomCard: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px', background: '#f8f9fa',
    borderRadius: '10px', fontSize: '14px',
  },
  roomNumber: { fontWeight: '700', color: '#1a1a2e', marginRight: '12px' },
  roomType: { color: '#666' },
  roomMeta: { display: 'flex', gap: '16px', alignItems: 'center' },
  roomFare: { color: '#667eea', fontWeight: '700' },
  available: { color: '#27ae60', fontWeight: '600' },
  unavailable: { color: '#e74c3c', fontWeight: '600' },
  noData: { color: '#888', textAlign: 'center', padding: '40px', fontStyle: 'italic' },
  bookingCard: {
    border: '1px solid #e8e8e8', borderRadius: '10px',
    padding: '16px', marginBottom: '12px',
    background: '#fafafa',
  },
  bookingTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '10px',
  },
  guestName: { fontWeight: '700', color: '#1a1a2e', fontSize: '15px' },
  roomLabel: { color: '#888', fontSize: '14px' },
  statusBadge: { fontWeight: '600', fontSize: '13px' },
  bookingInfo: { display: 'flex', gap: '24px', fontSize: '13px', color: '#666' },
  fare: { color: '#667eea', fontWeight: '700', fontSize: '15px' },
};

export default HotelOwnerDashboard;
