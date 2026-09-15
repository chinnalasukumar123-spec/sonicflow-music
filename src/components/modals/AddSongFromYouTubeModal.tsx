import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Plus,
  Check,
  Loader2,
  Key,
  ExternalLink,
  Sparkles,
  Music2,
  AlertCircle
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import {
  searchYouTube,
  formatYouTubeSong,
  getStoredYouTubeApiKey,
  setStoredYouTubeApiKey
} from '../../services/youtube';
import { YouTubeSearchResult } from '../../types/music';
import { YouTubeIcon } from '../icons/YouTubeIcon';

export const AddSongFromYouTubeModal: React.FC = () => {
  const {
    isAddSongOpen,
    closeAddSong,
    targetAddSongPlaylistId,
    allPlaylists,
    getPlaylistSongs,
    addSongToPlaylist
  } = useLibrary();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredYouTubeApiKey());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const searchInputRef = useRef<HTMLInputElement>(null);

  const targetPlaylist = allPlaylists.find(p => p.id === targetAddSongPlaylistId);
  const existingPlaylistSongs = targetAddSongPlaylistId
    ? getPlaylistSongs(targetAddSongPlaylistId)
    : [];

  useEffect(() => {
    if (isAddSongOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      setAddedIds(new Set());
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 100);

      // Perform initial search with trending rock/pop if on rock playlist
      if (targetAddSongPlaylistId === 'pl-eng-rock-alt') {
        handleSearch('Linkin Park');
      } else {
        handleSearch('Top Hits');
      }
    }
  }, [isAddSongOpen, targetAddSongPlaylistId]);

  if (!isAddSongOpen || !targetPlaylist) return null;

  const handleSearch = async (searchQuery?: string) => {
    const term = (searchQuery !== undefined ? searchQuery : query).trim();
    if (!term) return;

    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchYouTube(term, apiKey);
      setResults(response.results);
      if (response.error && response.results.length === 0) {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search YouTube.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleAdd = (result: YouTubeSearchResult) => {
    if (!targetAddSongPlaylistId) return;

    const formattedSong = formatYouTubeSong(result, targetAddSongPlaylistId);
    const success = addSongToPlaylist(targetAddSongPlaylistId, formattedSong);

    if (success) {
      setAddedIds(prev => new Set(prev).add(result.videoId));
    }
  };

  const isSongInPlaylist = (videoId: string) => {
    if (addedIds.has(videoId)) return true;
    return existingPlaylistSongs.some(s => s.youtubeVideoId === videoId);
  };

  const handleSaveApiKey = () => {
    setStoredYouTubeApiKey(apiKey);
    setShowApiKeyInput(false);
    if (query) handleSearch();
  };

  const SUGGESTED_SEARCHES = [
    'Linkin Park Numb',
    'Queen Bohemian Rhapsody',
    'Imagine Dragons Believer',
    'Nirvana Smells Like Teen Spirit',
    'Coldplay Paradise'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-[#0B1120] border border-border/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/10">
              <YouTubeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-foreground">
                  Add Song from YouTube
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                  Official API
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Adding to <span className="text-primary font-semibold">{targetPlaylist.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeAddSong}
            className="p-2 rounded-full bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Controls */}
        <div className="p-4 sm:p-6 pb-3 space-y-3 bg-muted/20 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search song or artist name (e.g. Linkin Park Numb) or paste YouTube link..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#111A2E] border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 active:scale-95 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Search</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px] font-semibold flex-shrink-0">
              <Sparkles className="w-3 h-3 text-amber-400" /> Suggestions:
            </span>
            {SUGGESTED_SEARCHES.map(s => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 text-[11px] whitespace-nowrap transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Optional API Key Toggle */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
            >
              <Key className="w-3 h-3" />
              <span>{apiKey ? 'API Key Configured ✓' : 'Custom YouTube API Key (Optional)'}</span>
            </button>

            <span className="text-[10px] text-muted-foreground/60">
              Plays in-app via YouTube IFrame Player API
            </span>
          </div>

          {showApiKeyInput && (
            <div className="p-3 rounded-xl bg-[#111A2E] border border-border/80 space-y-2 animate-fadeIn">
              <label className="block text-[11px] font-semibold text-muted-foreground">
                YouTube Data API v3 Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Paste AIzaSy... API key here"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-lg gradient-primary text-black font-bold text-xs"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              <p className="text-sm font-medium">Searching YouTube videos...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && results.length === 0 && !error && (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <Music2 className="w-10 h-10 mx-auto opacity-30 text-red-400" />
              <p className="text-sm font-semibold text-foreground">Search for any song on YouTube</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Type an artist, song title, or paste a YouTube URL to find and add real YouTube tracks.
              </p>
            </div>
          )}

          {!isLoading &&
            results.map((item, idx) => {
              const inPlaylist = isSongInPlaylist(item.videoId);

              return (
                <div
                  key={`${item.videoId}-${idx}`}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border/50 hover:border-border transition-all gap-3 group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black shadow-md border border-white/10">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[8px] font-extrabold bg-red-600 text-white rounded">
                      YT
                    </span>
                  </div>

                  {/* Title & Channel */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-red-400 transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                      <span className="truncate">{item.channelTitle}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-muted-foreground/60 truncate">
                        ID: {item.videoId}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`https://www.youtube.com/watch?v=${item.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-muted/80 transition-colors hidden sm:flex"
                      title="Watch on YouTube (External)"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleAdd(item)}
                      disabled={inPlaylist}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                        inPlaylist
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-red-600 hover:bg-red-500 text-white hover:scale-105 active:scale-95 shadow-red-600/20'
                      }`}
                    >
                      {inPlaylist ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-black/40 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>{results.length} results found</span>
          <button
            onClick={closeAddSong}
            className="px-4 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
