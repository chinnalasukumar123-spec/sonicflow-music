import React, { useMemo } from 'react';
import { Search, Music, X } from 'lucide-react';
import { SONGS } from '../../data/songs';
import { ARTISTS } from '../../data/artists';
import { ALBUMS } from '../../data/albums';
import { SongRow } from '../cards/SongRow';
import { ArtistCard } from '../cards/ArtistCard';
import { AlbumCard } from '../cards/AlbumCard';
import { useLibrary } from '../../context/LibraryContext';

const GENRE_CATEGORIES = [
  { id: 'All', label: 'All Songs', color: 'from-emerald-500 to-teal-700' },
  { id: 'Pop', label: '🔥 Pop Hits & Dance', color: 'from-pink-500 to-rose-600' },
  { id: 'Synth-Pop', label: '🌙 Synthwave & 80s Retro', color: 'from-cyan-500 to-blue-700' },
  { id: 'Rock', label: '🎸 Rock & Alternative', color: 'from-amber-500 to-red-600' },
  { id: 'Hip-Hop', label: '👑 Hip-Hop & Rap', color: 'from-purple-600 to-indigo-800' },
  { id: 'Soul', label: '✨ R&B & Soul Ballads', color: 'from-violet-600 to-purple-800' },
  { id: 'Acoustic', label: '☕ Acoustic & Indie Pop', color: 'from-teal-500 to-emerald-700' },
  { id: 'Trending', label: '⚡ Top Chartbusters', color: 'from-orange-500 to-amber-700' },
  { id: 'Classic', label: '🏆 All-Time Classics', color: 'from-blue-600 to-cyan-800' },
];

export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeGenreFilter,
    setActiveGenreFilter
  } = useLibrary();

  // Filter songs based on search query and active genre
  const filteredSongs = useMemo(() => {
    let result = SONGS;

    if (activeGenreFilter !== 'All') {
      if (activeGenreFilter === 'Trending') {
        result = result.filter(s => s.tag === 'Trending' || s.tag === 'Blockbuster');
      } else if (activeGenreFilter === 'Classic') {
        result = result.filter(s => s.tag === 'Classic');
      } else {
        result = result.filter(s =>
          (s.genre || '').toLowerCase().includes(activeGenreFilter.toLowerCase()) ||
          (s.tag && s.tag.toLowerCase().includes(activeGenreFilter.toLowerCase()))
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.album || '').toLowerCase().includes(q) ||
        (s.producer && s.producer.toLowerCase().includes(q)) ||
        (s.singers && s.singers.some(singer => singer.toLowerCase().includes(q))) ||
        (s.genre || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeGenreFilter]);

  // Filter artists
  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ARTISTS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.genre.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter albums
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ALBUMS.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.artistName.toLowerCase().includes(q) ||
      a.genre.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Search Header Bar */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-foreground">Search & Explore</h1>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by song, artist (The Weeknd, Taylor Swift, Billie Eilish), album, or genre..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-muted/80 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            autoFocus
          />
          {hasSearch && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Genre / Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveGenreFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeGenreFilter === cat.id
                  ? 'bg-primary text-black border-primary font-bold shadow-md shadow-primary/20 scale-105'
                  : 'bg-muted/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* When Search Query is active */}
      {hasSearch && (
        <div className="space-y-8">
          {/* Top Result Card & Matching Songs */}
          {filteredSongs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Songs ({filteredSongs.length})</h3>
              <div className="space-y-1">
                {filteredSongs.map((song, idx) => (
                  <SongRow key={song.id} song={song} index={idx} playlistContext={filteredSongs} />
                ))}
              </div>
            </div>
          )}

          {/* Matching Artists */}
          {filteredArtists.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Artists ({filteredArtists.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Matching Albums */}
          {filteredAlbums.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Albums & Soundtracks ({filteredAlbums.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </div>
          )}

          {filteredSongs.length === 0 && filteredArtists.length === 0 && filteredAlbums.length === 0 && (
            <div className="text-center py-16 text-muted-foreground space-y-3">
              <p className="text-lg font-semibold text-foreground">No matches found for "{searchQuery}"</p>
              <p className="text-sm">Try searching for "Taylor Swift", "The Weeknd", "Billie Eilish", "Blinding Lights", or "Pop"</p>
            </div>
          )}
        </div>
      )}

      {/* When No Search Query: Browse All Categories Cards */}
      {!hasSearch && (
        <div className="space-y-8">
          {/* Active Filtered Song Grid if filter selected */}
          {activeGenreFilter !== 'All' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center justify-between">
                <span>{GENRE_CATEGORIES.find(c => c.id === activeGenreFilter)?.label} ({filteredSongs.length})</span>
                <button
                  onClick={() => setActiveGenreFilter('All')}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Clear filter
                </button>
              </h3>
              <div className="space-y-1">
                {filteredSongs.map((song, idx) => (
                  <SongRow key={song.id} song={song} index={idx} playlistContext={filteredSongs} />
                ))}
              </div>
            </div>
          )}

          {/* Browse Categories Big Colorful Tiles */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Browse Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {GENRE_CATEGORIES.filter(c => c.id !== 'All').map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveGenreFilter(cat.id)}
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${cat.color} cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all overflow-hidden h-32 flex flex-col justify-between`}
                >
                  <span className="font-extrabold text-base text-white drop-shadow-md">
                    {cat.label}
                  </span>
                  <div className="self-end p-2 bg-black/20 rounded-full backdrop-blur-sm">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Top Hits Tracklist Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span>🌟 Complete Global Hit Tracklist</span>
            </h3>
            <div className="space-y-1">
              {SONGS.map((song, idx) => (
                <SongRow key={song.id} song={song} index={idx} playlistContext={SONGS} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

