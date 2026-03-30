import { useEffect, useState } from 'react';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';

export default function HomePage() {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    api.get('/music/')
      .then(res => setMusics(res.data.musics))
      .catch(() => setError('Failed to load songs'))
      .finally(() => setLoading(false));
  }, []);

  const isCurrentlyPlaying = (track) =>
    currentTrack?._id === track._id && isPlaying;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Good Evening 🎵</h1>
        <p className="page-subtitle">All Songs</p>
      </div>

      {loading && <div className="skeleton-grid">{Array(8).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)}</div>}
      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && (
        <div className="track-list">
          {musics.length === 0
            ? <div className="empty-state">No songs uploaded yet. Artists can upload from an API client!</div>
            : musics.map((music, i) => (
              <div
                key={music._id}
                className={`track-row ${isCurrentlyPlaying(music) ? 'playing' : ''}`}
                onClick={() => playTrack(music, musics)}
              >
                <div className="track-num">
                  {isCurrentlyPlaying(music)
                    ? <span className="bars-anim"><span /><span /><span /></span>
                    : <span className="index">{i + 1}</span>}
                </div>
                <div className="track-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
                <div className="track-info">
                  <span className="track-title">{music.title}</span>
                  <span className="track-artist">{music.artist?.username || 'Unknown Artist'}</span>
                </div>
                <div className="track-play-btn">
                  {isCurrentlyPlaying(music)
                    ? <svg viewBox="0 0 24 24" fill="#1DB954" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>}
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
