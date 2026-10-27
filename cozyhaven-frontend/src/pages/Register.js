import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', address: '', gender: '', role: 'User'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await authService.register(submitData);
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🏨 CozyHaven Stay</h1>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join us and start booking!</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="Your full name"
                style={styles.input} required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="your@email.com"
                style={styles.input} required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Min 6 characters"
                style={styles.input} required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="Repeat password"
                style={styles.input} required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="text" name="phoneNumber" value={formData.phoneNumber}
                onChange={handleChange} placeholder="9876543210"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Gender</label>
              <select name="gender" value={formData.gender}
                onChange={handleChange} style={styles.input}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Address</label>
            <input
              type="text" name="address" value={formData.address}
              onChange={handleChange} placeholder="Your address"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Register As</label>
            <select name="role" value={formData.role}
              onChange={handleChange} style={styles.input}>
              <option value="User">Guest (Book Hotels)</option>
              <option value="HotelOwner">Hotel Owner (Manage Hotels)</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '680px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  logo: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '8px',
    color: '#667eea',
  },
  title: {
    textAlign: 'center',
    fontSize: '26px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '28px',
    fontSize: '14px',
  },
  error: {
    background: '#ffe0e0',
    color: '#c0392b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#888',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Register;