import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '', phoneNumber: '', address: '', gender: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        phoneNumber: response.data.phoneNumber || '',
        address: response.data.address || '',
        gender: response.data.gender || '',
      });
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await authService.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed.');
    }
  };

  if (loading) return (
    <div style={styles.page}><Navbar />
      <div style={styles.loading}>Loading profile...</div>
    </div>
  );

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.title}>My Profile</h1>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* Profile Card */}
        <div style={styles.card}>
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={styles.profileName}>{profile?.name}</h2>
              <p style={styles.profileEmail}>{profile?.email}</p>
              <span style={styles.roleBadge}>{profile?.role}</span>
            </div>
          </div>

          {!editing ? (
            <>
              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone</span>
                  <span style={styles.infoValue}>{profile?.phoneNumber || 'Not provided'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Gender</span>
                  <span style={styles.infoValue}>{profile?.gender || 'Not provided'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Address</span>
                  <span style={styles.infoValue}>{profile?.address || 'Not provided'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Member Since</span>
                  <span style={styles.infoValue}>
                    {new Date(profile?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                ✏️ Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    type="text" value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Gender</label>
                  <select value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    style={styles.input}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Address</label>
                  <input
                    type="text" value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.btnRow}>
                <button type="submit" style={styles.saveBtn}>Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔒 Change Password</h2>
          {!changingPassword ? (
            <button onClick={() => setChangingPassword(true)} style={styles.editBtn}>
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  style={styles.input} required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  style={styles.input} required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  style={styles.input} required
                />
              </div>
              <div style={styles.btnRow}>
                <button type="submit" style={styles.saveBtn}>Update Password</button>
                <button type="button" onClick={() => setChangingPassword(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fa' },
  content: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' },
  loading: { textAlign: 'center', padding: '60px', color: '#888' },
  error: { background: '#ffe0e0', color: '#c0392b', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  success: { background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  card: {
    background: 'white', borderRadius: '16px',
    padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' },
  profileHeader: { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' },
  avatar: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '32px', fontWeight: '700', color: 'white', flexShrink: 0,
  },
  profileName: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  profileEmail: { color: '#888', fontSize: '14px', margin: '0 0 8px' },
  roleBadge: {
    background: '#f0f0ff', color: '#667eea',
    padding: '4px 12px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600',
  },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '12px', color: '#888', fontWeight: '500' },
  infoValue: { fontSize: '15px', color: '#1a1a2e', fontWeight: '600' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px', color: '#444' },
  input: {
    width: '100%', padding: '10px 14px',
    border: '2px solid #e8e8e8', borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none',
  },
  btnRow: { display: 'flex', gap: '12px' },
  editBtn: {
    padding: '10px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  saveBtn: {
    padding: '10px 24px', background: '#27ae60',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  cancelBtn: {
    padding: '10px 24px', background: '#e8e8e8',
    color: '#444', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
};

export default Profile;