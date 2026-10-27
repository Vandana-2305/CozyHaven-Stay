import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'Admin') return '/admin/dashboard';
    if (user?.role === 'HotelOwner') return '/owner/dashboard';
    return '/dashboard';
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🏨 CozyHaven Stay</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {user ? (
          <>
            <Link to={getDashboardLink()} style={styles.link}>
              Dashboard
            </Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <span style={styles.welcome}>Hi, {user.name}!</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'white',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#667eea',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    color: '#444',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px',
  },
  welcome: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: '15px',
  },
  logoutBtn: {
    padding: '8px 20px',
    background: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  registerBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
  },
};

export default Navbar;