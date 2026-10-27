import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import bookingService from '../services/bookingService';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, hotel, checkIn, checkOut, rooms } = location.state || {};

  const [formData, setFormData] = useState({
    checkInDate: checkIn || '',
    checkOutDate: checkOut || '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    numberOfRooms: rooms || 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const diff = new Date(formData.checkOutDate) - new Date(formData.checkInDate);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateFare = () => {
  if (!room) return 0;
  const nights = calculateNights();
  const baseFare = room.baseFare;
  const numberOfRooms = parseInt(formData.numberOfRooms);   // ← add parseInt
  const numberOfAdults = parseInt(formData.numberOfAdults); // ← add parseInt
  const numberOfChildren = parseInt(formData.numberOfChildren); // ← add parseInt
  let totalFare = baseFare;

  const baseOccupancy = room.bedType === 0 ? 1 : room.bedType === 1 ? 2 : 4;
  const totalGuests = numberOfAdults + numberOfChildren;
  const extraGuests = totalGuests - baseOccupancy;

  if (extraGuests > 0) {
    if (numberOfAdults <= baseOccupancy) {
      totalFare += Math.max(0, totalGuests - baseOccupancy) * (baseFare * 0.20);
    } else {
      const extraAdults = Math.max(0, numberOfAdults - baseOccupancy);
      totalFare += extraAdults * (baseFare * 0.40);
      totalFare += numberOfChildren * (baseFare * 0.20);
    }
  }

  return (totalFare * numberOfRooms * nights).toFixed(2);
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bookingService.create({
        roomId: room.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfAdults: parseInt(formData.numberOfAdults),
        numberOfChildren: parseInt(formData.numberOfChildren),
        numberOfRooms: parseInt(formData.numberOfRooms),
      });
      navigate('/dashboard', { state: { bookingSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const nights = calculateNights();
  const totalFare = calculateFare();

  const getBedTypeLabel = (bedType) => {
    const types = { 0: 'Single Bed', 1: 'Double Bed', 2: 'King Size' };
    return types[bedType] || 'Standard';
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>Complete Your Booking</h1>

        <div style={styles.grid}>
          {/* Booking Form */}
          <div style={styles.formSection}>
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>📅 Stay Details</h2>
                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Check In Date</label>
                    <input
                      type="date" name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      min={today} style={styles.input} required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Check Out Date</label>
                    <input
                      type="date" name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      min={formData.checkInDate || today}
                      style={styles.input} required
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Adults</label>
                    <select name="numberOfAdults" value={formData.numberOfAdults}
                      onChange={handleChange} style={styles.input}>
                      {[1,2,3,4,5,6].map(n => (
                        <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Children</label>
                    <select name="numberOfChildren" value={formData.numberOfChildren}
                      onChange={handleChange} style={styles.input}>
                      {[0,1,2,3,4].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Number of Rooms</label>
                  <select name="numberOfRooms" value={formData.numberOfRooms}
                    onChange={handleChange} style={styles.input}>
                    {[1,2,3,4,5].map(n => (
                      <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" style={styles.bookBtn} disabled={loading || nights === 0}>
                {loading ? 'Processing...' : `Confirm Booking — ₹${totalFare}`}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div style={styles.summarySection}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>🏨 Booking Summary</h2>

              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Hotel</span>
                <span style={styles.summaryValue}>{hotel?.name}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Location</span>
                <span style={styles.summaryValue}>📍 {hotel?.location}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Room</span>
                <span style={styles.summaryValue}>Room {room?.roomNumber}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Bed Type</span>
                <span style={styles.summaryValue}>{getBedTypeLabel(room?.bedType)}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Base Fare</span>
                <span style={styles.summaryValue}>₹{room?.baseFare}/night</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Nights</span>
                <span style={styles.summaryValue}>{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Rooms</span>
                <span style={styles.summaryValue}>{formData.numberOfRooms}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Guests</span>
                <span style={styles.summaryValue}>
                  {formData.numberOfAdults} adult{formData.numberOfAdults > 1 ? 's' : ''}
                  {formData.numberOfChildren > 0 && `, ${formData.numberOfChildren} child${formData.numberOfChildren > 1 ? 'ren' : ''}`}
                </span>
              </div>
              <div style={styles.divider} />
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total Amount</span>
                <span style={styles.totalValue}>₹{totalFare}</span>
              </div>
              <p style={styles.fareNote}>
                * Additional charges apply for extra guests beyond base occupancy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '32px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' },
  formSection: {},
  summarySection: {},
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#444' },
  input: {
    width: '100%', padding: '10px 14px',
    border: '2px solid #e8e8e8', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none',
  },
  error: {
    background: '#ffe0e0', color: '#c0392b',
    padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
  },
  bookBtn: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '18px', fontWeight: '700', cursor: 'pointer',
  },
  summaryItem: {
    display: 'flex', justifyContent: 'space-between',
    marginBottom: '14px', fontSize: '14px',
  },
  summaryLabel: { color: '#888', fontWeight: '500' },
  summaryValue: { color: '#1a1a2e', fontWeight: '600', textAlign: 'right', maxWidth: '200px' },
  divider: { height: '1px', background: '#e8e8e8', margin: '16px 0' },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px',
  },
  totalLabel: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e' },
  totalValue: { fontSize: '28px', fontWeight: '800', color: '#667eea' },
  fareNote: { fontSize: '12px', color: '#aaa', margin: 0 },
};

export default BookingPage;