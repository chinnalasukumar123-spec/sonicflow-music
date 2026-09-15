import React from 'react';
import { Play, Shuffle, Heart, ArrowLeft, Share2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { SongRow } from '../cards/SongRow';
import { formatDuration } from '../../utils/formatters';

export const LikedSongsView: React.FC = () => {
  const { likedSongIds, findSongById, navigateTo, openShareModal } = useLibrary();
  const { playSong } = usePlayer();

  const likedSongs = likedSongIds
    .map(id => findSongById(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const totalDurationSecs = likedSongs.reduce((acc, curr) => acc + (curr.duration || 210), 0);

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  const handleShufflePlay = () => {
    if (likedSongs.length > 0) {
      const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
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

      {/* Liked Songs Hero Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-border/80">
        <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 border border-white/20">
          <Heart className="w-20 h-20 fill-white text-white drop-shadow-xl animate-pulse" />
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Auto-Saved Playlist
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-tight">
            Liked Songs
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            All your favorite tracks and hit songs in one place. Saved automatically on device.
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground font-mono pt-1">
            <span className="font-bold text-foreground">{likedSongs.length} songs</span>
            <span>•</span>
            <span>{formatDuration(totalDurationSecs)}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayAll}
          disabled={likedSongs.length === 0}
          className="px-6 py-3 rounded-full gradient-primary text-black font-extrabold text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-black" /> Play Liked Songs
        </button>

        <button
          onClick={handleShufflePlay}
          disabled={likedSongs.length === 0}
          className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Shuffle Liked Songs"
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={() => openShareModal({ title: 'My Liked Songs', subtitle: `${likedSongs.length} tracks`, type: 'playlist' })}
          className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tracks */}
      <div className="space-y-1">
        {likedSongs.length > 0 ? (
          likedSongs.map((song, idx) => (
            <SongRow key={song.id} song={song} index={idx} playlistContext={likedSongs} />
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground text-sm space-y-2">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className="text-base font-semibold text-foreground">Your Liked Songs list is empty</p>
            <p className="text-xs">Click the heart icon on any song or album to save it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};
