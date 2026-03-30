import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function UploadPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (user?.role !== 'artist') {
    return (
      <div className="page">
        <div className="upload-restricted">
          <svg viewBox="0 0 24 24" fill="#ff6b6b" width="48" height="48"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          <h2>Artists Only</h2>
          <p>Only accounts with the Artist role can upload music.<br/>Create a new account and select "Artist" as the account type.</p>
        </div>
      </div>
    );
  }

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError('');
      setSuccess(null);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith('audio/')) {
      setFile(dropped);
      setError('');
      setSuccess(null);
    } else {
      setError('Please drop an audio file (mp3, wav, etc.)');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setError('Please select an audio file.');
    if (!title.trim()) return setError('Please enter a title.');

    setUploading(true);
    setError('');
    setSuccess(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('music', file);
      formData.append('title', title.trim());

      const res = await api.post('/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });

      setSuccess(res.data.music);
      setTitle('');
      setFile(null);
      setProgress(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : null;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Upload Music</h1>
        <p className="page-subtitle">Share your music with the world</p>
      </div>

      <div className="upload-container">
        {success && (
          <div className="upload-success">
            <svg viewBox="0 0 24 24" fill="#1DB954" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>
            <div>
              <strong>"{success.title}" uploaded successfully!</strong>
              <span>Your track is now live.</span>
            </div>
            <button className="success-dismiss" onClick={() => setSuccess(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Drop Zone */}
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {file ? (
              <div className="file-preview">
                <div className="file-icon">
                  <svg viewBox="0 0 24 24" fill="#1DB954" width="40" height="40"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{fileSizeMB} MB · {file.type || 'audio'}</span>
                </div>
                <button
                  type="button"
                  className="file-remove"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setProgress(0); }}
                >✕</button>
              </div>
            ) : (
              <div className="drop-zone-prompt">
                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                <p>Drag &amp; drop your audio file here</p>
                <span>or <u>browse files</u></span>
                <span className="drop-hint">Supports MP3, WAV, FLAC, OGG</span>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>Track Title</label>
            <input
              type="text"
              placeholder="Enter track title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Error */}
          {error && <div className="auth-error" style={{ marginTop: '12px' }}>{error}</div>}

          {/* Upload Progress */}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-label">
                <span>Uploading to Cloudinary...</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary upload-btn" disabled={uploading || !file}>
            {uploading ? (
              <><span className="btn-spinner" /> Uploading...</>
            ) : (
              <><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg> Upload Track</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
