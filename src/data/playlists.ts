import { Playlist } from '../types/music';

export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-eng-top-hits',
    name: "Today's Top Hits",
    description: 'The hottest tracks on the planet right now. Global chart-toppers, viral smashes & pop anthems.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop&q=80',
    icon: '🔥',
    gradient: 'from-amber-500 via-rose-600 to-purple-700',
    songIds: [
      'song-eng-01',
      'song-eng-02',
      'song-eng-03',
      'song-eng-04',
      'song-eng-06',
      'song-eng-07',
      'song-eng-08',
      'song-eng-10',
      'song-eng-11',
      'song-eng-17',
      'song-eng-18',
      'song-eng-19'
    ]
  },
  {
    id: 'pl-eng-pop-glow',
    name: 'Pop Glow & Dancefloor Bangers',
    description: 'High-energy pop, irresistible dance hooks, and pure feel-good anthems from Dua Lipa, Sabrina Carpenter, Bruno Mars.',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=500&fit=crop&q=80',
    icon: '✨',
    gradient: 'from-pink-500 via-purple-600 to-indigo-800',
    songIds: [
      'song-eng-04',
      'song-eng-08',
      'song-eng-19',
      'song-eng-21',
      'song-eng-02',
      'song-eng-01',
      'song-eng-05',
      'song-eng-18'
    ]
  },
  {
    id: 'pl-eng-chill-vibes',
    name: 'Chill & Acoustic Sessions',
    description: 'Laid-back acoustic gems, soothing vocals, and late-night indie relaxations. Ed Sheeran, Billie Eilish, Adele.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=500&fit=crop&q=80',
    icon: '☕',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-800',
    songIds: [
      'song-eng-03',
      'song-eng-05',
      'song-eng-20',
      'song-eng-16',
      'song-eng-06',
      'song-eng-07',
      'song-eng-11',
      'song-eng-22'
    ]
  },
  {
    id: 'pl-eng-rock-alt',
    name: 'Rock & Alternative Anthems',
    description: 'Stadium-shaking rock, electrifying energy, and powerful anthems from Imagine Dragons, Coldplay, and more.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop&q=80',
    icon: '⚡',
    gradient: 'from-red-600 via-orange-600 to-amber-700',
    songIds: [
      'song-eng-13',
      'song-eng-24',
      'song-eng-14',
      'song-eng-07',
      'song-eng-12',
      'song-eng-22'
    ]
  },
  {
    id: 'pl-eng-hiphop-rnb',
    name: 'Hip-Hop & Urban Essentials',
    description: 'Heavy beats, iconic lyrical flows, and smooth modern R&B. Eminem, Post Malone, Kendrick Lamar, The Weeknd.',
    coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop&q=80',
    icon: '👑',
    gradient: 'from-purple-600 via-indigo-700 to-slate-900',
    songIds: [
      'song-eng-09',
      'song-eng-15',
      'song-eng-23',
      'song-eng-22',
      'song-eng-17',
      'song-eng-01',
      'song-eng-10'
    ]
  },
  {
    id: 'pl-eng-retro-synth',
    name: 'Midnight Neon & Synthwave',
    description: 'Glowing 80s synthesizers, retrofuturistic basslines, and atmospheric midnight driving tunes.',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop&q=80',
    icon: '🌙',
    gradient: 'from-cyan-500 via-blue-600 to-violet-900',
    songIds: [
      'song-eng-01',
      'song-eng-10',
      'song-eng-02',
      'song-eng-07',
      'song-eng-17',
      'song-eng-18',
      'song-eng-04'
    ]
  }
];

