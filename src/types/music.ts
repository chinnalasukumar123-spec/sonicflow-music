export interface LyricsLine {
  time: number; // in seconds
  text: string;
  leadArtist?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  singers?: string[];
  producer?: string;
  musicDirector?: string;
  album?: string;
  albumId?: string;
  releaseYear?: number;
  duration: number; // in seconds
  coverUrl: string;
  thumbnail?: string; // alias
  audioUrl?: string; // optional for YouTube songs
  youtubeVideoId?: string;
  source?: 'local' | 'youtube';
  addedAt?: string;
  channelTitle?: string;
  genre?: string;
  language?: string;
  explicit?: boolean;
  plays?: string;
  lyrics?: LyricsLine[];
  tag?: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt?: string;
  description?: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseYear: number;
  songCount: number;
  genre: string;
  language: string;
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  followers: string;
  monthlyListeners: string;
  verified: boolean;
  bio: string;
  topSongs: string[]; // Song IDs
  albums: string[]; // Album IDs
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  icon?: string;
  gradient?: string;
  songIds: string[];
  isCustom?: boolean;
  createdAt?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';
export type EQPreset = 'flat' | 'bass-boost' | 'vocal' | 'electronic' | 'acoustic' | 'rock-punch' | 'club-dance';
export type AudioQuality = '128kbps' | '256kbps' | '320kbps' | 'FLAC Lossless';

