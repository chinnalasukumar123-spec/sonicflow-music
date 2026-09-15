import React, { useState } from 'react';
import { X, User, Sliders, ShieldCheck, Trash2, Check } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';

const QUALITIES = [
  { id: '128kbps Standard', desc: 'Standard mobile data saver' },
  { id: '256kbps High', desc: 'High definition balanced streaming' },
  { id: '320kbps HD', desc: 'Ultra HD crystal-clear studio audio' },
  { id: 'FLAC Lossless', desc: '24-bit Hi-Fi audiophile lossless stream' },
];

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    userName,
    setUserName,
    audioQuality,
    setAudioQuality,
    likedSongIds,
    customPlaylists,
    followedArtistIds,
    resetAllData,
    showToast
  } = useLibrary();

  const { setIsEqualizerOpen } = usePlayer();
  const [nameInput, setNameInput] = useState(userName);

  if (!isSettingsOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      showToast('Profile name updated!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] border border-border/80 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-black font-extrabold shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-foreground">User Settings & Profile</h3>
              <p className="text-xs text-muted-foreground">Manage your audio preferences and account</p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Name Form */}
        <form onSubmit={handleSaveName} className="space-y-3">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Display Name
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Name"
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl gradient-primary text-black font-bold text-xs hover:opacity-95 transition-opacity flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </form>

        {/* Streaming Audio Quality */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Streaming Audio Bitrate Quality</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUALITIES.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setAudioQuality(q.id);
                  showToast(`Audio quality set to ${q.id}`, 'success');
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  audioQuality === q.id
                    ? 'bg-primary/20 border-primary text-foreground shadow-md'
                    : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{q.id}</span>
                  {audioQuality === q.id && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <span className="text-[10px] text-muted-foreground/80 mt-1">{q.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Equalizer Quick Access */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Sound Equalizer & Presets</p>
              <p className="text-[11px] text-muted-foreground">Adjust Tollywood Mass Punch, Bass Boost & Vocals</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSettingsOpen(false);
              setIsEqualizerOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold transition-all"
          >
            Configure
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-muted/30 border border-border">
            <p className="text-lg font-extrabold text-rose-400 font-mono">{likedSongIds.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Liked Songs</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 border border-border">
            <p className="text-lg font-extrabold text-amber-400 font-mono">{customPlaylists.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Playlists</p>
          </div>
          <div className="p-3 rounded-2xl bg-muted/30 border border-border">
            <p className="text-lg font-extrabold text-primary font-mono">{followedArtistIds.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Artists</p>
          </div>
        </div>

        {/* Reset / Clear Data */}
        <div className="pt-2 flex items-center justify-between border-t border-border/60">
          <span className="text-[11px] text-muted-foreground">SonicFlow Pro v2.0 • Local Storage Enabled</span>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all custom playlists and likes back to defaults?')) {
                resetAllData();
                setIsSettingsOpen(false);
              }
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 p-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
