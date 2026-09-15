import React from 'react';
import { Play, Heart, MoreHorizontal, ListPlus, Radio, Share2 } from 'lucide-react';
import { Song } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import { formatTime } from '../../utils/formatters';
import { YouTubeIcon } from '../icons/YouTubeIcon';

interface SongRowProps {
  song: Song;
  index: number;
  playlistContext?: Song[];
  showAlbum?: boolean;
}

export const SongRow: React.FC<SongRowProps> = ({ song, index, playlistContext, showAlbum = true }) => {
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue, playNext } = usePlayer();
  const { isSongLiked, toggleLikeSong, openAddToPlaylist, openShareModal, navigateTo } = useLibrary();

  const isCurrent = currentSong?.id === song.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const liked = isSongLiked(song.id);
  const isYT = Boolean(song.youtubeVideoId || song.source === 'youtube');

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer border border-transparent ${
        isCurrent
          ? 'bg-primary/10 border-primary/20 text-primary font-medium'
          : 'hover:bg-muted/60 text-foreground'
      }`}
    >
      {/* Left: Index / Play Icon / Song details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-7 flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground font-mono">
          {isCurrentPlaying ? (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-primary rounded-full animate-sound-wave" style={{ animationDelay: '0s' }}></span>
              <span className="w-1 bg-accent rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 bg-primary rounded-full animate-sound-wave" style={{ animationDelay: '0.4s' }}></span>
            </div>
          ) : (
            <>
              <span className="group-hover:hidden">{index + 1}</span>
              <Play className="w-4 h-4 hidden group-hover:block text-foreground fill-current ml-0.5" />
            </>
          )}
        </div>

        {/* Cover */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted shadow-sm">
          <img
            src={song.thumbnail || song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isYT && (
            <span className="absolute bottom-0 right-0 px-1 py-0.2 text-[8px] font-extrabold bg-red-600 text-white rounded-tl">
              YT
            </span>
          )}
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <p className={`text-sm truncate font-semibold ${isCurrent ? 'text-primary' : 'text-foreground group-hover:text-white'}`}>
              {song.title}
            </p>
            {isYT && (
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-0.5 flex-shrink-0">
                <YouTubeIcon className="w-2.5 h-2.5" /> YouTube
              </span>
            )}
            {song.explicit && (
              <span className="px-1 py-0.5 text-[9px] font-bold uppercase rounded bg-muted text-muted-foreground border border-border">
                E
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (song.artistId) navigateTo('artist', song.artistId);
              }}
              className="hover:underline hover:text-foreground cursor-pointer truncate"
            >
              {song.artist}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Album */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 px-4 text-xs text-muted-foreground truncate">
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (song.albumId) navigateTo('album', song.albumId);
            }}
            className="hover:underline hover:text-foreground cursor-pointer"
          >
            {song.album || (isYT ? 'YouTube Single' : 'SonicFlow Release')}
          </span>
        </div>
      )}

      {/* Plays count */}
      <div className="hidden lg:block w-24 text-right text-xs text-muted-foreground font-mono">
        {song.plays || '1.2M'}
      </div>

      {/* Right: Actions & Duration */}
      <div className="flex items-center gap-2.5 ml-3 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLikeSong(song.id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            liked ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100'
          }`}
          title={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
        </button>

        <span className="text-xs text-muted-foreground font-mono w-10 text-right">
          {formatTime(song.duration || 210)}
        </span>

        {/* More Options Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-card border border-border shadow-xl py-1.5 z-50 animate-fadeIn"
            >
              <button
                onClick={() => {
                  addToQueue(song);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/80 flex items-center gap-2.5 transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5 text-muted-foreground" /> Add to Queue
              </button>
              <button
                onClick={() => {
                  playNext(song);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/80 flex items-center gap-2.5 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-muted-foreground" /> Play Next
              </button>
              <button
                onClick={() => {
                  openAddToPlaylist(song);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/80 flex items-center gap-2.5 transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5 text-muted-foreground" /> Add to Playlist...
              </button>
              <button
                onClick={() => {
                  openShareModal({ title: song.title, subtitle: song.artist, type: 'song' });
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted/80 flex items-center gap-2.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-muted-foreground" /> Share Track
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
