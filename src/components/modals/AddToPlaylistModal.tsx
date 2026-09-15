import React from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const AddToPlaylistModal: React.FC = () => {
  const {
    isAddToPlaylistOpen,
    closeAddToPlaylist,
    songToAddToPlaylist,
    allPlaylists,
    getPlaylistSongs,
    addSongToPlaylist,
    removeSongFromPlaylist,
    setIsCreatePlaylistOpen
  } = useLibrary();

  if (!isAddToPlaylistOpen || !songToAddToPlaylist) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] border border-border/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">Add to Playlist</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[280px]">
              "{songToAddToPlaylist.title}"
            </p>
          </div>

          <button
            onClick={closeAddToPlaylist}
            className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {allPlaylists.map((pl) => {
            const songsInPl = getPlaylistSongs(pl.id);
            const inPlaylist = songsInPl.some(
              s => s.id === songToAddToPlaylist.id ||
              (s.youtubeVideoId && songToAddToPlaylist.youtubeVideoId && s.youtubeVideoId === songToAddToPlaylist.youtubeVideoId)
            );

            return (
              <div
                key={pl.id}
                onClick={() => {
                  if (inPlaylist) {
                    removeSongFromPlaylist(pl.id, songToAddToPlaylist.id);
                  } else {
                    addSongToPlaylist(pl.id, songToAddToPlaylist);
                  }
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xl">{pl.icon || '🎵'}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{pl.name}</p>
                      {pl.isCustom && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold bg-primary/20 text-primary rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{songsInPl.length} songs</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    inPlaylist ? 'bg-primary text-black' : 'border border-border text-transparent group-hover:border-primary/50'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            closeAddToPlaylist();
            setIsCreatePlaylistOpen(true);
          }}
          className="w-full py-2.5 rounded-xl bg-muted/60 hover:bg-muted border border-border text-xs font-bold text-foreground flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-primary" /> Create New Playlist
        </button>
      </div>
    </div>
  );
};
