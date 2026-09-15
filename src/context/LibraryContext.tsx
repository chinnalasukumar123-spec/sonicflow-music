import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Playlist, Song } from '../types/music';
import { FEATURED_PLAYLISTS } from '../data/playlists';
import { SONGS } from '../data/songs';
import confetti from 'canvas-confetti';

export type AppView = 'home' | 'search' | 'library' | 'playlist' | 'album' | 'artist' | 'liked-songs' | 'settings';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface ShareItem {
  id?: string;
  title: string;
  subtitle?: string;
  type: 'song' | 'playlist' | 'album' | 'artist';
}

interface LibraryContextType {
  likedSongIds: string[];
  customPlaylists: Playlist[];
  allPlaylists: Playlist[];
  recentlyPlayedSongIds: string[];
  followedArtistIds: string[];
  customSongs: Record<string, Song>;
  
  // Navigation
  currentView: AppView;
  activeId: string | null;
  searchQuery: string;
  activeGenreFilter: string;
  
  // Modals
  isCreatePlaylistOpen: boolean;
  isAddToPlaylistOpen: boolean;
  isAddSongOpen: boolean;
  targetAddSongPlaylistId: string | null;
  isShareOpen: boolean;
  isSettingsOpen: boolean;
  songToAddToPlaylist: Song | null;
  itemToShare: ShareItem | null;
  
  // Profile settings
  userName: string;
  audioQuality: string;
  setUserName: (name: string) => void;
  setAudioQuality: (quality: string) => void;
  
  // Toasts
  toasts: Toast[];
  
