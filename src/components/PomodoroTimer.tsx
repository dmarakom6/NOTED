
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [cycle, setCycle] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const workTime = 25 * 60;
  const breakTime = 5 * 60;
  const totalTime = mode === 'work' ? workTime : breakTime;
  const currentTime = minutes * 60 + seconds;
  const progress = ((totalTime - currentTime) / totalTime) * 100;

  const playCompletionSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
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
          setIsActive(false);
          playCompletionSound();
          toast({
            title: mode === 'work' ? "Work session complete!" : "Break complete!",
            description: mode === 'work' ? "Time for a break." : "Ready for work?",
          });
          handleModeSwitch();
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds, minutes, mode, toast]);

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

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="glass-strong border-white/10 shadow-lg overflow-hidden animate-fade-in">
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Timer
          </CardTitle>
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
            mode === 'work' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-green-500/10 text-green-700 dark:text-green-400'
          }`}>
            {mode === 'work' ? (
              <><Brain className="w-3 h-3" /> <span>Focus</span></>
            ) : (
              <><Coffee className="w-3 h-3" /> <span>Break</span></>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4 pb-8 space-y-8">
        <div className="relative">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-muted/20 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              className={`fill-none transition-all duration-1000 ease-linear ${
                mode === 'work' ? 'stroke-primary' : 'stroke-green-600 dark:stroke-green-500'
              }`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black font-mono tracking-normal">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
              Cycle {cycle}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="rounded-full h-10 w-10 glass border-white/10 hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggle}
            size="lg"
            className={`rounded-full h-14 w-14 shadow-xl shadow-primary/20 transition-transform active:scale-95 ${
              isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleModeSwitch}
            className="rounded-full h-10 w-10 glass border-white/10 hover:bg-white/5"
          >
             {mode === 'work' ? <Coffee className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
