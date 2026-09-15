import React, { useEffect, useRef } from 'react';
import { X, Mic2, Music, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const LyricsDrawer: React.FC = () => {
  const { currentSong, isLyricsOpen, setIsLyricsOpen, lyricsIndex, seekTo, isPlaying } = usePlayer();
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active lyric line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [lyricsIndex]);

  if (!isLyricsOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070B14]/95 backdrop-blur-2xl flex flex-col transition-all duration-300 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20 text-primary">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              Live Synchronized Lyrics
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Real-Time Sync
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentSong.title} — {currentSong.artist}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 items-center">
        {/* Left: Album Artwork & Metadata */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/3 max-w-sm text-center">
          <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border border-border/60 mb-6 group">
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
            />
            {currentSong.tag && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-black shadow-lg">
                {currentSong.tag}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-foreground">{currentSong.title}</h2>
          <p className="text-sm text-primary font-semibold mt-1">{currentSong.artist}</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">{currentSong.album} ({currentSong.releaseYear})</p>
        </div>

        {/* Right: Lyrics Lines Stream */}
        <div className="flex-1 w-full h-full overflow-y-auto pr-4 space-y-6 py-12 scroll-smooth text-center md:text-left">
          {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
            currentSong.lyrics.map((line, idx) => {
              const isActive = idx === lyricsIndex;
              const isPast = idx < lyricsIndex;
              const lyricText = line.text || '';

              return (
                <div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seekTo(line.time)}
                  className={`cursor-pointer transition-all duration-300 transform rounded-2xl p-4 ${
                    isActive
                      ? 'scale-105 bg-primary/15 border-l-4 border-primary pl-6 text-white shadow-lg'
                      : isPast
                      ? 'text-muted-foreground/50 hover:text-muted-foreground hover:scale-101'
                      : 'text-muted-foreground/40 hover:text-muted-foreground/80 hover:scale-101'
                  }`}
                >
                  <p
                    className={`text-xl md:text-3xl font-extrabold tracking-wide transition-colors ${
                      isActive ? 'text-primary drop-shadow-[0_0_16px_rgba(29,185,84,0.5)]' : ''
                    }`}
                  >
                    {lyricText}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16 space-y-4">
              <div className="p-4 rounded-full bg-muted/60 text-muted-foreground">
                <Music className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                Instrumental / Lyrics Coming Soon
              </h4>
              <p className="text-sm max-w-md">
                Enjoy the high-definition audio experience of "{currentSong.title}".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

