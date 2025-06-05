
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareExport } from "./ShareExport";
import { Settings } from "./Settings";
import { Share, Settings as SettingsIcon, Play, BookOpen } from "lucide-react";
import { Note, Task } from "@/pages/Index";
import { Link } from "react-router-dom";
import { Support } from "./Support";

interface HeaderProps {
  onFocusMode: () => void;
  notes: Note[];
  tasks: Task[];
}

export const Header = ({ onFocusMode, notes, tasks }: HeaderProps) => {
  const [showShareExport, setShowShareExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="sm:static fixed top-0 left-0 right-0 z-50 glass rounded-none sm:rounded-2xl sm:mx-4 sm:mt-4 p-3 sm:p-6 animate-slide-down">
        <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2 sm:gap-4">
          {/* Logo - hidden on mobile, shown on desktop */}
          <div className="hidden sm:block min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              NOTED.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">Your productivity companion</p>
          </div>
          
          {/* Buttons - always centered */}
          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Link to="/NOTED/docs">
              <Button variant="outline" className="glass text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 h-8 sm:h-10">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Docs</span>
              </Button>
            </Link>
            
            <Button 
              onClick={onFocusMode}
              className="bg-gradient-to-r from-neon-purple to-neon-blue hover:scale-105 transition-all duration-200 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 h-8 sm:h-10"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Focus</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="glass text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4 h-8 sm:h-10"
              onClick={() => setShowShareExport(true)}
            >
              <Share className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>

              <Support/>

            <Button 
              variant="outline" 
              size="icon" 
              className="glass flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </header>

      <ShareExport 
        isOpen={showShareExport}
        onClose={() => setShowShareExport(false)}
        notes={notes}
        tasks={tasks}
      />

      
      <Settings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};