  // Actions
  toggleLikeSong: (songId: string) => void;
  isSongLiked: (songId: string) => boolean;
  createCustomPlaylist: (name: string, description: string) => Playlist;
  deleteCustomPlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songOrId: Song | string) => boolean;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  getPlaylistSongs: (playlistId: string) => Song[];
  findSongById: (songId: string) => Song | undefined;
  toggleFollowArtist: (artistId: string) => void;
  isArtistFollowed: (artistId: string) => boolean;
  
  navigateTo: (view: AppView, id?: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveGenreFilter: (genre: string) => void;
  
  setIsCreatePlaylistOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  openAddToPlaylist: (song: Song) => void;
  closeAddToPlaylist: () => void;
  openAddSong: (playlistId: string) => void;
  closeAddSong: () => void;
  openShareModal: (item: ShareItem) => void;
  closeShareModal: () => void;
  
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  resetAllData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

// Helper to parse hash
const parseHash = (): { view: AppView; id: string | null } => {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash) return { view: 'home', id: null };

  const parts = hash.split('/');
  const route = parts[0] as AppView;
  const id = parts[1] ? decodeURIComponent(parts[1]) : null;

  const validViews: AppView[] = ['home', 'search', 'library', 'playlist', 'album', 'artist', 'liked-songs', 'settings'];
  if (validViews.includes(route)) {
    return { view: route, id };
  }
  return { view: 'home', id: null };
};

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Liked songs
  const [likedSongIds, setLikedSongIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sonicflow_liked_songs');
    return saved ? JSON.parse(saved) : ['song-eng-01', 'song-eng-02', 'song-eng-03', 'song-eng-04', 'song-eng-06'];
  });

  // Custom songs registry (for YouTube & user-added songs)
  const [customSongs, setCustomSongs] = useState<Record<string, Song>>(() => {
    const saved = localStorage.getItem('sonicflow_custom_songs');
    return saved ? JSON.parse(saved) : {};
  });

  // Overrides for playlist song IDs (allows adding/removing songs from any playlist)
  const [playlistOverrides, setPlaylistOverrides] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('sonicflow_playlist_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  // Custom playlists
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('sonicflow_custom_playlists');
    return saved ? JSON.parse(saved) : [
      {
        id: 'custom-pl-01',
        name: 'My Daily Favorites',
        description: 'Personal collection of top global hits & anthems.',
        icon: '🎵',
        gradient: 'from-purple-600 to-rose-700',
        songIds: ['song-eng-01', 'song-eng-02', 'song-eng-03', 'song-eng-04'],
        isCustom: true,
        createdAt: '2026-09-09'
      }
    ];
  });

  // Followed artists
  const [followedArtistIds, setFollowedArtistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sonicflow_followed_artists');
    return saved ? JSON.parse(saved) : ['artist-eng-01', 'artist-eng-02', 'artist-eng-03'];
  });

  // Recently played
  const [recentlyPlayedSongIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sonicflow_recent');
    return saved ? JSON.parse(saved) : ['song-eng-01', 'song-eng-02', 'song-eng-03', 'song-eng-04'];
  });

  // User Profile Name & Audio Quality
  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem('sonicflow_username') || 'Sukumar';
  });

  const [audioQuality, setAudioQualityState] = useState<string>(() => {
    return localStorage.getItem('sonicflow_audio_quality') || '320kbps HD';
  });

  // Initial routing from hash
  const initialRoute = parseHash();
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [activeId, setActiveId] = useState<string | null>(initialRoute.id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGenreFilter, setActiveGenreFilter] = useState<string>('All');

  // Modals
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState<boolean>(false);
  const [isAddSongOpen, setIsAddSongOpen] = useState<boolean>(false);
  const [targetAddSongPlaylistId, setTargetAddSongPlaylistId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [songToAddToPlaylist, setSongToAddToPlaylist] = useState<Song | null>(null);
  const [itemToShare, setItemToShare] = useState<ShareItem | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync hash change listener for Browser Forward/Back
  useEffect(() => {
    const handleHashChange = () => {
      const { view, id } = parseHash();
      setCurrentView(view);
      setActiveId(id);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sonicflow_liked_songs', JSON.stringify(likedSongIds));
  }, [likedSongIds]);

  useEffect(() => {
    localStorage.setItem('sonicflow_custom_songs', JSON.stringify(customSongs));
  }, [customSongs]);

  useEffect(() => {
    localStorage.setItem('sonicflow_playlist_overrides', JSON.stringify(playlistOverrides));
  }, [playlistOverrides]);

  useEffect(() => {
    localStorage.setItem('sonicflow_custom_playlists', JSON.stringify(customPlaylists));
  }, [customPlaylists]);

  useEffect(() => {
    localStorage.setItem('sonicflow_followed_artists', JSON.stringify(followedArtistIds));
  }, [followedArtistIds]);

  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim() || 'Sukumar';
    setUserNameState(trimmed);
    localStorage.setItem('sonicflow_username', trimmed);
  }, []);

  const setAudioQuality = useCallback((q: string) => {
    setAudioQualityState(q);
    localStorage.setItem('sonicflow_audio_quality', q);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Find song helper from static SONGS + dynamic customSongs
  const findSongById = useCallback((songId: string): Song | undefined => {
    if (customSongs[songId]) {
      return customSongs[songId];
    }
    return SONGS.find(s => s.id === songId);
  }, [customSongs]);

  // Combined playlist list
  const allPlaylists: Playlist[] = [
    ...FEATURED_PLAYLISTS.map(fp => {
      const override = playlistOverrides[fp.id];
      return override ? { ...fp, songIds: override } : fp;
    }),
    ...customPlaylists
  ];

  // Helper to resolve all songs for a specific playlist
  const getPlaylistSongs = useCallback((playlistId: string): Song[] => {
    const playlist = allPlaylists.find(p => p.id === playlistId);
    if (!playlist) return [];

    const effectiveSongIds = playlistOverrides[playlistId] || playlist.songIds || [];
    const resolved: Song[] = [];

    for (const songId of effectiveSongIds) {
      const song = customSongs[songId] || SONGS.find(s => s.id === songId);
      if (song) {
        resolved.push(song);
      }
    }

    return resolved;
  }, [allPlaylists, playlistOverrides, customSongs]);

  const toggleLikeSong = useCallback((songId: string) => {
    setLikedSongIds(prev => {
      const exists = prev.includes(songId);
      if (exists) {
        showToast('Removed from Liked Songs', 'info');
        return prev.filter(id => id !== songId);
      } else {
        const song = findSongById(songId);
        showToast(`Added "${song ? song.title : 'Song'}" to Liked Songs`, 'success');
        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.9, x: 0.9 }
          });
        } catch {}
        return [songId, ...prev];
      }
    });
  }, [showToast, findSongById]);

  const isSongLiked = useCallback((songId: string) => {
    return likedSongIds.includes(songId);
  }, [likedSongIds]);

  const createCustomPlaylist = useCallback((name: string, description: string) => {
    const gradients = [
      'from-emerald-500 to-teal-700',
      'from-purple-600 to-indigo-800',
      'from-amber-500 to-rose-700',
      'from-cyan-500 to-blue-700',
      'from-pink-500 to-rose-600'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const icons = ['🎵', '🎶', '🔥', '✨', '🎧', '🎸', '🌟'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    const newPlaylist: Playlist = {
      id: `custom-pl-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description.trim() || 'Created with SonicFlow',
      icon: randomIcon,
      gradient: randomGradient,
      songIds: [],
      isCustom: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomPlaylists(prev => [newPlaylist, ...prev]);
    showToast(`Created playlist "${newPlaylist.name}"`, 'success');
    return newPlaylist;
  }, [showToast]);

  const deleteCustomPlaylist = useCallback((playlistId: string) => {
    setCustomPlaylists(prev => prev.filter(p => p.id !== playlistId));
    setPlaylistOverrides(prev => {
      const next = { ...prev };
      delete next[playlistId];
      return next;
    });
    showToast('Playlist deleted', 'info');
    if (currentView === 'playlist' && activeId === playlistId) {
      setCurrentView('library');
      setActiveId(null);
      window.location.hash = '#/library';
    }
  }, [currentView, activeId, showToast]);

  // Add song to any playlist (featured or custom)
  const addSongToPlaylist = useCallback((playlistId: string, songOrId: Song | string): boolean => {
    const targetPlaylist = allPlaylists.find(p => p.id === playlistId);
    if (!targetPlaylist) {
      showToast('Playlist not found', 'error');
      return false;
    }

    const currentSongs = getPlaylistSongs(playlistId);

    // Identify song object and ID
    let songToAdd: Song;
    let songId: string;

    if (typeof songOrId === 'string') {
      const found = findSongById(songOrId);
      if (!found) {
        showToast('Song not found', 'error');
        return false;
      }
      songToAdd = found;
      songId = songOrId;
    } else {
      songToAdd = songOrId;
      songId = songOrId.id;
    }

    // Duplicate Check: Check by ID and by youtubeVideoId
    const isDuplicate = currentSongs.some(s => {
      if (s.id === songId) return true;
      if (songToAdd.youtubeVideoId && s.youtubeVideoId && songToAdd.youtubeVideoId === s.youtubeVideoId) return true;
      return false;
    });

    if (isDuplicate) {
      showToast(`"${songToAdd.title}" is already in this playlist`, 'info');
      return false;
    }

    // If new song object, save into customSongs registry
    if (typeof songOrId !== 'string') {
      setCustomSongs(prev => ({
        ...prev,
        [songToAdd.id]: songToAdd
      }));
    }

    // If custom playlist, update customPlaylists state
    if (targetPlaylist.isCustom) {
      setCustomPlaylists(prev => prev.map(pl => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            songIds: [...pl.songIds, songId]
          };
        }
        return pl;
      }));
    } else {
      // If featured playlist, update playlistOverrides
      const existingIds = playlistOverrides[playlistId] || targetPlaylist.songIds || [];
      setPlaylistOverrides(prev => ({
        ...prev,
        [playlistId]: [...existingIds, songId]
      }));
    }

    showToast(`Added "${songToAdd.title}" to ${targetPlaylist.name}`, 'success');
    return true;
  }, [allPlaylists, getPlaylistSongs, findSongById, playlistOverrides, showToast]);

  // Remove song from any playlist
  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    const targetPlaylist = allPlaylists.find(p => p.id === playlistId);
    const playlistName = targetPlaylist ? targetPlaylist.name : 'Playlist';

    if (targetPlaylist?.isCustom) {
      setCustomPlaylists(prev => prev.map(pl => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            songIds: pl.songIds.filter(id => id !== songId)
          };
        }
        return pl;
      }));
    } else {
      const existingIds = playlistOverrides[playlistId] || targetPlaylist?.songIds || [];
      setPlaylistOverrides(prev => ({
        ...prev,
        [playlistId]: existingIds.filter(id => id !== songId)
      }));
    }

    showToast(`Removed song from ${playlistName}`, 'info');
  }, [allPlaylists, playlistOverrides, showToast]);

  const toggleFollowArtist = useCallback((artistId: string) => {
    setFollowedArtistIds(prev => {
      const exists = prev.includes(artistId);
      if (exists) {
        showToast('Unfollowed artist', 'info');
        return prev.filter(id => id !== artistId);
      } else {
        showToast('Artist added to your following!', 'success');
        return [...prev, artistId];
      }
    });
  }, [showToast]);

  const isArtistFollowed = useCallback((artistId: string) => {
    return followedArtistIds.includes(artistId);
  }, [followedArtistIds]);

  const navigateTo = useCallback((view: AppView, id: string | null = null) => {
    setCurrentView(view);
    setActiveId(id);
    const newHash = id ? `#/${view}/${encodeURIComponent(id)}` : `#/${view}`;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openAddToPlaylist = useCallback((song: Song) => {
    setSongToAddToPlaylist(song);
    setIsAddToPlaylistOpen(true);
  }, []);

  const closeAddToPlaylist = useCallback(() => {
    setSongToAddToPlaylist(null);
    setIsAddToPlaylistOpen(false);
  }, []);

  const openAddSong = useCallback((playlistId: string) => {
    setTargetAddSongPlaylistId(playlistId);
    setIsAddSongOpen(true);
  }, []);

  const closeAddSong = useCallback(() => {
    setTargetAddSongPlaylistId(null);
    setIsAddSongOpen(false);
  }, []);

  const openShareModal = useCallback((item: ShareItem) => {
    setItemToShare(item);
    setIsShareOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setItemToShare(null);
    setIsShareOpen(false);
  }, []);

  const resetAllData = useCallback(() => {
    localStorage.clear();
    setLikedSongIds(['song-eng-01', 'song-eng-02', 'song-eng-03', 'song-eng-04', 'song-eng-06']);
    setFollowedArtistIds(['artist-eng-01', 'artist-eng-02', 'artist-eng-03']);
    setCustomSongs({});
    setPlaylistOverrides({});
    setUserNameState('Sukumar');
    setAudioQualityState('320kbps HD');
    showToast('Reset data to defaults', 'info');
  }, [showToast]);

  return (
    <LibraryContext.Provider
      value={{
        likedSongIds,
        customPlaylists,
        allPlaylists,
        recentlyPlayedSongIds,
        followedArtistIds,
        customSongs,
        currentView,
        activeId,
        searchQuery,
        activeGenreFilter,
        isCreatePlaylistOpen,
        isAddToPlaylistOpen,
        isAddSongOpen,
        targetAddSongPlaylistId,
        isShareOpen,
        isSettingsOpen,
        songToAddToPlaylist,
        itemToShare,
        userName,
        audioQuality,
        setUserName,
        setAudioQuality,
        toasts,
        toggleLikeSong,
        isSongLiked,
        createCustomPlaylist,
        deleteCustomPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        getPlaylistSongs,
        findSongById,
        toggleFollowArtist,
        isArtistFollowed,
        navigateTo,
        setSearchQuery,
        setActiveGenreFilter,
        setIsCreatePlaylistOpen,
        setIsSettingsOpen,
        openAddToPlaylist,
        closeAddToPlaylist,
        openAddSong,
        closeAddSong,
        openShareModal,
        closeShareModal,
        showToast,
        removeToast,
        resetAllData
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
