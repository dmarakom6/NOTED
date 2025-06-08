
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FocusModeProps {
  onExit: () => void;
}

export const FocusMode = ({ onExit }: FocusModeProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-purple-900/20 flex items-center justify-center z-50">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Clock */}
        <div className="relative">
          <div className="w-64 h-64 mx-auto glass-strong rounded-full flex items-center justify-center neon-glow">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold text-glow">
                {time.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {time.toLocaleDateString([], { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-neon-purple/30 rounded-full animate-float"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Focus Message */}
        <Card className="glass-strong border-white/20 max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2 text-glow">Focus Mode</h2>
            <p className="text-muted-foreground mb-4">
              Time to concentrate. All distractions are hidden.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Take deep breaths</p>
              <p>• Focus on one task at a time</p>
              <p>• Press ESC to exit</p>
            </div>
          </CardContent>
        </Card>

        {/* Exit Button */}
        <Button
          onClick={onExit}
          variant="outline"
          className="glass hover:glass-strong transition-all duration-300"
        >
          Exit Focus Mode
        </Button>

        {/* Ambient animations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
