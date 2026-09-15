import React from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { PlayerBar } from './components/player/PlayerBar';
import { LyricsDrawer } from './components/player/LyricsDrawer';
import { QueueModal } from './components/player/QueueModal';
import { EqualizerModal } from './components/player/EqualizerModal';
import { SleepTimerModal } from './components/player/SleepTimerModal';
import { CreatePlaylistModal } from './components/modals/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/modals/AddToPlaylistModal';
import { AddSongFromYouTubeModal } from './components/modals/AddSongFromYouTubeModal';
import { ShareModal } from './components/modals/ShareModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ToastContainer } from './components/modals/ToastContainer';

import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { LibraryView } from './components/views/LibraryView';
import { PlaylistView } from './components/views/PlaylistView';
import { AlbumView } from './components/views/AlbumView';
import { ArtistView } from './components/views/ArtistView';
import { LikedSongsView } from './components/views/LikedSongsView';

const MainContent: React.FC = () => {
  const { currentView, activeId } = useLibrary();

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-32">
      <Navbar />
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'search' && <SearchView />}
        {currentView === 'library' && <LibraryView />}
        {currentView === 'playlist' && activeId && <PlaylistView playlistId={activeId} />}
        {currentView === 'album' && activeId && <AlbumView albumId={activeId} />}
        {currentView === 'artist' && activeId && <ArtistView artistId={activeId} />}
        {currentView === 'liked-songs' && <LikedSongsView />}
      </main>
    </div>
  );
};

export function App() {
  return (
    <PlayerProvider>
      <LibraryProvider>
        <div className="flex h-screen bg-[#0B0F19] text-[#F8FAFC] overflow-hidden relative">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main Scrollable View Area */}
          <MainContent />

          {/* Persistent Audio Player Bar */}
          <PlayerBar />

          {/* Mobile Bottom Navigation */}
          <MobileNav />

          {/* Hidden Persistent YouTube IFrame Player Container */}
          <div
            id="sonicflow-global-yt-iframe-wrapper"
            style={{
              position: 'fixed',
              bottom: 0,
              right: 0,
              width: '1px',
              height: '1px',
              opacity: 0.01,
              pointerEvents: 'none',
              zIndex: -1
            }}
          >
            <div id="sonicflow-global-yt-iframe"></div>
          </div>

          {/* Global Drawers & Modals */}
          <LyricsDrawer />
          <QueueModal />
          <EqualizerModal />
          <SleepTimerModal />
          <CreatePlaylistModal />
          <AddToPlaylistModal />
          <AddSongFromYouTubeModal />
          <ShareModal />
          <SettingsModal />
          <ToastContainer />
        </div>
      </LibraryProvider>
    </PlayerProvider>
  );
}

export default App;
