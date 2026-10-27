import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import bookingService from '../services/bookingService';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const location = useLocation();
  const bookingSuccess = location.state?.bookingSuccess;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await bookingService.cancel(bookingId, { cancellationReason: 'Cancelled by user' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      0: { background: '#fff3cd', color: '#856404' },   // Pending
      1: { background: '#d4edda', color: '#155724' },   // Confirmed
      2: { background: '#f8d7da', color: '#721c24' },   // Cancelled
      3: { background: '#d1ecf1', color: '#0c5460' },   // Completed
    };
    return styles[status] || styles[0];
  };

  const getStatusLabel = (status) => {
    const labels = { 0: 'Pending', 1: 'Confirmed', 2: 'Cancelled', 3: 'Completed' };
    return labels[status] || 'Unknown';
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>My Bookings</h1>

        {bookingSuccess && (
          <div style={styles.success}>
            🎉 Booking confirmed successfully! Your stay is booked.
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🏨</div>
            <h3>No bookings yet!</h3>
            <p>Start exploring hotels and make your first booking.</p>
          </div>
        ) : (
          <div style={styles.bookingList}>
            {bookings.map((booking) => (
              <div key={booking.bookingId} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <div>
                    <h3 style={styles.hotelName}>{booking.hotelName}</h3>
                    <p style={styles.location}>📍 {booking.hotelLocation}</p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(booking.status)
                  }}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <div style={styles.bookingDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Room</span>
                    <span style={styles.detailValue}>Room {booking.roomNumber}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Check In</span>
                    <span style={styles.detailValue}>
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Check Out</span>
                    <span style={styles.detailValue}>
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Guests</span>
                    <span style={styles.detailValue}>
                      {booking.numberOfAdults} adults, {booking.numberOfChildren} children
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Rooms</span>
                    <span style={styles.detailValue}>{booking.numberOfRooms}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Total Fare</span>
                    <span style={styles.totalFare}>₹{booking.totalFare}</span>
                  </div>
                </div>

                {booking.cancellationReason && (
                  <p style={styles.cancelReason}>
                    Reason: {booking.cancellationReason}
                  </p>
                )}

                <div style={styles.bookingFooter}>
                  <span style={styles.bookingDate}>
                    Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                  </span>
                  {booking.status === 1 && (
                    <button
                      onClick={() => handleCancel(booking.bookingId)}
                      disabled={cancellingId === booking.bookingId}
                      style={styles.cancelBtn}
                    >
                      {cancellingId === booking.bookingId ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  content: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' },
  success: {
    background: '#d4edda', color: '#155724',
    padding: '16px', borderRadius: '10px',
    marginBottom: '24px', fontSize: '16px', fontWeight: '500',
  },
  error: {
    background: '#ffe0e0', color: '#c0392b',
    padding: '12px', borderRadius: '8px', marginBottom: '16px',
  },
  loading: { textAlign: 'center', padding: '60px', color: '#888', fontSize: '18px' },
  empty: {
    textAlign: 'center', padding: '60px',
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  emptyIcon: { fontSize: '60px', marginBottom: '16px' },
  bookingList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  bookingCard: {
    background: 'white', borderRadius: '16px',
    padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  bookingHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '20px',
  },
  hotelName: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  location: { color: '#888', fontSize: '14px', margin: 0 },
  statusBadge: {
    padding: '6px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600',
  },
  bookingDetails: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginBottom: '16px',
  },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '12px', color: '#888', fontWeight: '500' },
  detailValue: { fontSize: '14px', color: '#1a1a2e', fontWeight: '600' },
  totalFare: { fontSize: '18px', color: '#667eea', fontWeight: '700' },
  cancelReason: {
    background: '#fff3cd', color: '#856404',
    padding: '8px 12px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '16px',
  },
  bookingFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px',
  },
  bookingDate: { fontSize: '13px', color: '#888' },
  cancelBtn: {
    padding: '8px 20px', background: '#ff4757',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
};

export default UserDashboard;