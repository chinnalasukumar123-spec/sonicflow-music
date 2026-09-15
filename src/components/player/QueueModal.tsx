import React from 'react';
import { X, Trash2, Music, ListMusic, GripVertical } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/formatters';

export const QueueModal: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentSong,
    isQueueOpen,
    setIsQueueOpen,
    playSong,
    removeFromQueue,
    clearQueue
  } = usePlayer();

  if (!isQueueOpen) return null;

  const nowPlaying = currentSong;
  const upNext = queue.slice(queueIndex + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#0D1322] border-l border-border/80 h-full flex flex-col shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <ListMusic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Playback Queue</h3>
              <p className="text-xs text-muted-foreground">{queue.length} tracks in queue</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearQueue}
              className="p-2 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-muted/80 transition-all text-xs flex items-center gap-1 font-medium"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
            <button
              onClick={() => setIsQueueOpen(false)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Queue Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Now Playing Section */}
          {nowPlaying && (
            <div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Now Playing
              </h4>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/10 border border-primary/30">
                <img
                  src={nowPlaying.coverUrl}
                  alt={nowPlaying.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-primary truncate">{nowPlaying.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{nowPlaying.artist}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {formatTime(nowPlaying.duration)}
                </span>
              </div>
            </div>
          )}

          {/* Up Next List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Up Next ({upNext.length})
              </h4>
            </div>

            {upNext.length > 0 ? (
              <div className="space-y-1.5">
                {upNext.map((song, idx) => {
                  const actualQueueIndex = queueIndex + 1 + idx;
                  return (
                    <div
                      key={`${song.id}-${actualQueueIndex}`}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-all border border-transparent hover:border-border cursor-pointer"
                      onClick={() => playSong(song, queue)}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0" />
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary truncate">
                            {song.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {formatTime(song.duration)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(actualQueueIndex);
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove from queue"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-xs">
                <Music className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No more tracks in queue. Add songs from Top Hits or browse playlists!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
