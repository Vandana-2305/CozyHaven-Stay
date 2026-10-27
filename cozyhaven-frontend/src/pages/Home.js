import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import hotelService from '../services/hotelService';

const Home = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await hotelService.search(location);
      setHotels(response.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to search hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Perfect Stay</h1>
        <p style={styles.heroSubtitle}>
          Discover amazing hotels at the best prices
        </p>

        {/* Search Box */}
        <form onSubmit={handleSearch} style={styles.searchBox}>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>📍 Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you going?"
              style={styles.searchInput}
              required
            />
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>📅 Check In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>📅 Check Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>🛏️ Rooms</label>
            <select
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              style={styles.searchInput}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <button type="submit" style={styles.searchBtn} disabled={loading}>
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div style={styles.results}>
        {error && <div style={styles.error}>{error}</div>}

        {searched && (
          <h2 style={styles.resultsTitle}>
            {hotels.length > 0
              ? `${hotels.length} hotel(s) found in "${location}"`
              : `No hotels found in "${location}"`}
          </h2>
        )}

        {!searched && (
          <div style={styles.featuredSection}>
            <h2 style={styles.resultsTitle}>Why Choose CozyHaven Stay?</h2>
            <div style={styles.features}>
              {[
                { icon: '🏨', title: 'Top Hotels', desc: 'Handpicked hotels for every budget' },
                { icon: '🔒', title: 'Secure Booking', desc: 'Your data is always protected' },
                { icon: '💰', title: 'Best Prices', desc: 'Guaranteed lowest rates' },
                { icon: '⭐', title: 'Verified Reviews', desc: 'Real reviews from real guests' },
              ].map((f, i) => (
                <div key={i} style={styles.featureCard}>
                  <div style={styles.featureIcon}>{f.icon}</div>
                  <h3 style={styles.featureTitle}>{f.title}</h3>
                  <p style={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.hotelGrid}>
          {hotels.map((hotel) => (
            <div key={hotel.hotelId} style={styles.hotelCard}>
              <div style={styles.hotelImagePlaceholder}>
                🏨
              </div>
              <div style={styles.hotelInfo}>
                <h3 style={styles.hotelName}>{hotel.name}</h3>
                <p style={styles.hotelLocation}>📍 {hotel.location}</p>
                <p style={styles.hotelDesc}>
                  {hotel.description || 'A wonderful place to stay!'}
                </p>

                <div style={styles.amenities}>
                  {hotel.hasFreewifi && <span style={styles.amenity}>📶 WiFi</span>}
                  {hotel.hasParking && <span style={styles.amenity}>🚗 Parking</span>}
                  {hotel.hasDining && <span style={styles.amenity}>🍽️ Dining</span>}
                  {hotel.hasSwimmingPool && <span style={styles.amenity}>🏊 Pool</span>}
                  {hotel.hasFitnessCenter && <span style={styles.amenity}>💪 Gym</span>}
                  {hotel.hasRoomService && <span style={styles.amenity}>🛎️ Room Service</span>}
                </div>

                <div style={styles.hotelFooter}>
                  <div style={styles.rating}>
                    ⭐ {hotel.averageRating > 0 ? hotel.averageRating.toFixed(1) : 'New'}
                  </div>
                  <button
                    onClick={() => navigate(`/hotels/${hotel.hotelId}`, {
                      state: { checkIn, checkOut, rooms }
                    })}
                    style={styles.viewBtn}
                  >
                    View Rooms →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '60px 40px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 12px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '40px',
  },
  searchBox: {
    display: 'flex',
    gap: '12px',
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  },
  searchField: { flex: 1, minWidth: '150px' },
  searchLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '6px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  searchBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  results: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' },
  resultsTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  error: {
    background: '#ffe0e0',
    color: '#c0392b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  featuredSection: { marginTop: '20px' },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  featureCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '28px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  featureIcon: { fontSize: '40px', marginBottom: '12px' },
  featureTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  featureDesc: { color: '#888', fontSize: '14px', margin: 0 },
  hotelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  hotelCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  hotelImagePlaceholder: {
    height: '180px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
  },
  hotelInfo: { padding: '20px' },
  hotelName: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 6px' },
  hotelLocation: { color: '#888', fontSize: '14px', margin: '0 0 10px' },
  hotelDesc: { color: '#666', fontSize: '14px', margin: '0 0 14px', lineHeight: '1.5' },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  amenity: {
    background: '#f0f0ff',
    color: '#667eea',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  hotelFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rating: { fontSize: '16px', fontWeight: '600', color: '#f39c12' },
  viewBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
};

export default Home;