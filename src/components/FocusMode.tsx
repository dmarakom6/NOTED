
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FocusModeProps {
  onExit: () => void;
}

export const FocusMode = ({ onExit }: FocusModeProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[100] animate-fade-in overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative z-10 text-center space-y-12 max-w-lg px-6">
        {/* Clock Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <span>Deep Focus</span>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 group-hover:bg-primary/10 transition-colors" />
            <h1 className="text-8xl sm:text-9xl font-black tracking-tighter font-mono relative">
              {time.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </h1>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
            {time.toLocaleDateString([], {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>


        {/* Action Section */}
        <div className="pt-8">
          <Button
            onClick={onExit}
            variant="outline"
            className="glass hover:glass-strong transition-all duration-300 rounded-full h-12 px-8 font-black uppercase tracking-widest text-[10px] border-white/20 group"
          >
            <X className="w-3.5 h-3.5 mr-2 group-hover:rotate-90 transition-transform" />
            Exit Session
          </Button>
          <p className="mt-4 text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tighter">Press ESC to exit instantly</p>
        </div>
      </div>

      {/* Subtle particle system */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
