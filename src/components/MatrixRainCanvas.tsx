import React, { useEffect, useRef } from 'react';

interface MatrixRainCanvasProps {
  onExit: () => void;
}

export const MatrixRainCanvas: React.FC<MatrixRainCanvasProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 13, 8, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00FF66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading character is brighter white-green
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#FFFFFF';
        } else {
          ctx.fillStyle = '#00FF66';
        }

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      onExit();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onExit]);

  return (
    <div className="relative w-full h-full min-h-[360px] bg-[#050D08] overflow-hidden flex flex-col justify-between p-4 font-mono select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 flex items-center justify-between text-xs text-emerald-400 bg-black/60 px-3 py-1.5 border border-emerald-500/40">
        <span className="font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          MATRIX DIGITAL RAIN // NEURAL STREAM
        </span>
        <button
          onClick={onExit}
          type="button"
          className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-800 text-emerald-200 border border-emerald-500 text-[11px] font-bold"
        >
          [Press ESC or Click to Exit]
        </button>
      </div>
      <div className="relative z-10 text-[11px] text-emerald-300 text-center bg-black/60 py-1 border border-emerald-500/30">
        "There is no spoon." — The Matrix (1999) · System integrity verified.
      </div>
    </div>
  );
};
