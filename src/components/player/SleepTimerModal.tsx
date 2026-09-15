import React from 'react';
import { X, Timer, Moon } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

const TIMER_OPTIONS = [
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: 'End of current song', value: -1 },
];

export const SleepTimerModal: React.FC = () => {
  const { isSleepTimerOpen, setIsSleepTimerOpen, sleepTimer, setSleepTimerDuration, duration, currentTime } = usePlayer();

  if (!isSleepTimerOpen) return null;

  const handleSelectOption = (minutes: number) => {
    if (minutes === -1) {
      // End of song duration
      const remainingSecs = Math.max(1, Math.round(duration - currentTime));
      setSleepTimerDuration(remainingSecs / 60);
    } else {
      setSleepTimerDuration(minutes);
    }
    setIsSleepTimerOpen(false);
  };

  const handleTurnOff = () => {
    setSleepTimerDuration(null);
    setIsSleepTimerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] border border-border/80 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Sleep Timer</h3>
              <p className="text-xs text-muted-foreground">
                {sleepTimer !== null
                  ? `Active: ${Math.ceil(sleepTimer / 60)} minutes left`
                  : 'Stop audio playback automatically'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSleepTimerOpen(false)}
            className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleSelectOption(opt.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-foreground text-sm font-medium transition-all flex items-center justify-between border border-border/60 hover:border-primary/40"
            >
              <span>{opt.label}</span>
              <Timer className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          {sleepTimer !== null && (
            <button
              onClick={handleTurnOff}
              className="w-full px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all border border-rose-500/20 mt-3"
            >
              Turn Off Timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
