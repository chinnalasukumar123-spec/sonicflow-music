import React from 'react';
import { Play, ArrowLeft, Share2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { ALBUMS } from '../../data/albums';
import { SONGS } from '../../data/songs';
import { SongRow } from '../cards/SongRow';
import { formatDuration } from '../../utils/formatters';

interface AlbumViewProps {
  albumId: string;
}

export const AlbumView: React.FC<AlbumViewProps> = ({ albumId }) => {
  const { navigateTo, openShareModal } = useLibrary();
  const { playSong } = usePlayer();

  const album = ALBUMS.find(a => a.id === albumId);

  if (!album) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Album Not Found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 rounded-xl gradient-primary text-black font-bold text-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const albumSongs = SONGS.filter(s => s.albumId === album.id);
  const totalDurationSecs = albumSongs.reduce((acc, curr) => acc + curr.duration, 0);

  const handlePlayAll = () => {
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-border/80">
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/20">
          <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Album
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-tight truncate">
            {album.title}
          </h1>
          <p
            onClick={() => album.artistId && navigateTo('artist', album.artistId)}
            className="text-sm font-semibold text-foreground hover:text-primary hover:underline cursor-pointer"
          >
            {album.artistName}
          </p>
          {album.description && (
            <p className="text-xs text-muted-foreground max-w-2xl">{album.description}</p>
          )}
          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground font-mono pt-1">
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span className="font-bold text-foreground">{albumSongs.length} tracks</span>
            <span>•</span>
            <span>{formatDuration(totalDurationSecs)}</span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayAll}
          disabled={albumSongs.length === 0}
          className="px-6 py-3 rounded-full gradient-primary text-black font-extrabold text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-black" /> Play Album
        </button>

        <button
          onClick={() => openShareModal({ title: album.title, subtitle: album.artistName, type: 'album' })}
          className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all"
          title="Share Album"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tracks */}
      <div className="space-y-1">
        {albumSongs.map((song, idx) => (
          <SongRow key={song.id} song={song} index={idx} playlistContext={albumSongs} showAlbum={false} />
        ))}
      </div>
    </div>
  );
};
