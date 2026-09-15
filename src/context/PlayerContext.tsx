import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Song, RepeatMode, EQPreset, LyricsLine } from '../types/music';
import { SONGS } from '../data/songs';

// Verified backup audio sources for local songs
const BACKUP_STREAMS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
];

// Extend window for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    __sonicflow_audio?: HTMLAudioElement;
    __sonicflow_yt_player?: any;
  }
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  queue: Song[];
  queueIndex: number;
  isLoading: boolean;
  currentLyricsLine: LyricsLine | null;
  lyricsIndex: number;
  eqPreset: EQPreset;
  sleepTimer: number | null;
  
  // YouTube player state
  isYouTubeTrack: boolean;
  showVideoEmbed: boolean;
  setShowVideoEmbed: (show: boolean) => void;
  ytError: string | null;
  clearYtError: () => void;
  
  // UI Modal toggles
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isEqualizerOpen: boolean;
  isSleepTimerOpen: boolean;
  
  // Actions
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seekTo: (seconds: number) => void;
  setVolumeLevel: (val: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (song: Song) => void;
  playNext: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  setEqPreset: (preset: EQPreset) => void;
  setSleepTimerDuration: (minutes: number | null) => void;
  
  setIsLyricsOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setIsEqualizerOpen: (open: boolean) => void;
  setIsSleepTimerOpen: (open: boolean) => void;
  
  audioLevels: number[];
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SONGS[0].duration);
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('sonicflow_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
    const saved = localStorage.getItem('sonicflow_repeat');
    return (saved as RepeatMode) || 'off';
  });
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>(SONGS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eqPreset, setEqPresetState] = useState<EQPreset>('flat');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);

  // YouTube States
  const [showVideoEmbed, setShowVideoEmbed] = useState<boolean>(false);
  const [ytError, setYtError] = useState<string | null>(null);

  // Modals
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState<boolean>(false);

  // Visualizer animated levels
  const [audioLevels, setAudioLevels] = useState<number[]>([12, 28, 45, 60, 35, 18, 50, 65, 40, 20]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytPollIntervalRef = useRef<any>(null);
  const pendingYtVideoIdRef = useRef<string | null>(null);
  const sleepTimerRef = useRef<any>(null);
  const visualizerIntervalRef = useRef<any>(null);
  const fallbackAttemptRef = useRef<number>(0);

  // Stable refs to prevent stale closures in event listeners
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  repeatModeRef.current = repeatMode;
  const queueRef = useRef<Song[]>(queue);
  queueRef.current = queue;
  const queueIndexRef = useRef<number>(queueIndex);
  queueIndexRef.current = queueIndex;
  const isShuffledRef = useRef<boolean>(isShuffled);
  isShuffledRef.current = isShuffled;
  const currentSongRef = useRef<Song | null>(currentSong);
  currentSongRef.current = currentSong;
  const isYouTubeTrack = Boolean(currentSong?.youtubeVideoId || currentSong?.source === 'youtube');
  const isYouTubeTrackRef = useRef<boolean>(isYouTubeTrack);
  isYouTubeTrackRef.current = isYouTubeTrack;

  // Forward declaration ref for playSong to break circular dependencies
  const playSongRef = useRef<((song: Song, newQueue?: Song[]) => void) | null>(null);

  const handleNextSongStable = useCallback(() => {
    const q = queueRef.current;
    const qIdx = queueIndexRef.current;
    if (q.length === 0) return;

    let nextIdx = qIdx + 1;
    if (isShuffledRef.current) {
      nextIdx = Math.floor(Math.random() * q.length);
    } else if (nextIdx >= q.length) {
      if (repeatModeRef.current === 'all') {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setQueueIndex(nextIdx);
    const nextTrack = q[nextIdx];
    if (nextTrack && playSongRef.current) {
      playSongRef.current(nextTrack, q);
    }
  }, []);

  // 1. Initialize HTML5 Audio element ONCE on mount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;
    window.__sonicflow_audio = audio;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && !isYouTubeTrackRef.current) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (!isYouTubeTrackRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleWaiting = () => {
      if (!isYouTubeTrackRef.current) setIsLoading(true);
    };

    const handleCanPlay = () => {
      if (!isYouTubeTrackRef.current) setIsLoading(false);
    };

    const handlePlaying = () => {
      if (!isYouTubeTrackRef.current) {
        setIsLoading(false);
        setIsPlaying(true);
        fallbackAttemptRef.current = 0;
      }
    };

    const handleEnded = () => {
      if (!isYouTubeTrackRef.current) {
        if (repeatModeRef.current === 'one') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          handleNextSongStable();
        }
      }
    };

    const handleError = () => {
      if (!isYouTubeTrackRef.current) {
        console.warn('Audio playback note: Checking backup stream source...');
        setIsLoading(false);
        if (fallbackAttemptRef.current < BACKUP_STREAMS.length) {
          const nextFallback = BACKUP_STREAMS[fallbackAttemptRef.current];
          fallbackAttemptRef.current += 1;
          audio.src = nextFallback;
          audio.load();
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [handleNextSongStable]);

  // 2. Initialize Official YouTube IFrame Player API
  useEffect(() => {
    const initYTPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        const playerElement = document.getElementById('sonicflow-global-yt-iframe');
        if (!playerElement) return;

        ytPlayerRef.current = new window.YT.Player('sonicflow-global-yt-iframe', {
          height: '100%',
          width: '100%',
          videoId: '',
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              window.__sonicflow_yt_player = event.target;
              event.target.setVolume(Math.round(volume * 100));

              // If there was a pending song video to play
              if (pendingYtVideoIdRef.current) {
                const vid = pendingYtVideoIdRef.current;
                pendingYtVideoIdRef.current = null;
                event.target.loadVideoById(vid);
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
              if (event.data === 1) { // PLAYING
                setIsPlaying(true);
                setIsLoading(false);
                setYtError(null);
                const dur = event.target.getDuration();
                if (dur && !isNaN(dur) && dur > 0) {
                  setDuration(dur);
                }
              } else if (event.data === 2) { // PAUSED
                setIsPlaying(false);
                setIsLoading(false);
              } else if (event.data === 3) { // BUFFERING
                setIsLoading(true);
              } else if (event.data === 0) { // ENDED
                setIsLoading(false);
                if (repeatModeRef.current === 'one') {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } else {
                  handleNextSongStable();
                }
              }
            },
            onError: (event: any) => {
              setIsLoading(false);
              const errorCode = event.data;
              console.warn('YouTube Player Error:', errorCode);
              if (errorCode === 101 || errorCode === 150 || errorCode === 100) {
                setYtError('This YouTube video has playback restrictions and cannot be embedded. Click to open on YouTube.');
              } else {
                setYtError('Unable to play this YouTube track.');
              }
            }
          }
        });
      } catch (err) {
        console.warn('YouTube Player initialization note:', err);
      }
    };

    // If script not loaded yet, inject it
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initYTPlayer();
      };
    } else {
      initYTPlayer();
    }

    return () => {
      if (ytPollIntervalRef.current) clearInterval(ytPollIntervalRef.current);
    };
  }, []);

  // 3. Real-time YouTube Time Poller
  useEffect(() => {
    if (isYouTubeTrack && isPlaying) {
      ytPollIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          try {
            const time = ytPlayerRef.current.getCurrentTime();
            if (typeof time === 'number' && !isNaN(time)) {
              setCurrentTime(time);
            }
            const dur = ytPlayerRef.current.getDuration();
            if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
              setDuration(dur);
            }
          } catch {}
        }
      }, 250);
    } else {
      if (ytPollIntervalRef.current) clearInterval(ytPollIntervalRef.current);
    }

    return () => {
      if (ytPollIntervalRef.current) clearInterval(ytPollIntervalRef.current);
    };
  }, [isYouTubeTrack, isPlaying]);

  // 4. Sleep Timer
  useEffect(() => {
    if (sleepTimer !== null && sleepTimer > 0) {
      sleepTimerRef.current = setTimeout(() => {
        setSleepTimer(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    } else if (sleepTimer === 0) {
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
      setIsPlaying(false);
      setSleepTimer(null);
    }
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, [sleepTimer]);

  // 5. Visualizer Bar Animation
  useEffect(() => {
    if (isPlaying) {
      visualizerIntervalRef.current = setInterval(() => {
        setAudioLevels([
          Math.floor(10 + Math.random() * 55),
          Math.floor(20 + Math.random() * 60),
          Math.floor(30 + Math.random() * 65),
          Math.floor(15 + Math.random() * 75),
          Math.floor(25 + Math.random() * 70),
          Math.floor(10 + Math.random() * 50),
          Math.floor(35 + Math.random() * 65),
          Math.floor(20 + Math.random() * 80),
          Math.floor(15 + Math.random() * 60),
          Math.floor(10 + Math.random() * 45),
        ]);
      }, 100);
    } else {
      if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
      setAudioLevels([10, 15, 20, 25, 20, 15, 20, 25, 15, 10]);
    }
    return () => {
      if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    };
  }, [isPlaying]);

  // 6. Play Song Action
  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(song.duration || 210);
    setYtError(null);
    fallbackAttemptRef.current = 0;

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(s => s.id === song.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const idx = queue.findIndex(s => s.id === song.id);
      if (idx >= 0) {
        setQueueIndex(idx);
      } else {
        setQueue(prev => [song, ...prev]);
        setQueueIndex(0);
      }
    }

    const isYT = Boolean(song.youtubeVideoId || song.source === 'youtube');

    // A. YouTube Track
    if (isYT && song.youtubeVideoId) {
      // Pause HTML5 audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Play via YouTube IFrame API
      if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
        try {
          ytPlayerRef.current.loadVideoById(song.youtubeVideoId);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch (e) {
          console.warn('YouTube load error:', e);
        }
      } else {
        pendingYtVideoIdRef.current = song.youtubeVideoId;
      }
    } else {
      // B. HTML5 Audio Track
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {}
      }

      if (audioRef.current && song.audioUrl) {
        audioRef.current.pause();
        audioRef.current.src = song.audioUrl;
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((err) => {
              console.warn('Playback initiation note:', err);
              setIsLoading(false);
            });
        }
      }
    }
  }, [queue]);

  playSongRef.current = playSong;

  // 7. Toggle Play/Pause
  const togglePlay = useCallback(() => {
    if (!currentSong) return;

    const isYT = Boolean(currentSong.youtubeVideoId || currentSong.source === 'youtube');

    if (isYT) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
        const state = ytPlayerRef.current.getPlayerState();
        if (state === 1) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(prev => !prev);
      }
    } else {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          const p = audioRef.current.play();
          if (p !== undefined) {
            p.then(() => setIsPlaying(true)).catch(() => {});
          }
        }
      }
    }
  }, [currentSong, isPlaying]);

  // 8. Next Song
  const nextSong = useCallback(() => {
    handleNextSongStable();
  }, [handleNextSongStable]);

  // 9. Seek To
  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);

    if (isYouTubeTrack) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
        ytPlayerRef.current.seekTo(seconds, true);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = seconds;
      }
    }
  }, [isYouTubeTrack]);

  // 10. Previous Song
  const prevSong = useCallback(() => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    const q = queueRef.current;
    const qIdx = queueIndexRef.current;
    if (q.length === 0) return;
    let prevIdx = qIdx - 1;
    if (prevIdx < 0) {
      prevIdx = repeatModeRef.current === 'all' ? q.length - 1 : 0;
    }

    setQueueIndex(prevIdx);
    const prevTrack = q[prevIdx];
    if (prevTrack) {
      playSong(prevTrack, q);
    }
  }, [currentTime, playSong, seekTo]);

  // 11. Volume & Mute
  const setVolumeLevel = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    localStorage.setItem('sonicflow_volume', clamped.toString());

    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }

    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      ytPlayerRef.current.setVolume(Math.round(clamped * 100));
      if (clamped > 0 && typeof ytPlayerRef.current.unMute === 'function') {
        ytPlayerRef.current.unMute();
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const nextMute = !prev;
      if (audioRef.current) {
        audioRef.current.muted = nextMute;
      }

      if (ytPlayerRef.current) {
        if (nextMute && typeof ytPlayerRef.current.mute === 'function') {
          ytPlayerRef.current.mute();
        } else if (!nextMute && typeof ytPlayerRef.current.unMute === 'function') {
          ytPlayerRef.current.unMute();
        }
      }
      return nextMute;
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      const next: RepeatMode = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      localStorage.setItem('sonicflow_repeat', next);
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const playNext = useCallback((song: Song) => {
    setQueue(prev => {
      const copy = [...prev];
      copy.splice(queueIndex + 1, 0, song);
      return copy;
    });
  }, [queueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, idx) => idx !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  }, [queueIndex]);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setQueue(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  const setEqPreset = useCallback((preset: EQPreset) => {
    setEqPresetState(preset);
  }, []);

  const setSleepTimerDuration = useCallback((minutes: number | null) => {
    if (minutes === null) {
      setSleepTimer(null);
    } else {
      setSleepTimer(minutes * 60);
    }
  }, []);

  const clearYtError = useCallback(() => {
    setYtError(null);
  }, []);

  // Compute live synchronized lyric line
  const lyricsIndex = (currentSong?.lyrics || []).reduce((acc, line, idx) => {
    if (currentTime >= line.time) {
      return idx;
    }
    return acc;
  }, 0);

  const currentLyricsLine = currentSong?.lyrics && currentSong.lyrics.length > 0
    ? currentSong.lyrics[lyricsIndex]
    : null;

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        isShuffled,
        queue,
        queueIndex,
        isLoading,
        currentLyricsLine,
        lyricsIndex,
        eqPreset,
        sleepTimer,
        isYouTubeTrack,
        showVideoEmbed,
        setShowVideoEmbed,
        ytError,
        clearYtError,
        isLyricsOpen,
        isQueueOpen,
        isEqualizerOpen,
        isSleepTimerOpen,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seekTo,
        setVolumeLevel,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        addToQueue,
        playNext,
        removeFromQueue,
        reorderQueue,
        clearQueue,
        setEqPreset,
        setSleepTimerDuration,
        setIsLyricsOpen,
        setIsQueueOpen,
        setIsEqualizerOpen,
        setIsSleepTimerOpen,
        audioLevels
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
