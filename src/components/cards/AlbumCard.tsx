import React from 'react';
import { Play, Disc3 } from 'lucide-react';
import { Album } from '../../types/music';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { SONGS } from '../../data/songs';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const { navigateTo } = useLibrary();
  const { playSong } = usePlayer();

  const handlePlayAlbum = (e: React.MouseEvent) => {
    e.stopPropagation();
    const albumSongs = SONGS.filter(s => s.albumId === album.id);
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  return (
    <div
      onClick={() => navigateTo('album', album.id)}
      className="glass-card rounded-xl p-3 cursor-pointer group relative flex flex-col justify-between transition-all duration-300"
    >
      <div className="relative mb-3 rounded-lg overflow-hidden aspect-square bg-muted/40 shadow-md">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <button
          onClick={handlePlayAlbum}
          className="absolute right-3 bottom-3 w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-black shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
          title="Play Album"
        >
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
          {album.title}
        </h4>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {album.artistName}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 mt-1">
          <span>{album.releaseYear}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Disc3 className="w-3 h-3 text-primary" /> {album.songCount} songs
          </span>
        </div>
      </div>
    </div>
  );
};
