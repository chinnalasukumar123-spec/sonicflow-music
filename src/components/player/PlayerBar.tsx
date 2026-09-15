import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  Volume2,
  VolumeX,
  Volume1,
  Mic2,
  ListMusic,
  Sliders,
  Timer,
  Heart,
  Maximize2,
  Tv,
  ExternalLink,
  AlertTriangle,
  X
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';
import { formatTime } from '../../utils/formatters';
import { YouTubeIcon } from '../icons/YouTubeIcon';

export const PlayerBar: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isShuffled,
    isLoading,
    isYouTubeTrack,
    showVideoEmbed,
    setShowVideoEmbed,
    ytError,
    clearYtError,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueOpen,
    setIsQueueOpen,
    isEqualizerOpen,
    setIsEqualizerOpen,
    isSleepTimerOpen,
    setIsSleepTimerOpen,
    sleepTimer,
    audioLevels
  } = usePlayer();

  const { isSongLiked, toggleLikeSong, navigateTo } = useLibrary();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  if (!currentSong) return null;

  const liked = isSongLiked(currentSong.id);
  const totalDuration = duration || currentSong.duration || 210;
  const progressPercent = totalDuration > 0 ? ((isSeeking ? seekValue : currentTime) / totalDuration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setIsSeeking(false);
    const target = e.currentTarget as HTMLInputElement;
    seekTo(parseFloat(target.value));
  };

  return (
    <>
      {/* Unembeddable YouTube Error Toast Alert */}
      {ytError && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-[#1E1B4B] border border-amber-500/50 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-lg animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="flex-1">{ytError}</span>
          {currentSong.youtubeVideoId && (
            <a
              href={`https://www.youtube.com/watch?v=${currentSong.youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 flex-shrink-0"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={clearYtError}
            className="p-1 text-muted-foreground hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Mini Video Popup when showVideoEmbed is toggled */}
      {isYouTubeTrack && showVideoEmbed && (
        <div className="fixed bottom-28 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden bg-black/90 border border-white/20 shadow-2xl animate-fadeIn">
          <div className="p-2 bg-black/60 flex items-center justify-between text-xs text-white px-3">
            <div className="flex items-center gap-1.5 font-bold">
              <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
              <span className="truncate max-w-[200px]">{currentSong.title}</span>
            </div>
            <button
              onClick={() => setShowVideoEmbed(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="aspect-video w-full bg-black flex items-center justify-center">
            {/* The global iframe container is docked here when showVideoEmbed is true */}
            <p className="text-[11px] text-muted-foreground">YouTube IFrame Engine Playing</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#0D1322]/95 backdrop-blur-2xl border-t border-border/80 z-40 px-3 sm:px-6 flex items-center justify-between shadow-2xl">
        {/* Left: Track Thumbnail & Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[320px]">
          <div
            onClick={() => setIsLyricsOpen(true)}
            className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md flex-shrink-0 group cursor-pointer border border-border/60"
          >
            <img
              src={currentSong.thumbnail || currentSong.coverUrl}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-5 h-5 text-white" />
            </div>
            {isYouTubeTrack && (
              <span className="absolute bottom-0 right-0 px-1 py-0.2 text-[8px] font-extrabold bg-red-600 text-white rounded-tl">
                YT
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4
                onClick={() => setIsLyricsOpen(true)}
                className="font-bold text-sm text-foreground truncate hover:underline cursor-pointer"
              >
                {currentSong.title}
              </h4>
              {isYouTubeTrack && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 rounded flex-shrink-0">
                  YouTube
                </span>
              )}
            </div>
            <p
              onClick={() => currentSong.artistId && navigateTo('artist', currentSong.artistId)}
              className="text-xs text-muted-foreground truncate hover:text-foreground hover:underline cursor-pointer"
            >
              {currentSong.artist}
            </p>
          </div>

          <button
            onClick={() => toggleLikeSong(currentSong.id)}
            className="p-2 text-muted-foreground hover:text-rose-500 transition-colors flex-shrink-0"
            title={liked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Middle: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center max-w-[620px] w-full px-2 sm:px-6">
          {/* Buttons */}
          <div className="flex items-center gap-4 sm:gap-6 mb-1.5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-lg transition-colors ${
                isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={isShuffled ? 'Shuffle: On' : 'Shuffle: Off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={prevSong}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors hover:scale-110 active:scale-95"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-transform ${
                isYouTubeTrack ? 'bg-red-500 text-white hover:bg-red-400' : 'gradient-primary'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={nextSong}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors hover:scale-110 active:scale-95"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded-lg transition-colors relative ${
                repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              {repeatMode !== 'off' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </button>
          </div>

          {/* Progress Slider & Time */}
          <div className="flex items-center gap-3 w-full text-xs text-muted-foreground font-mono">
            <span className="w-9 text-right">{formatTime(isSeeking ? seekValue : currentTime)}</span>

            <div className="relative flex-1 flex items-center group cursor-pointer py-1">
              {/* Visualizer background bars behind seeker */}
              <div className="absolute inset-0 flex items-center justify-between opacity-20 pointer-events-none px-1 overflow-hidden">
                {audioLevels.map((lvl, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isYouTubeTrack ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ height: isPlaying ? `${Math.min(18, Math.max(4, lvl / 4))}px` : '4px' }}
                  ></div>
                ))}
              </div>

              <input
                type="range"
                min={0}
                max={totalDuration || 100}
                step={0.5}
                value={isSeeking ? seekValue : currentTime}
                onChange={handleSeekChange}
                onMouseDown={handleSeekStart}
                onTouchStart={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer group-hover:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, ${isYouTubeTrack ? '#EF4444' : '#1DB954'} ${progressPercent}%, #1E293B ${progressPercent}%)`
                }}
              />
            </div>

            <span className="w-9 text-left">{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Right: Sound, Visualizer, Lyrics, Queue, EQ, Sleep Timer */}
        <div className="hidden lg:flex items-center justify-end gap-2.5 w-1/4 min-w-[200px]">
          {/* YouTube Mini Video Toggle */}
          {isYouTubeTrack && (
            <button
              onClick={() => setShowVideoEmbed(!showVideoEmbed)}
              className={`p-2 rounded-xl transition-all ${
                showVideoEmbed
                  ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              }`}
              title="Toggle Video Player"
            >
              <Tv className="w-4 h-4" />
            </button>
          )}

          {/* Lyrics Button */}
          <button
            onClick={() => setIsLyricsOpen(!isLyricsOpen)}
            className={`p-2 rounded-xl transition-all ${
              isLyricsOpen
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title="Karaoke Synced Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue Button */}
          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`p-2 rounded-xl transition-all ${
              isQueueOpen
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title="Up Next Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Equalizer Button */}
          <button
            onClick={() => setIsEqualizerOpen(!isEqualizerOpen)}
            className={`p-2 rounded-xl transition-all ${
              isEqualizerOpen
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title="Audio Equalizer & Presets"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sleep Timer Button */}
          <button
            onClick={() => setIsSleepTimerOpen(!isSleepTimerOpen)}
            className={`p-2 rounded-xl transition-all relative ${
              sleepTimer !== null
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title={sleepTimer ? `Sleep Timer: ${Math.ceil(sleepTimer / 60)}m left` : 'Sleep Timer'}
          >
            <Timer className="w-4 h-4" />
            {sleepTimer !== null && (
              <span className="absolute -top-1 -right-1 px-1 rounded-full text-[9px] font-bold bg-amber-500 text-black">
                {Math.ceil(sleepTimer / 60)}m
              </span>
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-muted rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${isYouTubeTrack ? '#EF4444' : '#1DB954'} ${(isMuted ? 0 : volume) * 100}%, #1E293B ${(isMuted ? 0 : volume) * 100}%)`
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
