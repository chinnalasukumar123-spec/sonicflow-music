import React from 'react';
import { Play, Shuffle, Music, Trash2, ArrowLeft, Share2, Plus } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { SongRow } from '../cards/SongRow';
import { formatDuration } from '../../utils/formatters';
import { YouTubeIcon } from '../icons/YouTubeIcon';

interface PlaylistViewProps {
  playlistId: string;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlistId }) => {
  const {
    allPlaylists,
    getPlaylistSongs,
    openAddSong,
    removeSongFromPlaylist,
    navigateTo,
    deleteCustomPlaylist,
    openShareModal
  } = useLibrary();

  const { playSong } = usePlayer();

  const playlist = allPlaylists.find(p => p.id === playlistId);

  if (!playlist) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Playlist Not Found</h2>
        <button
          onClick={() => navigateTo('library')}
          className="px-4 py-2 rounded-xl gradient-primary text-black font-bold text-xs"
        >
          Back to Library
        </button>
      </div>
    );
  }

  // Resolve playlist songs including custom and YouTube tracks
  const playlistSongs = getPlaylistSongs(playlistId);
  const totalDurationSecs = playlistSongs.reduce((acc, curr) => acc + (curr.duration || 210), 0);

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  const handleShufflePlay = () => {
    if (playlistSongs.length > 0) {
      const shuffled = [...playlistSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  const gradientClass = playlist.gradient
    ? `bg-gradient-to-br ${playlist.gradient}`
    : 'bg-gradient-to-br from-emerald-600 to-teal-800';

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('library')}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </button>

      {/* Playlist Hero Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-border/80">
        <div
          className={`w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 flex items-center justify-center ${gradientClass} border border-white/20 relative group`}
        >
          {playlist.coverUrl ? (
            <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl drop-shadow-lg">{playlist.icon || '🎵'}</span>
          )}
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {playlist.isCustom ? 'Custom Playlist' : 'Featured Playlist'}
            </span>
            {playlistSongs.some(s => s.source === 'youtube') && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                <YouTubeIcon className="w-3 h-3" /> YouTube Tracks
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-tight truncate">
            {playlist.name}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">{playlist.description}</p>
          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground font-mono pt-1">
            <span className="font-bold text-foreground">{playlistSongs.length} songs</span>
            <span>•</span>
            <span>{formatDuration(totalDurationSecs)}</span>
          </div>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePlayAll}
            disabled={playlistSongs.length === 0}
            className="px-6 py-3 rounded-full gradient-primary text-black font-extrabold text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-black" /> Play All
          </button>

          <button
            onClick={handleShufflePlay}
            disabled={playlistSongs.length === 0}
            className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            title="Shuffle Play"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Add Song from YouTube Button */}
          <button
            onClick={() => openAddSong(playlist.id)}
            className="px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 transition-all"
            title="Search and Add Song from YouTube"
          >
            <Plus className="w-4 h-4" />
            <YouTubeIcon className="w-4 h-4" />
            <span>Add Song</span>
          </button>

          <button
            onClick={() =>
              openShareModal({
                title: playlist.name,
                subtitle: `${playlistSongs.length} tracks`,
                type: 'playlist'
              })
            }
            className="p-3 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all"
            title="Share Playlist"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {playlist.isCustom && (
          <button
            onClick={() => {
              if (confirm(`Delete playlist "${playlist.name}"?`)) {
                deleteCustomPlaylist(playlist.id);
              }
            }}
            className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-all border border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" /> Delete Playlist
          </button>
        )}
      </div>

      {/* Songs Table */}
      <div className="space-y-1">
        {playlistSongs.length > 0 ? (
          playlistSongs.map((song, idx) => (
            <div key={song.id} className="relative group">
              <SongRow
                song={song}
                index={idx}
                playlistContext={playlistSongs}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSongFromPlaylist(playlist.id, song.id);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from playlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-muted-foreground text-sm space-y-4 rounded-2xl border border-dashed border-border/60 p-8">
            <Music className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <div className="space-y-1">
              <p className="text-base font-bold text-foreground">This playlist is empty</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Search and add real YouTube tracks or global chart-toppers to build your custom playlist.
              </p>
            </div>
            <button
              onClick={() => openAddSong(playlist.id)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all hover:scale-105"
            >
              <YouTubeIcon className="w-4 h-4" />
              <span>Add Songs from YouTube</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
