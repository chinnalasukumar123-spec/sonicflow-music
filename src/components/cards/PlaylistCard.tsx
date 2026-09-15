import React from 'react';
import { Play, Music } from 'lucide-react';
import { Playlist } from '../../types/music';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { SONGS } from '../../data/songs';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { navigateTo } = useLibrary();
  const { playSong } = usePlayer();

  const handlePlayPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const playlistSongs = SONGS.filter(s => playlist.songIds.includes(s.id));
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const gradientClass = playlist.gradient ? `bg-gradient-to-br ${playlist.gradient}` : 'bg-gradient-to-br from-emerald-600 to-teal-800';

  return (
    <div
      onClick={() => navigateTo('playlist', playlist.id)}
      className="glass-card rounded-xl p-3.5 cursor-pointer group relative flex flex-col justify-between transition-all duration-300"
    >
      <div className={`relative mb-3 rounded-lg overflow-hidden aspect-square ${gradientClass} shadow-md flex items-center justify-center`}>
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-4xl filter drop-shadow-md">
            {playlist.icon || '🎵'}
          </div>
        )}

        <button
          onClick={handlePlayPlaylist}
          className="absolute right-3 bottom-3 w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-black shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
          title="Play Playlist"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
          {playlist.name}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {playlist.description}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 mt-2">
          <span className="flex items-center gap-1 font-mono">
            <Music className="w-3 h-3 text-primary" /> {playlist.songIds.length} tracks
          </span>
          {playlist.isCustom && (
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-primary/20 text-primary border border-primary/30">
              Custom
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
