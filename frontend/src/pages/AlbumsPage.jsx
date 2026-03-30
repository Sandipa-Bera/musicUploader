import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/music/albums')
      .then(res => setAlbums(res.data.albums))
      .catch(() => setError('Failed to load albums'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Albums</h1>
        <p className="page-subtitle">Browse your music collection</p>
      </div>

      {loading && <div className="skeleton-grid">{Array(6).fill(0).map((_, i) => <div key={i} className="skeleton-album-card" />)}</div>}
      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && (
        <div className="albums-grid">
          {albums.length === 0
            ? <div className="empty-state">No albums yet.</div>
            : albums.map(album => (
              <Link to={`/albums/${album._id}`} key={album._id} className="album-card">
                <div className="album-cover">
                  <svg viewBox="0 0 24 24" fill="#1DB954" width="48" height="48"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
                </div>
                <div className="album-info">
                  <span className="album-title">{album.title}</span>
                  <span className="album-artist">{album.artist?.username || 'Unknown Artist'}</span>
                </div>
              </Link>
            ))
          }
        </div>
      )}
    </div>
  );
}
