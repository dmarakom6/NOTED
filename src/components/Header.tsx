
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareExport } from "./ShareExport";
import { Settings } from "./Settings";
import { Share, Settings as SettingsIcon, Play, BookOpen, Sparkles } from "lucide-react";
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
      <header className="sticky top-0 z-50 w-full glass border-b border-white/10 px-4 py-3 sm:py-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="nobgnoted.png" className="w-12 h-12" alt="NOTED. logo" />
            <div>
              <h1 className="text-xl font-black text-foreground">
                NOTED.
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link to="/docs" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-xs">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
            </Link>

            <Button
              onClick={onFocusMode}
              variant="default"
              size="sm"
              className="text-xs font-bold shadow-md shadow-primary/20"
            >
              <Play className="w-3 h-3 mr-1.5" />
              Focus
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-xs"
              onClick={() => setShowShareExport(true)}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Support />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon className="w-4 h-4" />
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
