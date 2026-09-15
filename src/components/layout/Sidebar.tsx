import React from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  PlusSquare,
  Flame,
  Music2,
  ListMusic
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { FEATURED_PLAYLISTS } from '../../data/playlists';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    activeId,
    navigateTo,
    setIsCreatePlaylistOpen,
    customPlaylists,
    likedSongIds
  } = useLibrary();

  return (
    <aside className="w-64 bg-[#0A0E1A] border-r border-border/70 flex-shrink-0 flex flex-col h-screen select-none z-30 pb-28">
      {/* Brand Header */}
      <div
        onClick={() => navigateTo('home')}
        className="p-6 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-black font-extrabold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
          <Music2 className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1.5">
            SONICFLOW
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
              PRO
            </span>
          </span>
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            Global Music Streaming
          </p>
        </div>
      </div>

      {/* Main Nav Links */}
      <nav className="px-3 space-y-1">
        <button
          onClick={() => navigateTo('home')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentView === 'home'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('search')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentView === 'search'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search & Browse</span>
        </button>

        <button
          onClick={() => navigateTo('library')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentView === 'library'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Your Library</span>
        </button>
      </nav>

      <div className="px-6 my-4">
        <div className="h-px bg-border/60"></div>
      </div>

      {/* Playlist Actions */}
      <div className="px-3 space-y-1">
        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
        >
          <div className="p-1 rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-black transition-colors">
            <PlusSquare className="w-4 h-4" />
          </div>
          <span>Create Playlist</span>
        </button>

        <button
          onClick={() => navigateTo('liked-songs')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
            currentView === 'liked-songs'
              ? 'bg-rose-500/15 text-rose-400'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <div className="p-1 rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="flex-1 text-left">Liked Songs</span>
          <span className="text-[11px] font-mono text-muted-foreground/70">
            {likedSongIds.length}
          </span>
        </button>
      </div>

      <div className="px-6 my-3">
        <div className="h-px bg-border/60"></div>
      </div>

      {/* Curated Shortcuts & Custom Playlists */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4">
        {/* Featured Playlists Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
            <Flame className="w-3 h-3" /> Featured Playlists
          </p>
          <div className="space-y-0.5">
            {FEATURED_PLAYLISTS.slice(0, 5).map((pl) => (
              <button
                key={pl.id}
                onClick={() => navigateTo('playlist', pl.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate transition-colors flex items-center gap-2 ${
                  currentView === 'playlist' && activeId === pl.id
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <span>{pl.icon || '🎵'}</span>
                <span className="truncate">{pl.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Playlists */}
        {customPlaylists.length > 0 && (
          <div>
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <ListMusic className="w-3 h-3" /> My Playlists
            </p>
            <div className="space-y-0.5">
              {customPlaylists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => navigateTo('playlist', pl.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs truncate transition-colors flex items-center gap-2 ${
                    currentView === 'playlist' && activeId === pl.id
                      ? 'text-primary font-bold bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <span>{pl.icon || '🎵'}</span>
                  <span className="truncate">{pl.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Tag */}
      <div className="px-4 py-3 bg-muted/20 border-t border-border/60 text-center">
        <p className="text-[11px] text-muted-foreground">
          Premium <span className="text-primary font-bold">Music Streaming</span> 🎶
        </p>
      </div>
    </aside>
  );
};

