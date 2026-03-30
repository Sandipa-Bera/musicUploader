import { createContext, useContext, useState, useRef } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(null);

  function playTrack(track, trackList = []) {
    setCurrentTrack(track);
    setQueue(trackList);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(p => !p);
  }

  function playNext() {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex(t => t._id === currentTrack._id);
    const next = queue[(idx + 1) % queue.length];
    setCurrentTrack(next);
    setIsPlaying(true);
  }

  function playPrev() {
    if (!queue.length || !currentTrack) return;
    const idx = queue.findIndex(t => t._id === currentTrack._id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    setCurrentTrack(prev);
    setIsPlaying(true);
  }

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, queue, audioRef, playTrack, togglePlay, playNext, playPrev }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
