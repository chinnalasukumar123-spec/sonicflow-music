import React from 'react';
import { Play, CheckCircle2, UserPlus, UserCheck, ArrowLeft, Share2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { ARTISTS } from '../../data/artists';
import { SONGS } from '../../data/songs';
import { ALBUMS } from '../../data/albums';
import { SongRow } from '../cards/SongRow';
import { AlbumCard } from '../cards/AlbumCard';

interface ArtistViewProps {
  artistId: string;
}

export const ArtistView: React.FC<ArtistViewProps> = ({ artistId }) => {
  const { navigateTo, isArtistFollowed, toggleFollowArtist, openShareModal } = useLibrary();
  const { playSong } = usePlayer();

  const artist = ARTISTS.find(a => a.id === artistId);

  if (!artist) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Artist Not Found</h2>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 rounded-xl gradient-primary text-black font-bold text-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const followed = isArtistFollowed(artist.id);
  const artistSongs = SONGS.filter(s => s.artistId === artist.id || (s.singers && s.singers.some(singer => singer.includes(artist.name))));
  const artistAlbums = ALBUMS.filter(a => a.artistId === artist.id || a.artistName.includes(artist.name));

  const handlePlayArtist = () => {
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], artistSongs);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-10 max-w-7xl mx-auto">
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Artist Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-border/80 p-6 sm:p-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 shadow-2xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-2xl flex-shrink-0 border-4 border-border/60">
          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
          {artist.verified && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 fill-primary text-black" /> Verified Artist
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-tight truncate">
            {artist.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {artist.bio}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground font-mono pt-1">
            <span className="font-bold text-foreground">{artist.followers} followers</span>
            <span>•</span>
            <span className="text-primary font-bold">{artist.monthlyListeners} monthly listeners</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-3">
            <button
              onClick={handlePlayArtist}
              disabled={artistSongs.length === 0}
              className="px-6 py-2.5 rounded-full gradient-primary text-black font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Play Top Tracks
            </button>

            <button
              onClick={() => toggleFollowArtist(artist.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                followed
                  ? 'bg-primary/20 text-primary border border-primary/50'
                  : 'bg-muted/80 hover:bg-muted text-foreground border border-border'
              }`}
            >
              {followed ? (
                <>
                  <UserCheck className="w-4 h-4" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Follow
                </>
              )}
            </button>

            <button
              onClick={() => openShareModal({ id: artist.id, title: artist.name, subtitle: `${artist.followers} followers`, type: 'artist' })}
              className="p-2.5 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all"
              title="Share Artist"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Popular Tracks</h3>
        <div className="space-y-1">
          {artistSongs.map((song, idx) => (
            <SongRow key={song.id} song={song} index={idx} playlistContext={artistSongs} />
          ))}
        </div>
      </section>

      {/* Discography Albums */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Discography & Soundtracks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artistAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
