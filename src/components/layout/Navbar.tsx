import React from 'react';
import { Search, Bell, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    searchQuery,
    setSearchQuery,
    setActiveGenreFilter,
    userName,
    audioQuality,
    setIsSettingsOpen,
    showToast
  } = useLibrary();

  const { setIsEqualizerOpen } = usePlayer();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('search');
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0F19]/85 backdrop-blur-xl border-b border-border/60 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Quick search input */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (currentView !== 'search' && e.target.value.length > 0) {
              navigateTo('search');
            }
          }}
          placeholder="Search songs, artists, albums, or genres..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/60 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/80 focus:ring-1 focus:ring-primary/40 transition-all"
        />
      </form>

      {/* Right: Audio Quality Badge, Notifications, Top Hits & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Audio Quality Pill */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer"
          title="Streaming Audio Quality (Click to Configure)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{audioQuality}</span>
        </button>

        {/* Global Top Hits Quick Filter Pill */}
        <button
          onClick={() => {
            setActiveGenreFilter('Trending');
            navigateTo('search');
          }}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/25 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Top Hits</span>
        </button>

        {/* Equalizer Shortcut */}
        <button
          onClick={() => setIsEqualizerOpen(true)}
          className="p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          title="Open Audio Equalizer"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => showToast('New global hits added: The Weeknd, Taylor Swift & Billie Eilish!', 'info')}
          className="relative p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 pl-2 cursor-pointer group"
          title={`Profile Settings (${userName})`}
        >
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-black font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            {getInitials(userName)}
          </div>
        </div>
      </div>
    </header>
  );
};

