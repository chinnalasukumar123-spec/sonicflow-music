import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export const ShareModal: React.FC = () => {
  const { isShareOpen, closeShareModal, itemToShare, showToast } = useLibrary();
  const [copied, setCopied] = useState(false);

  if (!isShareOpen || !itemToShare) return null;

  // Clean, duplicate-free share link
  const routeTarget = itemToShare.id || encodeURIComponent(itemToShare.title);
  const shareLink = `${window.location.origin}${window.location.pathname}#/${itemToShare.type}/${routeTarget}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] border border-border/80 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Share {itemToShare.type}</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {itemToShare.title}
              </p>
            </div>
          </div>

          <button
            onClick={closeShareModal}
            className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-muted/60 border border-border">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="bg-transparent text-xs text-muted-foreground flex-1 outline-none px-2 font-mono truncate select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl gradient-primary text-black font-bold text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Listen to "${itemToShare.title}" on SonicFlow: ${shareLink}`)}`, '_blank');
              }}
              className="py-2.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
            >
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${itemToShare.title}" on SonicFlow: ${shareLink}`)}`, '_blank');
              }}
              className="py-2.5 rounded-2xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/40 text-sky-400 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
            >
              <span>Twitter / X</span>
            </button>
            <button
              onClick={() => {
                window.open(`https://telegram.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(itemToShare.title)}`, '_blank');
              }}
              className="py-2.5 rounded-2xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/40 text-blue-400 text-xs font-semibold flex flex-col items-center gap-1 transition-all"
            >
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
