import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import bookingService from '../services/bookingService';
import hotelService from '../services/hotelService';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, hotelsRes] = await Promise.all([
        bookingService.getAll(),
        hotelService.getAll(),
      ]);
      setBookings(bookingsRes.data);
      setHotels(hotelsRes.data);
    } catch (err) {
      console.error('Failed to load data');
    } finally {
      setLoading(false);
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
        <h1 style={styles.title}>Admin Dashboard</h1>

        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏨</div>
            <div style={styles.statNumber}>{hotels.length}</div>
            <div style={styles.statLabel}>Total Hotels</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statNumber}>{bookings.length}</div>
            <div style={styles.statLabel}>Total Bookings</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statNumber}>
              {bookings.filter(b => b.status === 1).length}
            </div>
            <div style={styles.statLabel}>Confirmed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💰</div>
            <div style={styles.statNumber}>
              ₹{bookings.filter(b => b.status === 1)
                .reduce((sum, b) => sum + b.totalFare, 0).toLocaleString()}
            </div>
            <div style={styles.statLabel}>Total Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('bookings')}>
            All Bookings ({bookings.length})
          </button>
          <button
            style={activeTab === 'hotels' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('hotels')}>
            All Hotels ({hotels.length})
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : activeTab === 'bookings' ? (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Hotel</th>
                  <th style={styles.th}>Room</th>
                  <th style={styles.th}>Check In</th>
                  <th style={styles.th}>Check Out</th>
                  <th style={styles.th}>Fare</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingId} style={styles.tr}>
                    <td style={styles.td}>#{b.bookingId}</td>
                    <td style={styles.td}>{b.userName}</td>
                    <td style={styles.td}>{b.hotelName}</td>
                    <td style={styles.td}>{b.roomNumber}</td>
                    <td style={styles.td}>{new Date(b.checkInDate).toLocaleDateString()}</td>
                    <td style={styles.td}>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                    <td style={styles.td}>₹{b.totalFare}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color: getStatusColor(b.status) }}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Hotel Name</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Owner</th>
                  <th style={styles.th}>Rating</th>
                  <th style={styles.th}>Rooms</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h.hotelId} style={styles.tr}>
                    <td style={styles.td}>#{h.hotelId}</td>
                    <td style={styles.td}>{h.name}</td>
                    <td style={styles.td}>{h.location}</td>
                    <td style={styles.td}>{h.ownerName}</td>
                    <td style={styles.td}>⭐ {h.averageRating > 0 ? h.averageRating.toFixed(1) : 'New'}</td>
                    <td style={styles.td}>{h.rooms?.length || 0} rooms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  content: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px', marginBottom: '32px',
  },
  statCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  statIcon: { fontSize: '32px', marginBottom: '8px' },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#667eea', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#888', fontWeight: '500' },
  tabs: { display: 'flex', gap: '12px', marginBottom: '24px' },
  tab: {
    padding: '10px 24px', background: 'white',
    border: '2px solid #e8e8e8', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', color: '#888',
  },
  activeTab: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '2px solid transparent', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', color: 'white',
  },
  tableWrapper: {
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'auto',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: {
    padding: '14px 16px', textAlign: 'left',
    fontSize: '13px', fontWeight: '700',
    color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  tr: { borderTop: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#444' },
  badge: { fontWeight: '600', fontSize: '13px' },
};

export default AdminDashboard;