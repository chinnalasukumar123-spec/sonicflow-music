import React from 'react';
import { Home, Search, Library, Heart, Mic2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';

export const MobileNav: React.FC = () => {
  const { currentView, navigateTo } = useLibrary();
  const { setIsLyricsOpen, currentSong } = usePlayer();

  return (
    <div className="md:hidden fixed bottom-24 left-0 right-0 h-14 bg-[#0A0E1A]/95 backdrop-blur-xl border-t border-border/80 z-30 flex items-center justify-around px-2">
      <button
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
          currentView === 'home' ? 'text-primary font-bold' : 'text-muted-foreground'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => navigateTo('search')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
          currentView === 'search' ? 'text-primary font-bold' : 'text-muted-foreground'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
      </button>

      {currentSong && (
        <button
          onClick={() => setIsLyricsOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium text-amber-400"
        >
          <Mic2 className="w-4 h-4" />
          <span>Lyrics</span>
        </button>
      )}

      <button
        onClick={() => navigateTo('library')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
          currentView === 'library' ? 'text-primary font-bold' : 'text-muted-foreground'
        }`}
      >
        <Library className="w-4 h-4" />
        <span>Library</span>
      </button>

      <button
        onClick={() => navigateTo('liked-songs')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
          currentView === 'liked-songs' ? 'text-rose-400 font-bold' : 'text-muted-foreground'
        }`}
      >
        <Heart className="w-4 h-4" />
        <span>Liked</span>
      </button>
    </div>
  );
};
