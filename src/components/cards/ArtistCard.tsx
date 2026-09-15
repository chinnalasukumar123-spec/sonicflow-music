import React from 'react';
import { CheckCircle2, UserCheck, UserPlus } from 'lucide-react';
import { Artist } from '../../types/music';
import { useLibrary } from '../../context/LibraryContext';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { navigateTo, isArtistFollowed, toggleFollowArtist } = useLibrary();
  const followed = isArtistFollowed(artist.id);

  return (
    <div
      onClick={() => navigateTo('artist', artist.id)}
      className="glass-card rounded-2xl p-4 cursor-pointer group flex flex-col items-center text-center transition-all duration-300"
    >
      <div className="relative mb-3.5 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg border-2 border-border group-hover:border-primary transition-all duration-300">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {artist.verified && (
          <div className="absolute bottom-1.5 right-1.5 bg-primary text-black p-1 rounded-full shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5 fill-black text-primary" />
          </div>
        )}
      </div>

      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-full">
        {artist.name}
      </h4>

      <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-full">
        {artist.genre}
      </p>
      <p className="text-[10px] text-muted-foreground/80 font-mono mt-1">
        {artist.monthlyListeners} monthly
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFollowArtist(artist.id);
        }}
        className={`mt-3 px-3 py-1 text-xs rounded-full font-medium transition-all duration-200 flex items-center gap-1.5 ${
          followed
            ? 'bg-primary/20 text-primary border border-primary/40'
            : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
        }`}
      >
        {followed ? (
          <>
            <UserCheck className="w-3 h-3" /> Following
          </>
        ) : (
          <>
            <UserPlus className="w-3 h-3" /> Follow
          </>
        )}
      </button>
    </div>
  );
};
