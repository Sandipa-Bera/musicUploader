import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    api.get(`/music/albums/${albumId}`)
      .then(res => setAlbum(res.data.album))
      .catch(() => setError('Failed to load album'))
      .finally(() => setLoading(false));
  }, [albumId]);

  const isCurrentlyPlaying = (track) =>
    currentTrack?._id === track._id && isPlaying;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/albums')}>
        ← Back to Albums
      </button>

      {loading && <div className="skeleton-detail" />}
      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && album && (
        <>
          <div className="album-hero">
            <div className="album-hero-cover">
              <svg viewBox="0 0 24 24" fill="#1DB954" width="80" height="80"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
            </div>
            <div className="album-hero-info">
              <span className="label">Album</span>
              <h1 className="page-title">{album.title}</h1>
              <span className="page-subtitle">{album.artist?.username} • {album.musics?.length || 0} songs</span>
            </div>
          </div>

          {album.musics?.length > 0 && (
            <button className="btn-play-all" onClick={() => playTrack(album.musics[0], album.musics)}>
              ▶ Play All
            </button>
          )}

          <div className="track-list">
            {album.musics?.length === 0
              ? <div className="empty-state">This album has no tracks yet.</div>
              : album.musics?.map((track, i) => (
                <div
                  key={track._id}
                  className={`track-row ${isCurrentlyPlaying(track) ? 'playing' : ''}`}
                  onClick={() => playTrack(track, album.musics)}
                >
                  <div className="track-num">
                    {isCurrentlyPlaying(track)
                      ? <span className="bars-anim"><span /><span /><span /></span>
                      : <span className="index">{i + 1}</span>}
                  </div>
                  <div className="track-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </div>
                  <div className="track-info">
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist?.username || album.artist?.username}</span>
                  </div>
                  <div className="track-play-btn">
                    {isCurrentlyPlaying(track)
                      ? <svg viewBox="0 0 24 24" fill="#1DB954" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      : <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>}
                  </div>
                </div>
              ))
            }
          </div>
        </>
      )}
    </div>
  );
}
