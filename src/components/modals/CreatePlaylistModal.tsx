import React, { useState } from 'react';
import { X, Plus, Music } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const CreatePlaylistModal: React.FC = () => {
  const { isCreatePlaylistOpen, setIsCreatePlaylistOpen, createCustomPlaylist, navigateTo } = useLibrary();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newPlaylist = createCustomPlaylist(name, description);
    setName('');
    setDescription('');
    setIsCreatePlaylistOpen(false);
    navigateTo('playlist', newPlaylist.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] border border-border/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Create Playlist</h3>
              <p className="text-xs text-muted-foreground">Make your personalized English mixtape</p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatePlaylistOpen(false)}
            className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Playlist Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midnight Chill, Pop Anthems, Workout Energy"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a vibe or theme..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatePlaylistOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-xl gradient-primary text-black font-bold text-xs hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
