import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { EQPreset } from '../../types/music';

const PRESETS: { id: EQPreset; label: string; values: number[] }[] = [
  { id: 'flat', label: 'Flat (Default)', values: [0, 0, 0, 0, 0] },
  { id: 'rock-punch', label: '🔥 Stadium Rock Punch', values: [6, 4, 2, 5, 6] },
  { id: 'bass-boost', label: '🔊 Deep Bass Boost', values: [8, 6, 2, 0, -1] },
  { id: 'vocal', label: '🎤 Vocal Clarity & Pop', values: [-1, 2, 6, 5, 2] },
  { id: 'electronic', label: '⚡ Electronic & Synthwave', values: [5, 3, -1, 4, 7] },
  { id: 'acoustic', label: '🎸 Acoustic & Unplugged', values: [2, 1, 4, 3, 3] },
];

export const EqualizerModal: React.FC = () => {
  const { isEqualizerOpen, setIsEqualizerOpen, eqPreset, setEqPreset } = usePlayer();
  const [bandValues, setBandValues] = useState<number[]>([0, 0, 0, 0, 0]);

  if (!isEqualizerOpen) return null;

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setEqPreset(preset.id);
    setBandValues(preset.values);
  };

  const handleBandChange = (index: number, val: number) => {
    const updated = [...bandValues];
    updated[index] = val;
    setBandValues(updated);
  };

  const freqLabels = ['60 Hz', '250 Hz', '1 kHz', '4 kHz', '16 kHz'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0F172A] border border-border/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                Audio Equalizer
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                  HD Sound
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Fine-tune audio frequencies for rich bass, crisp vocals and punchy beats.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEqualizerOpen(false)}
            className="p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Pills */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
            Sound Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left truncate border ${
                  eqPreset === p.id
                    ? 'bg-primary/20 text-primary border-primary/50 shadow-sm'
                    : 'bg-muted/60 text-foreground border-border hover:bg-muted'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Band Sliders */}
        <div className="bg-muted/30 border border-border/60 rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-muted-foreground font-mono">+12 dB</span>
            <span className="text-xs text-muted-foreground font-mono">0 dB</span>
            <span className="text-xs text-muted-foreground font-mono">-12 dB</span>
          </div>

          <div className="flex justify-between items-center gap-4 h-44 px-2">
            {bandValues.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-between flex-1">
                <span className="text-[11px] font-mono font-bold text-primary">
                  {val > 0 ? `+${val}` : val}dB
                </span>

                <div className="relative flex-1 flex items-center justify-center py-2">
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={val}
                    onChange={(e) => handleBandChange(idx, parseInt(e.target.value))}
                    className="w-28 h-1.5 -rotate-90 origin-center bg-muted rounded-full cursor-pointer accent-primary"
                  />
                </div>

                <span className="text-[10px] font-mono text-muted-foreground text-center">
                  {freqLabels[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsEqualizerOpen(false)}
          className="w-full py-3 rounded-xl gradient-primary text-black font-bold text-sm hover:opacity-95 transition-opacity"
        >
          Apply Equalizer
        </button>
      </div>
    </div>
  );
};
