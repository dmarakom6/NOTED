
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Monitor, Type, Eye, Contrast, DatabaseIcon } from "lucide-react";
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
import { Note, Task } from "@/pages/Index";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const [theme, setTheme] = useState(localStorage.getItem("current-theme") || "dark"); // Default to dark mode if no theme is set
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dataCleared, setDataCleared] = useState(false);
  const [isImportingData, setIsImportingData] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("current-theme");
    if (storedTheme) {
      handleThemeChange(storedTheme);
    }
  }, []);

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
    // Open file browser and look for json files
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

                // Import notes if present
                const notesPromise = notes ? indexedDBStorage.saveNotes(notes) : Promise.resolve();
                // Import tasks if present
                const tasksPromise = tasks ? indexedDBStorage.saveTasks(tasks) : Promise.resolve();

                Promise.all([notesPromise, tasksPromise])
                  .then(() => {
                    toast({
                      title: "Data imported successfully!",
                      description: "Your notes and/or tasks have been imported. Please refresh the page to see the changes.",
                      variant: "success"
                    });
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
                alert("Invalid JSON structure. Please ensure the file contains 'notes' and/or 'tasks' arrays.");
              }
            } catch (error) {
              console.error("Error parsing JSON data:", error);
              alert("Invalid JSON file. Please upload a valid file.");
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

const clearData = () => {
  indexedDBStorage.clearAllData().then(() => {
    setDataCleared(true);
    // Optionally, dispatch event if other components need to know
    window.dispatchEvent(new Event("data-cleared"));
  }).catch((error) => {
    console.error("Error clearing data:", error);
    alert("Failed to clear data. Please try again.");
  });
};

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("current-theme", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
      <SheetContent className="glass-strong w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Settings</span>
          </SheetTitle>
          <SheetDescription className="text-sm">
            Customize your experience
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Theme</label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="glass border-white/10">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="glass-strong backdrop-blur-lg border border-white/20">
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                {/* <SelectItem value="system">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Font Size</label>
            <Select value={fontSize} onValueChange={handleFontSizeChange}>
              <SelectTrigger className="glass border-white/10">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent className="glass-strong backdrop-blur-lg border border-white/20">
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
            <h4 className="text-sm font-medium text-muted-foreground">Accessibility</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <span className="text-sm">High Contrast</span>
              </div>
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                className="h-6 w-10 text-xs"
              >
                {highContrast ? "On" : "Off"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Reduced Motion</span>
              </div>
              <Button
                variant={reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={toggleReducedMotion}
                className="h-6 w-10 text-xs"
              >
                {reducedMotion ? "On" : "Off"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DatabaseIcon className="h-4 w-4" />
                <span className="text-sm">Data Management</span>
              </div>
              <Button
                variant={dataCleared ? "ghost" : "outline"}
                size="sm"
                onClick={() => {
                  clearData();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }}
                className={`h-6 w-20 ${dataCleared ? "text-neon-purple" : "text-red-600"} text-xs`}
                disabled={dataCleared}
              >
                {dataCleared ? "No Data" : "Clear Data"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportData}
                className="h-6 w-24 text-xs text-neon-green"
              >
                Import Data
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

