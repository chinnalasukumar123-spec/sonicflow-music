import React from 'react';
import { Home, Search, Library, Heart, Plus } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';

export const MobileNav: React.FC = () => {
  const { currentView, navigateTo, setIsCreatePlaylistOpen } = useLibrary();
  const { currentSong } = usePlayer();

  // The MobileNav sits at the very bottom, BELOW the player bar on mobile
  // It is only shown when there is NO current song (player bar replaces it when playing)
  // Actually we always show it so the user can navigate. It stacks under the player.

  return (
    <div
      className={`md:hidden fixed left-0 right-0 bg-[#080D1A]/98 backdrop-blur-2xl border-t border-border/80 z-30 flex items-center justify-around px-1 safe-area-bottom ${
        currentSong
          ? 'bottom-[calc(var(--mobile-player-height,120px))]'
          : 'bottom-0'
      }`}
      style={{
        bottom: currentSong ? 'var(--mobile-player-offset, 136px)' : 0,
        height: '52px',
      }}
    >
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-semibold transition-all active:scale-90 ${
          currentView === 'home'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'fill-primary/20' : ''}`} />
        <span>Home</span>
      </button>

      <button
        onClick={() => navigateTo('search')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-semibold transition-all active:scale-90 ${
          currentView === 'search'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Search className="w-5 h-5" />
        <span>Search</span>
      </button>

      <button
        onClick={() => setIsCreatePlaylistOpen(true)}
        className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-semibold transition-all active:scale-90 text-muted-foreground hover:text-primary"
        title="Create New Playlist"
      >
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-0.5">
          <Plus className="w-4 h-4 text-primary" />
        </div>
      </button>

      <button
        onClick={() => navigateTo('library')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-semibold transition-all active:scale-90 ${
          currentView === 'library'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Library className="w-5 h-5" />
        <span>Library</span>
      </button>

      <button
        onClick={() => navigateTo('liked-songs')}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-semibold transition-all active:scale-90 ${
          currentView === 'liked-songs'
            ? 'text-rose-400'
            : 'text-muted-foreground hover:text-rose-400'
        }`}
      >
        <Heart className={`w-5 h-5 ${currentView === 'liked-songs' ? 'fill-rose-400/20' : ''}`} />
        <span>Liked</span>
      </button>
    </div>
  );
};
