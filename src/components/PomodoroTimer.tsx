
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [cycle, setCycle] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const totalTime = mode === 'work' ? workTime : breakTime;
  const currentTime = minutes * 60 + seconds;
  const progress = ((totalTime - currentTime) / totalTime) * 100;

  const playCompletionSound = () => {
    try {
      // Create a simple success sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const showCelebration = () => {
    toast({
      title: "🎉 Good Job! You're doing numbers!",
      description: mode === 'work' 
        ? "Time for a well-deserved break!" 
        : "Ready to get back to work?",
      duration: 5000,
    });
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          playCompletionSound();
          showCelebration();
          handleModeSwitch();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds]);

  const handleModeSwitch = () => {
    if (mode === 'work') {
      setMode('break');
      setMinutes(5);
      setSeconds(0);
    } else {
      setMode('work');
      setMinutes(25);
      setSeconds(0);
      setCycle(cycle + 1);
    }
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="glass-strong border-white/20 animate-slide-up">
      <CardHeader>
        <CardTitle className="text-center text-lg">
          Pomodoro Timer
        </CardTitle>
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            mode === 'work' 
              ? 'bg-neon-purple/20 text-neon-purple' 
              : 'bg-neon-green/20 text-neon-green'
          }`}>
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress */}
        <div className="relative flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={mode === 'work' ? '#8B5CF6' : '#10B981'}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">
                Cycle {cycle}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={toggle}
            size="icon"
            className={`rounded-full w-12 h-12 ${
              isActive 
                ? 'bg-destructive hover:bg-destructive/80' 
                : 'bg-gradient-to-r from-neon-purple to-neon-blue hover:scale-110'
            } transition-all duration-200`}
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            onClick={reset}
            size="icon"
            variant="outline"
            className="glass hover:glass-strong rounded-full w-12 h-12 transition-all duration-200 hover:scale-110"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Mode Switch */}
        <div className="flex justify-center">
          <Button
            onClick={handleModeSwitch}
            variant="outline"
            size="sm"
            className="glass hover:glass-strong text-xs"
          >
            Switch to {mode === 'work' ? 'Break' : 'Work'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
