
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Monitor, Type, Eye, Contrast, DatabaseIcon, Trash2, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { indexedDBStorage } from "@/utils/indexedDBStorage";
import { toast } from "@/hooks/use-toast";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dataCleared, setDataCleared] = useState(false);

  useEffect(() => {
    const checkData = async () => {
      try {
        const [notes, tasks] = await Promise.all([
          indexedDBStorage.loadNotes(),
          indexedDBStorage.loadTasks(),
        ]);
        setDataCleared(notes.length === 0 && tasks.length === 0);
      } catch (error) {
        console.error("Error checking data:", error);
        setDataCleared(false);
      }
    };
    checkData();
  }, []);

  useEffect(() => {
    const handleDataCleared = () => setDataCleared(true);
    window.addEventListener("data-cleared", handleDataCleared);
    return () => window.removeEventListener("data-cleared", handleDataCleared);
  }, []);

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          if (typeof data === 'string') {
            try {
              const parsedData = JSON.parse(data);
              if (parsedData && (Array.isArray(parsedData.notes) || Array.isArray(parsedData.tasks))) {
                const notes = Array.isArray(parsedData.notes) ? parsedData.notes : null;
                const tasks = Array.isArray(parsedData.tasks) ? parsedData.tasks : null;

                const notesPromise = notes ? indexedDBStorage.saveNotes(notes) : Promise.resolve();
                const tasksPromise = tasks ? indexedDBStorage.saveTasks(tasks) : Promise.resolve();

                Promise.all([notesPromise, tasksPromise])
                  .then(() => {
                    toast({
                      title: "Data imported successfully!",
                      description: "Your notes and/or tasks have been imported. Refreshing page...",
                    });
                    setTimeout(() => window.location.reload(), 1500);
                  })
                  .catch((error) => {
                    console.error("Error importing data:", error);
                    toast({
                      title: "Import Error",
                      description: "There was an error importing your data.",
                      variant: "destructive"
                    });
                  });
              } else {
                toast({
                  title: "Invalid file structure",
                  description: "Please ensure the file contains 'notes' and/or 'tasks' arrays.",
                  variant: "destructive"
                });
              }
            } catch (error) {
              console.error("Error parsing JSON data:", error);
              toast({
                title: "Invalid JSON file",
                description: "Please upload a valid JSON file.",
                variant: "destructive"
              });
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearData = async () => {
    try {
      await indexedDBStorage.clearAllData();
      setDataCleared(true);
      window.dispatchEvent(new Event("data-cleared"));
      toast({
        title: "Data cleared",
        description: "All notes and tasks have been deleted.",
      });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error clearing data:", error);
      toast({
        title: "Error",
        description: "Failed to clear data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizeMap[newSize as keyof typeof sizeMap];
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle('reduced-motion', !reducedMotion);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="glass-strong w-full sm:w-[400px] border-l border-white/20">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2 text-xl font-bold">
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </SheetTitle>
          <SheetDescription>
            Customize your NOTED. experience
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 mt-8">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Theme</label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="glass border-white/10 h-11">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="glass-strong backdrop-blur-xl border border-white/20">
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Typography</label>
            <Select value={fontSize} onValueChange={handleFontSizeChange}>
              <SelectTrigger className="glass border-white/10 h-11">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent className="glass-strong backdrop-blur-xl border border-white/20">
                <SelectItem value="small">
                  <div className="flex items-center space-x-2">
                    <Type className="h-3 w-3" />
                    <span>Small</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center space-x-2">
                    <Type className="h-4 w-4" />
                    <span>Medium</span>
                  </div>
                </SelectItem>
                <SelectItem value="large">
                  <div className="flex items-center space-x-2">
                    <Type className="h-5 w-5" />
                    <span>Large</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility Options */}
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Accessibility</label>

            <div className="flex items-center justify-between p-3 rounded-lg glass">
              <div className="flex items-center space-x-3">
                <Contrast className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">High Contrast</span>
              </div>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                className="h-7 px-3 text-xs"
              >
                {highContrast ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg glass">
              <div className="flex items-center space-x-3">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Reduced Motion</span>
              </div>
              <Button
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={toggleReducedMotion}
                className="h-7 px-3 text-xs"
              >
                {reducedMotion ? "On" : "Off"}
              </Button>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Data Management</label>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleImportData}
                className="glass border-white/10 flex items-center justify-center space-x-2 h-11"
              >
                <Download className="h-4 w-4" />
                <span>Import</span>
              </Button>
              <Button
                variant="outline"
                disabled={dataCleared}
                onClick={clearData}
                className={`glass border-white/10 flex items-center justify-center space-x-2 h-11 ${!dataCleared ? 'text-destructive hover:bg-destructive/10' : ''}`}
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
