import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateAlbumPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [artistTracks, setArtistTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.role === 'artist') {
      api.get('/music/artist-tracks')
        .then(res => {
          setArtistTracks(res.data.tracks);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load your tracks.');
          setLoading(false);
        });
    }
  }, [user]);

  if (user?.role !== 'artist') {
    return (
      <div className="page">
        <div className="upload-restricted">
          <h2>Artists Only</h2>
          <p>Only artist accounts can create albums.</p>
        </div>
      </div>
    );
  }

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Please enter an album title.');
    if (selectedTracks.length === 0) return setError('Please select at least one track.');

    setCreating(true);
    setError('');
    try {
      await api.post('/music/album', {
        title: title.trim(),
        musics: selectedTracks
      });
      setSuccess(true);
      setTimeout(() => navigate('/albums'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create album.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Album</h1>
        <p className="page-subtitle">Group your tracks into an album</p>
      </div>

      <div className="upload-container">
        {success && (
          <div className="upload-success">
            <strong>Album created successfully!</strong>
            <span>Redirecting to albums...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Album Title</label>
            <input
              type="text"
              placeholder="Enter album title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={creating}
            />
          </div>

          <div className="track-selection-section" style={{ marginTop: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Select Tracks ({selectedTracks.length} selected)
            </label>
            
            {loading ? (
              <div className="skeleton-grid">
                <div className="skeleton-card" style={{ height: '40px' }} />
                <div className="skeleton-card" style={{ height: '40px' }} />
              </div>
            ) : artistTracks.length === 0 ? (
              <p className="empty-state">You haven't uploaded any tracks yet. <br /> Upload tracks first to create an album.</p>
            ) : (
              <div className="artist-tracks-list" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--bg-highlight)', borderRadius: '8px', padding: '8px' }}>
                {artistTracks.map(track => (
                  <div
                    key={track._id}
                    className={`track-selection-item ${selectedTracks.includes(track._id) ? 'selected' : ''}`}
                    onClick={() => toggleTrackSelection(track._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      marginBottom: '4px',
                      background: selectedTracks.includes(track._id) ? 'rgba(29, 185, 84, 0.1)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '2px solid' + (selectedTracks.includes(track._id) ? ' var(--green)' : ' var(--bg-highlight)'),
                      marginRight: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: selectedTracks.includes(track._id) ? 'var(--green)' : 'transparent'
                    }}>
                      {selectedTracks.includes(track._id) && (
                        <svg viewBox="0 0 24 24" fill="black" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      )}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: selectedTracks.includes(track._id) ? 'var(--white)' : 'var(--text-muted)' }}>
                      {track.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="auth-error" style={{ marginTop: '16px' }}>{error}</div>}

          <button type="submit" className="btn-primary" disabled={creating || artistTracks.length === 0} style={{ marginTop: '24px' }}>
            {creating ? 'Creating Album...' : 'Create Album'}
          </button>
        </form>
      </div>
    </div>
  );
}
