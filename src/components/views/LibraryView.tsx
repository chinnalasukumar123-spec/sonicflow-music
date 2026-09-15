import React, { useState } from 'react';
import { Plus, Heart, User, Clock, Trash2, ListMusic } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { SONGS } from '../../data/songs';
import { ARTISTS } from '../../data/artists';
import { PlaylistCard } from '../cards/PlaylistCard';
import { ArtistCard } from '../cards/ArtistCard';
import { SongRow } from '../cards/SongRow';

export const LibraryView: React.FC = () => {
  const {
    customPlaylists,
    allPlaylists,
    likedSongIds,
    followedArtistIds,
    recentlyPlayedSongIds,
    setIsCreatePlaylistOpen,
    navigateTo,
    deleteCustomPlaylist
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'artists' | 'history'>('playlists');

  const likedSongs = SONGS.filter(s => likedSongIds.includes(s.id));
  const followedArtists = ARTISTS.filter(a => followedArtistIds.includes(a.id));
  const recentSongs = recentlyPlayedSongIds.map(id => SONGS.find(s => s.id === id)).filter(Boolean) as typeof SONGS;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Your Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Playlists, favorites, followed artists and listening history
          </p>
        </div>

        <button
          onClick={() => setIsCreatePlaylistOpen(true)}
          className="px-4 py-2.5 rounded-full gradient-primary text-black font-bold text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Playlist
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'playlists'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Playlists ({allPlaylists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'liked'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked Songs ({likedSongs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'artists'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Followed Artists ({followedArtists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-primary/20 text-primary border border-primary/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recently Played</span>
        </button>
      </div>

      {/* Tab: Playlists */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          {/* Custom Playlists */}
          {customPlaylists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                My Created Playlists
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {customPlaylists.map((pl) => (
                  <div key={pl.id} className="relative group">
                    <PlaylistCard playlist={pl} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete playlist "${pl.name}"?`)) {
                          deleteCustomPlaylist(pl.id);
                        }
                      }}
                      className="absolute top-5 right-5 p-1.5 rounded-lg bg-black/70 text-muted-foreground hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10"
                      title="Delete playlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured & Curated Playlists */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Featured Collections
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allPlaylists.filter(p => !p.isCustom).map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Liked Songs */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Your Liked Tracks</h3>
            <button
              onClick={() => navigateTo('liked-songs')}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Open Full Liked Page
            </button>
          </div>

          {likedSongs.length > 0 ? (
            <div className="space-y-1">
              {likedSongs.map((song, idx) => (
                <SongRow key={song.id} song={song} index={idx} playlistContext={likedSongs} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm space-y-2">
              <Heart className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <p>You haven't liked any songs yet.</p>
              <p className="text-xs">Click the heart icon on any song to save it here!</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Followed Artists */}
      {activeTab === 'artists' && (
        <div className="space-y-4">
          {followedArtists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {followedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No followed artists yet. Discover superstars like Taylor Swift, The Weeknd, or Eminem!
            </div>
          )}
        </div>
      )}

      {/* Tab: Listening History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Recently Played</h3>
          {recentSongs.length > 0 ? (
            <div className="space-y-1">
              {recentSongs.map((song, idx) => (
                <SongRow key={song.id} song={song} index={idx} playlistContext={recentSongs} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Your recent listening history will appear here.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
