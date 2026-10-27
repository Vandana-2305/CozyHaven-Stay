import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import hotelService from '../services/hotelService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

const HotelDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const { checkIn, checkOut, rooms } = location.state || {};

  useEffect(() => {
    fetchHotel();
    fetchReviews();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const response = await hotelService.getById(id);
      setHotel(response.data);
    } catch (err) {
      setError('Failed to load hotel details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getByHotel(id);
      // Safely handle both empty array and populated array
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      // Silently fail — just show empty reviews
      setReviews([]);
    }
  };

  const handleBookRoom = (room) => {
    if (!user) { navigate('/login'); return; }
    navigate(`/booking/${room.roomId}`, {
      state: { room, hotel, checkIn, checkOut, rooms }
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    console.log('handleSubmitReview called');
    console.log('user:', user);
    console.log('id:', id);
    console.log('reviewForm:', reviewForm);

    if (!user) { navigate('/login'); return; }

    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const payload = {
        hotelId: parseInt(id),
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment || '',
      };
      console.log('Sending payload:', payload);

      const result = await reviewService.create(payload);
      console.log('Review created:', result.data);

      setReviewSuccess('Review submitted successfully! 🎉');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchHotel();
    } catch (err) {
      console.error('Review submit error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setReviewError(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Failed to submit review.'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const getBedTypeLabel = (bedType) => {
    const types = { 0: '🛏️ Single Bed', 1: '🛏️🛏️ Double Bed', 2: '👑 King Size' };
    return types[bedType] || 'Standard';
  };

  const renderStars = (rating) => '⭐'.repeat(rating);

  if (loading) return (
    <div style={styles.page}><Navbar />
      <div style={styles.loading}>Loading hotel details...</div>
    </div>
  );

  if (error) return (
    <div style={styles.page}><Navbar />
      <div style={styles.error}>{error}</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.hotelName}>{hotel?.name}</h1>
          <p style={styles.location}>📍 {hotel?.location}</p>
          <p style={styles.description}>{hotel?.description}</p>
          <div style={styles.amenities}>
            {hotel?.hasFreeWifi && <span style={styles.amenity}>📶 Free WiFi</span>}
            {hotel?.hasParking && <span style={styles.amenity}>🚗 Parking</span>}
            {hotel?.hasDining && <span style={styles.amenity}>🍽️ Dining</span>}
            {hotel?.hasSwimmingPool && <span style={styles.amenity}>🏊 Swimming Pool</span>}
            {hotel?.hasFitnessCenter && <span style={styles.amenity}>💪 Fitness Center</span>}
            {hotel?.hasRoomService && <span style={styles.amenity}>🛎️ Room Service</span>}
          </div>
          <div style={styles.rating}>
            ⭐ {hotel?.averageRating > 0 ? hotel.averageRating.toFixed(1) : 'No ratings yet'}
            <span style={styles.reviewCount}> ({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {checkIn && checkOut && (
        <div style={styles.bookingBar}>
          <span>📅 {checkIn} → {checkOut}</span>
          <span>🛏️ {rooms} Room(s)</span>
          <span style={styles.bookingNote}>Select a room to book</span>
        </div>
      )}

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Available Rooms</h2>
        {hotel?.rooms?.length === 0 ? (
          <div style={styles.empty}>No rooms available for this hotel yet.</div>
        ) : (
          <div style={styles.roomGrid}>
            {hotel?.rooms?.map((room) => (
              <div key={room.roomId} style={styles.roomCard}>
                <div style={styles.roomHeader}>
                  <h3 style={styles.roomNumber}>Room {room.roomNumber}</h3>
                  <span style={room.isAvailable ? styles.available : styles.unavailable}>
                    {room.isAvailable ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>
                <div style={styles.roomDetails}>
                  <div style={styles.roomDetail}>{getBedTypeLabel(room.bedType)}</div>
                  <div style={styles.roomDetail}>📐 {room.roomSizeInSqFt} sq ft</div>
                  <div style={styles.roomDetail}>👥 Max {room.maxOccupancy} guests</div>
                  <div style={styles.roomDetail}>{room.isAC ? '❄️ AC' : '🌀 Non-AC'}</div>
                </div>
                <div style={styles.roomFooter}>
                  <div style={styles.price}>
                    <span style={styles.priceAmount}>₹{room.baseFare}</span>
                    <span style={styles.priceLabel}>/night</span>
                  </div>
                  <button
                    onClick={() => handleBookRoom(room)}
                    disabled={!room.isAvailable}
                    style={room.isAvailable ? styles.bookBtn : styles.bookBtnDisabled}>
                    {room.isAvailable ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 style={styles.sectionTitle}>Guest Reviews</h2>

        {user?.role === 'User' && (
          <div style={styles.reviewFormCard}>
            <h3 style={styles.reviewFormTitle}>✍️ Write a Review</h3>
            {reviewError && <div style={styles.reviewError}>{reviewError}</div>}
            {reviewSuccess && <div style={styles.reviewSuccess}>{reviewSuccess}</div>}
            <form onSubmit={handleSubmitReview}>
              <div style={styles.ratingSelect}>
                <label style={styles.label}>Your Rating</label>
                <div style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{
                        ...styles.star,
                        color: star <= reviewForm.rating ? '#f39c12' : '#ddd'
                      }}>
                      ★
                    </span>
                  ))}
                  <span style={styles.ratingLabel}>{reviewForm.rating}/5</span>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Comment (optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  style={styles.textarea}
                  rows={3}
                />
              </div>
              <button type="submit" style={styles.reviewBtn} disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <div style={styles.empty}>No reviews yet. Be the first to review!</div>
        ) : (
          <div style={styles.reviewList}>
            {reviews.map((review) => (
              <div key={review.reviewId} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewUser}>
                    <div style={styles.reviewAvatar}>
                      {review.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.reviewName}>{review.userName}</div>
                      <div style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={styles.reviewRating}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.comment && (
                  <p style={styles.reviewComment}>{review.comment}</p>
                )}
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
  loading: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#888' },
  error: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#e74c3c' },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px', color: 'white',
  },
  headerContent: { maxWidth: '1100px', margin: '0 auto' },
  hotelName: { fontSize: '36px', fontWeight: '800', margin: '0 0 8px' },
  location: { fontSize: '16px', opacity: 0.85, margin: '0 0 12px' },
  description: { fontSize: '16px', opacity: 0.9, margin: '0 0 16px' },
  amenities: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' },
  amenity: {
    background: 'rgba(255,255,255,0.2)', padding: '6px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '500',
  },
  rating: { fontSize: '18px', fontWeight: '600' },
  reviewCount: { fontSize: '14px', opacity: 0.8 },
  bookingBar: {
    background: 'white', padding: '16px 40px',
    display: 'flex', gap: '32px', alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    fontSize: '15px', fontWeight: '500', color: '#444',
  },
  bookingNote: { color: '#667eea', fontWeight: '600', marginLeft: 'auto' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' },
  sectionTitle: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 24px' },
  empty: {
    textAlign: 'center', padding: '40px', color: '#888',
    background: 'white', borderRadius: '12px', marginBottom: '32px',
  },
  roomGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px', marginBottom: '40px',
  },
  roomCard: {
    background: 'white', borderRadius: '16px',
    padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  roomHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  roomNumber: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  available: { background: '#e8f8f0', color: '#27ae60', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  unavailable: { background: '#ffe0e0', color: '#e74c3c', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  roomDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  roomDetail: { background: '#f8f9fa', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: '#555' },
  roomFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { display: 'flex', alignItems: 'baseline', gap: '4px' },
  priceAmount: { fontSize: '24px', fontWeight: '700', color: '#667eea' },
  priceLabel: { fontSize: '13px', color: '#888' },
  bookBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '15px',
  },
  bookBtnDisabled: {
    padding: '10px 24px', background: '#ccc', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'not-allowed',
    fontWeight: '600', fontSize: '15px',
  },
  reviewFormCard: {
    background: 'white', borderRadius: '16px',
    padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  reviewFormTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  reviewError: { background: '#ffe0e0', color: '#c0392b', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' },
  reviewSuccess: { background: '#d4edda', color: '#155724', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' },
  ratingSelect: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#444' },
  starRow: { display: 'flex', alignItems: 'center', gap: '4px' },
  star: { fontSize: '32px', cursor: 'pointer', transition: 'color 0.1s' },
  ratingLabel: { fontSize: '16px', fontWeight: '600', color: '#444', marginLeft: '8px' },
  inputGroup: { marginBottom: '16px' },
  textarea: {
    width: '100%', padding: '10px 14px',
    border: '2px solid #e8e8e8', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box',
    outline: 'none', resize: 'vertical',
  },
  reviewBtn: {
    padding: '10px 28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '15px',
  },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  reviewCard: {
    background: 'white', borderRadius: '12px',
    padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  reviewUser: { display: 'flex', alignItems: 'center', gap: '12px' },
  reviewAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: '700', color: 'white',
  },
  reviewName: { fontWeight: '600', color: '#1a1a2e', fontSize: '15px' },
  reviewDate: { fontSize: '12px', color: '#aaa' },
  reviewRating: { fontSize: '18px' },
  reviewComment: { color: '#555', lineHeight: '1.6', margin: 0 },
};

export default HotelDetail;