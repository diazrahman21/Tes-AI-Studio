import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface Props {
  onScoreChange?: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  const spawnFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newHead = {
        x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        spawnFood();
      } else {
        newSnake.pop();
      }
      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, Math.max(50, 150 - Math.floor(score / 50) * 10));
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, score, highScore, isPaused, spawnFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle dot matrix style)
    ctx.fillStyle = 'rgba(57, 255, 20, 0.05)';
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        ctx.beginPath();
        ctx.arc((i + 0.5) * size, (j + 0.5) * size, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Food (Neon Pink)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f02fc2';
    ctx.fillStyle = '#f02fc2';
    ctx.beginPath();
    ctx.roundRect(food.x * size + 4, food.y * size + 4, size - 8, size - 8, 2);
    ctx.fill();

    // Draw Snake (Neon Green)
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#39ff14';
      
      if (isHead) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#39ff14';
        ctx.lineWidth = 2;
        ctx.fillRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4);
        ctx.strokeRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4);
      } else {
        const alpha = 1 - (i / snake.length) * 0.7;
        ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`;
        ctx.fillRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4);
      }
    });
    
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl border-2 border-[#1a1a1a] shadow-[0_0_50px_rgba(57,255,20,0.1)] bg-black"
        />

        <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none">
          <span className="px-2 py-1 bg-black/60 border border-[#39ff14]/30 rounded text-[10px] font-mono text-[#39ff14]">FPS: 60</span>
          <span className="px-2 py-1 bg-black/60 border border-pink-500/30 rounded text-[10px] font-mono text-pink-500">SYNC: ACTIVE</span>
        </div>

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-xl flex flex-col items-center justify-center gap-4 border border-white/5"
            >
              {gameOver ? (
                <>
                  <Trophy className="text-[#39ff14] w-16 h-16 mb-2" />
                  <h2 className="text-3xl font-bold text-white tracking-tighter">CONNECTION LOST</h2>
                  <p className="text-white/60 font-mono">Archive Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="mt-4 flex items-center gap-2 bg-[#39ff14] hover:bg-[#32e011] text-black px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#39ff14]/20"
                  >
                    <RefreshCw size={20} /> REBOOT
                  </button>
                </>
              ) : (
                <>
                  <Zap className="text-pink-500 w-16 h-16 mb-2 animate-pulse" />
                  <h2 className="text-3xl font-bold text-white tracking-tighter">DATA PAUSED</h2>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Press Space to Resume</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="mt-4 flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/20"
                  >
                    RESUME
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 font-mono text-[9px] text-[#39ff14]/40 uppercase tracking-[0.3em] byte-grid px-6 py-2 rounded-lg border border-[#39ff14]/10 bg-[#39ff14]/5">
        <span>[ ARROWS ] = NAVIGATE</span>
        <span>|</span>
        <span>[ SPACE ] = PAUSE</span>
      </div>
    </div>
  );
}
