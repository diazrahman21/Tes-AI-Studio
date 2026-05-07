import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS, Track } from '../constants';

interface Props {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export default function MusicPlayer({ currentTrackIndex, onTrackChange, isPlaying, onPlayToggle }: Props) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const nextTrack = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="h-full flex items-center px-8 gap-12 bg-[#0a0a0a] border-t-2 border-[#1a1a1a]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
         onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Track Info (Mobile/Compact) */}
      <div className="hidden md:flex flex-col w-48 truncate">
        <div className="text-[10px] uppercase tracking-widest text-pink-500 opacity-70 mb-1">Playing Now</div>
        <div className="text-sm font-medium text-white truncate">
          {currentTrack.title} - <span className="text-pink-500 italic">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={prevTrack}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <SkipBack size={20} fill="currentColor" />
        </button>
        
        <button 
          onClick={onPlayToggle}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-[#39ff14] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="translate-x-0.5" fill="currentColor" />}
        </button>

        <button 
          onClick={nextTrack}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <SkipForward size={20} fill="currentColor" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-mono text-white/30">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : "0:00"}</span>
          <span>{audioRef.current && audioRef.current.duration ? Math.floor(audioRef.current.duration / 60) + ":" + Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : "0:00"}</span>
        </div>
        <div className="h-1 bg-[#222] rounded-full overflow-hidden cursor-pointer group">
          <motion.div
            className="h-full bg-pink-500 shadow-[0_0_10px_#f02fc2]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Visualizer Mockup */}
      <div className="hidden lg:flex items-center gap-4 w-48">
        <div className="flex items-end gap-[2px] h-8">
          {[0.3, 0.6, 0.9, 0.4, 0.7, 1.0, 0.5, 0.8].map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: isPlaying ? [`${h * 100}%`, `${Math.random() * 100}%`, `${h * 100}%`] : `${h * 100}%` }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 bg-[#39ff14]"
            />
          ))}
        </div>
        <div className="text-[9px] font-mono text-[#39ff14] leading-tight">AUDIO<br/>SYNC</div>
      </div>
    </div>
  );
}
