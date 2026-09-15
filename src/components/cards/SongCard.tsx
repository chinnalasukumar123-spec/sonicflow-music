import React from 'react';
import { Play, Pause, Heart, Plus, Share2 } from 'lucide-react';
import { Song } from '../../types/music';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import { YouTubeIcon } from '../icons/YouTubeIcon';

interface SongCardProps {
  song: Song;
  playlistContext?: Song[];
}

export const SongCard: React.FC<SongCardProps> = ({ song, playlistContext }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const { isSongLiked, toggleLikeSong, openAddToPlaylist, openShareModal, navigateTo } = useLibrary();

  const isCurrent = currentSong?.id === song.id;
  const isCurrentPlaying = isCurrent && isPlaying;
  const liked = isSongLiked(song.id);
  const isYT = Boolean(song.youtubeVideoId || song.source === 'youtube');

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext);
    }
  };

  return (
    <div className="glass-card rounded-xl p-3 cursor-pointer group relative flex flex-col justify-between transition-all duration-300">
      <div className="relative mb-3 rounded-lg overflow-hidden aspect-square bg-muted/40 shadow-md">
        <img
          src={song.thumbnail || song.coverUrl}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Tag or YouTube Badge */}
        {isYT ? (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-600 text-white shadow-sm flex items-center gap-1">
            <YouTubeIcon className="w-3 h-3" /> YouTube
          </div>
        ) : song.tag ? (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/90 text-black backdrop-blur-md shadow-sm">
            {song.tag}
          </div>
        ) : null}

        {/* Play Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`absolute right-3 bottom-3 w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-black shadow-lg transition-all duration-300 transform ${
            isCurrentPlaying
              ? 'opacity-100 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 scale-95 group-hover:scale-100'
          } hover:scale-110 active:scale-95`}
          aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Playing Animated Indicator */}
        {isCurrentPlaying && (
          <div className="absolute top-2 right-2 flex items-end gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
            <div className="w-1 bg-primary rounded-full animate-sound-wave" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 bg-accent rounded-full animate-sound-wave" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 bg-primary rounded-full animate-sound-wave" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <h4
              onClick={handleCardClick}
              className={`font-semibold text-sm truncate hover:underline ${
                isCurrent ? 'text-primary font-bold' : 'text-foreground'
              }`}
            >
              {song.title}
            </h4>
            <p
              onClick={(e) => {
                e.stopPropagation();
                if (song.artistId) navigateTo('artist', song.artistId);
              }}
              className="text-xs text-muted-foreground truncate hover:text-foreground hover:underline mt-0.5"
            >
              {song.artist}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLikeSong(song.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                liked ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openAddToPlaylist(song);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Add to Playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openShareModal({ title: song.title, subtitle: song.artist, type: 'song' });
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
