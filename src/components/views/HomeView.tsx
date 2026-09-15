import React from 'react';
import { Play, Sparkles, Flame, Mic2, Heart, ArrowRight } from 'lucide-react';
import { SONGS } from '../../data/songs';
import { ARTISTS } from '../../data/artists';
import { ALBUMS } from '../../data/albums';
import { FEATURED_PLAYLISTS } from '../../data/playlists';
import { SongCard } from '../cards/SongCard';
import { ArtistCard } from '../cards/ArtistCard';
import { AlbumCard } from '../cards/AlbumCard';
import { PlaylistCard } from '../cards/PlaylistCard';
import { usePlayer } from '../../context/PlayerContext';
import { useLibrary } from '../../context/LibraryContext';

export const HomeView: React.FC = () => {
  const { playSong, setIsLyricsOpen } = usePlayer();
  const { navigateTo, isSongLiked, toggleLikeSong, userName } = useLibrary();

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', sub: "Start your day with today's hottest global hits & energy" };
    if (hour < 17) return { text: 'Good afternoon', sub: 'Keep the momentum going with top chart-topping bangers' };
    return { text: 'Good evening', sub: 'Wind down with acoustic sessions, smooth R&B & chill vibes' };
  };
  const greeting = getGreeting();

  // Featured Spotlight Track
  const spotlightSong = SONGS[0]; // Blinding Lights - The Weeknd
  const likedSpotlight = isSongLiked(spotlightSong.id);

  const trendingHits = SONGS.filter(s => s.tag === 'Trending' || s.tag === 'Blockbuster');
  const popMelodies = SONGS.filter(s => (s.genre || '').toLowerCase().includes('pop') || (s.genre || '').toLowerCase().includes('soul') || s.tag === 'Classic');
  const highEnergy = SONGS.filter(s => (s.genre || '').toLowerCase().includes('rock') || (s.genre || '').toLowerCase().includes('hip-hop') || (s.genre || '').toLowerCase().includes('disco'));

  return (
    <div className="p-4 sm:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Greeting Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {greeting.text},{' '}
            <span className="text-gradient-primary">{userName}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{greeting.sub}</p>
        </div>

        <button
          onClick={() => navigateTo('search')}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 hover:bg-muted text-xs font-semibold text-foreground border border-border transition-all"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Featured Global Spotlight Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950/80 via-slate-900 to-rose-950/70 border border-border/80 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Global Spotlight of the Day
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
              {spotlightSong.title}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              The record-shattering global anthem from the blockbuster album <span className="font-semibold text-white">{spotlightSong.album}</span>. Performed by <span className="font-semibold text-white">{spotlightSong.artist}</span> with over {spotlightSong.plays} global streams.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => playSong(spotlightSong, SONGS)}
                className="px-6 py-3 rounded-full gradient-primary text-black font-extrabold text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-black" /> Play Now
              </button>

              <button
                onClick={() => {
                  playSong(spotlightSong, SONGS);
                  setIsLyricsOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md flex items-center gap-2 transition-all"
              >
                <Mic2 className="w-4 h-4 text-primary" /> View Live Lyrics
              </button>

              <button
                onClick={() => toggleLikeSong(spotlightSong.id)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all"
                title={likedSpotlight ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-5 h-5 ${likedSpotlight ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          <div className="relative group w-48 h-48 sm:w-60 sm:h-60 rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex-shrink-0">
            <img
              src={spotlightSong.coverUrl}
              alt={spotlightSong.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-primary font-bold">
              {spotlightSong.plays} Plays
            </div>
          </div>
        </div>
      </div>

      {/* Quick Picks 6-Card Grid */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span>⚡ Quick Picks</span>
          <span className="text-xs text-muted-foreground font-normal">Click to play instantly</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SONGS.slice(0, 6).map((song) => (
            <div
              key={song.id}
              onClick={() => playSong(song, SONGS)}
              className="glass-card rounded-xl p-2.5 flex items-center gap-3 cursor-pointer group hover:bg-muted/80 transition-all border border-border/60"
            >
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-foreground group-hover:text-primary truncate">
                  {song.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSong(song, SONGS);
                }}
                className="w-9 h-9 rounded-full gradient-primary text-black flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 mr-1"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 Trending Global Chartbusters */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Trending Global Chartbusters</h3>
              <p className="text-xs text-muted-foreground">Most played international hits right now</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('search')}
            className="text-xs text-primary hover:underline font-semibold"
          >
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingHits.slice(0, 5).map((song) => (
            <SongCard key={song.id} song={song} playlistContext={SONGS} />
          ))}
        </div>
      </section>

      {/* 👑 Top Global Superstars (Artists) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Top Artists & Superstars</h3>
            <p className="text-xs text-muted-foreground">Iconic singers, songwriters, and producers</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ARTISTS.slice(0, 6).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* 💖 Pop & Melodic Anthems */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Pop Glow & Heartfelt Anthems</h3>
              <p className="text-xs text-muted-foreground">Catchy pop hooks, acoustic romance, and soul melodies</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popMelodies.slice(0, 5).map((song) => (
            <SongCard key={song.id} song={song} playlistContext={SONGS} />
          ))}
        </div>
      </section>

      {/* ⚡ High-Energy Beats & Rock */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">High-Voltage Energy & Rock Hits</h3>
            <p className="text-xs text-muted-foreground">Electrifying rock, hip-hop flows, and synthwave anthems</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {highEnergy.slice(0, 5).map((song) => (
            <SongCard key={song.id} song={song} playlistContext={SONGS} />
          ))}
        </div>
      </section>

      {/* 📀 Featured Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Featured Playlists</h3>
            <p className="text-xs text-muted-foreground">Curated collections for every mood and moment</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FEATURED_PLAYLISTS.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      {/* 💿 Blockbuster Albums */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Blockbuster Albums</h3>
            <p className="text-xs text-muted-foreground">Full discography soundtracks and multi-platinum albums</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ALBUMS.slice(0, 5).map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

