import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function MusicPlayer() {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrev } = usePlayer();
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.uri;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function handleTimeUpdate() {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  }

  function handleSeek(e) {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  const progressPct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className={`music-player ${currentTrack ? 'visible' : ''}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={playNext}
      />

      <div className="player-track">
        <div className="player-icon">
          <svg viewBox="0 0 24 24" fill="#1DB954" width="32" height="32"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <div className="player-track-info">
          <span className="player-title">{currentTrack?.title || 'No track selected'}</span>
          <span className="player-artist">{currentTrack?.artist?.username || '—'}</span>
        </div>
      </div>

      <div className="player-controls">
        <button className="ctrl-btn" onClick={playPrev} title="Previous">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>
        <button className="ctrl-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying
            ? <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>}
        </button>
        <button className="ctrl-btn" onClick={playNext} title="Next">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      <div className="player-progress">
        <span className="time">{fmt(progress)}</span>
        <input
          type="range"
          className="progress-bar"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          style={{ '--pct': `${progressPct}%` }}
        />
        <span className="time">{fmt(duration)}</span>
      </div>

      <div className="player-volume">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        <input
          type="range"
          className="volume-bar"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{ '--pct': `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}
