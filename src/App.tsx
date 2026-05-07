/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';
import { TRACKS } from './constants';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col overflow-hidden p-6 gap-6 selection:bg-[#39ff14]/30">
      {/* TOP BAR: Status & Score */}
      <header className="flex items-center justify-between bg-[#111111] border-b-2 border-[#39ff14] p-4 shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-t-lg shrink-0">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#39ff14] opacity-70 mb-1 font-mono">Current Mode</div>
            <div className="text-lg font-black text-white italic">NEON REPTILE // ARCADE</div>
          </div>
          <div className="h-8 w-[1px] bg-[#333]"></div>
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#39ff14] opacity-70 mb-1 font-mono">Game Score</div>
            <div className="text-2xl font-mono font-bold text-[#39ff14]">
              {currentScore.toString().padStart(7, '0')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-[0.2em] text-pink-500 opacity-70 mb-1 font-mono">Playing Now</div>
            <div className="text-sm font-medium text-white">
              {currentTrack.title} - <span className="text-pink-500 italic">{currentTrack.artist}</span>
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full border border-pink-500 flex items-center justify-center ${isPlaying ? 'animate-pulse' : 'opacity-30'}`}>
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* LEFT SIDEBAR: Playlist */}
        <aside className="w-72 bg-[#0a0a0a] border border-[#222] rounded-lg flex flex-col overflow-hidden hidden md:flex shrink-0">
          <div className="p-4 border-b border-[#222] bg-[#111]">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#39ff14]">Neural Playlist</h3>
          </div>
          <div className="flex-1 overflow-y-auto track-list">
            {TRACKS.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={`w-full p-4 flex items-center gap-3 transition-all border-l-4 text-left ${
                  currentTrackIndex === index 
                    ? 'bg-[#1a1a1a] border-pink-500' 
                    : 'hover:bg-[#111] border-transparent'
                }`}
              >
                <div className={`text-xs font-mono ${currentTrackIndex === index ? 'text-pink-500' : 'text-white/30'}`}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1 truncate">
                  <div className={`text-sm font-semibold truncate ${currentTrackIndex === index ? 'text-white' : 'text-white/50'}`}>
                    {track.title}
                  </div>
                  <div className="text-[10px] opacity-30 uppercase font-mono tracking-tighter">AI Gen: Synthwave</div>
                </div>
                {currentTrackIndex === index && isPlaying && (
                  <div className="flex gap-1 items-end h-3">
                    <div className="w-0.5 bg-pink-500 h-full animate-[bounce_1s_infinite]" />
                    <div className="w-0.5 bg-pink-500 h-1/2 animate-[bounce_1.2s_infinite]" />
                    <div className="w-0.5 bg-pink-500 h-2/3 animate-[bounce_0.8s_infinite]" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="p-4 bg-[#0d0d0d] border-t border-[#222]">
            <div className="text-[9px] text-center opacity-30 uppercase tracking-[0.2em] font-mono leading-relaxed">
              SYNTH GEN ENGINE V4.2 ACTIVE<br/>
              HARDWARE ACCELERATION: ON
            </div>
          </div>
        </aside>

        {/* CENTER: Snake Game Canvas */}
        <main className="flex-1 relative bg-[#000] border-2 border-[#1a1a1a] rounded-xl overflow-hidden shadow-inner flex items-center justify-center min-h-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 w-full max-w-lg aspect-square flex items-center justify-center p-4">
             <SnakeGame onScoreChange={setCurrentScore} />
          </div>

          {/* Tactical HUD Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none opacity-20 hidden lg:flex">
             <div className="text-[8px] font-mono uppercase tracking-[0.4em]">Grid_Calibration: 1.0</div>
             <div className="text-[8px] font-mono uppercase tracking-[0.4em]">User_ID: AUTH_NODE_9</div>
          </div>
        </main>
      </div>

      {/* FOOTER: Music Controls */}
      <footer className="h-24 shrink-0 rounded-b-lg overflow-hidden">
        <MusicPlayer 
          currentTrackIndex={currentTrackIndex}
          onTrackChange={setCurrentTrackIndex}
          isPlaying={isPlaying}
          onPlayToggle={() => setIsPlaying(!isPlaying)}
        />
      </footer>
    </div>
  );
}
