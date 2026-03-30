import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg viewBox="0 0 24 24" fill="#1DB954" width="36" height="36"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.42c-.2.32-.63.43-.95.23-2.6-1.59-5.87-1.95-9.73-1.07-.37.09-.74-.14-.83-.51-.09-.37.14-.74.51-.83 4.22-.96 7.84-.55 10.77 1.23.32.2.43.63.23.95zm1.24-2.76c-.25.4-.78.52-1.17.27-2.97-1.83-7.5-2.36-11.02-1.29-.46.14-.94-.12-1.08-.58-.13-.46.12-.94.58-1.08 4.01-1.22 8.98-.63 12.41 1.47.4.25.52.78.28 1.21zm.11-2.87C14.66 8.99 8.89 8.8 5.36 9.87c-.55.17-1.13-.14-1.3-.69-.17-.55.14-1.13.69-1.3 4.05-1.23 10.79-1 15.03 1.52.5.29.66.93.37 1.42-.29.49-.93.66-1.15.97z"/></svg>
        <span>Spotify</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          Home
        </NavLink>
        <NavLink to="/albums" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
          Albums
        </NavLink>
        {user?.role === 'artist' && (
          <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
            Upload
          </NavLink>
        )}
        {user?.role === 'artist' && (
          <NavLink to="/create-album" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm1 3v4h4v2h-4v4h-2v-4H7v-2h4V7h2z"/></svg>
            Create Album
          </NavLink>
        )}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
        <div className="user-info">
          <span className="user-name">{user?.username}</span>
          <span className="user-role">{user?.role}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
        </button>
      </div>
    </aside>
  );
}
