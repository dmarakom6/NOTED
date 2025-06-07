import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Note, Task } from "@/pages/Index";
import { Download, FileText, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareExportProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  tasks: Task[];
}

export const ShareExport = ({ isOpen, onClose, notes, tasks }: ShareExportProps) => {
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const exportNotes = (format: 'markdown' | 'txt' | 'json') => {
    if (notes.length === 0) {
      toast({
        title: "No notes to export",
        description: "Create some notes first before exporting.",
        variant: "destructive"
      });
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'markdown':
        content = notes.map(note => 
          `# Note from ${formatDate(note.createdAt)}\n\n${note.content}\n\n---\n\n`
        ).join('');
        filename = 'noted-notes.md';
        mimeType = 'text/markdown';
        break;
      
      case 'txt':
        content = notes.map(note => 
          `Note from ${formatDate(note.createdAt)}:\n${note.content}\n\n${'='.repeat(50)}\n\n`
        ).join('');
        filename = 'noted-notes.txt';
        mimeType = 'text/plain';
        break;
      
      case 'json':
        content = JSON.stringify({ notes }, null, 2);
        filename = 'noted-notes.json';
        mimeType = 'application/json';
        break;
    }

    downloadFile(content, filename, mimeType);
  };

  const exportTasks = (format: 'markdown' | 'txt' | 'json') => {
    if (tasks.length === 0) {
      toast({
        title: "No tasks to export",
        description: "Create some tasks first before exporting.",
        variant: "destructive"
      });
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);

    switch (format) {
      case 'markdown':
        content = `# Tasks Export\n\n## Completed Tasks\n\n`;
        content += completedTasks.map(task => `- [x] ${task.content}`).join('\n');
        content += `\n\n## Pending Tasks\n\n`;
        content += pendingTasks.map(task => `- [ ] ${task.content}`).join('\n');
        filename = 'noted-tasks.md';
        mimeType = 'text/markdown';
        break;
      
      case 'txt':
        content = `TASKS EXPORT\n\nCOMPLETED TASKS:\n`;
        content += completedTasks.map(task => `✓ ${task.content}`).join('\n');
        content += `\n\nPENDING TASKS:\n`;
        content += pendingTasks.map(task => `○ ${task.content}`).join('\n');
        filename = 'noted-tasks.txt';
        mimeType = 'text/plain';
        break;
      
      case 'json':
        content = JSON.stringify({ tasks }, null, 2);
        filename = 'noted-tasks.json';
        mimeType = 'application/json';
        break;
    }

    downloadFile(content, filename, mimeType);
  };

  const exportAll = (format: 'markdown' | 'txt' | 'json') => {
    if (notes.length === 0 && tasks.length === 0) {
      toast({
        title: "Nothing to export",
        description: "Create some notes or tasks first before exporting.",
        variant: "destructive"
      });
      return;
    }

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'markdown':
        content = `# NOTED. Export\n\n`;
        if (notes.length > 0) {
          content += `## Notes\n\n`;
          content += notes.map(note => 
            `### Note from ${formatDate(note.createdAt)}\n\n${note.content}\n\n`
          ).join('');
        }
        if (tasks.length > 0) {
          content += `## Tasks\n\n### Completed\n\n`;
          content += tasks.filter(t => t.completed).map(task => `- [x] ${task.content}`).join('\n');
          content += `\n\n### Pending\n\n`;
          content += tasks.filter(t => !t.completed).map(task => `- [ ] ${task.content}`).join('\n');
        }
        filename = 'noted-export.md';
        mimeType = 'text/markdown';
        break;
      
      case 'txt':
        content = `NOTED. EXPORT\n\n`;
        if (notes.length > 0) {
          content += `NOTES:\n\n`;
          content += notes.map(note => 
            `Note from ${formatDate(note.createdAt)}:\n${note.content}\n\n${'='.repeat(50)}\n\n`
          ).join('');
        }
        if (tasks.length > 0) {
          content += `TASKS:\n\nCompleted:\n`;
          content += tasks.filter(t => t.completed).map(task => `✓ ${task.content}`).join('\n');
          content += `\n\nPending:\n`;
          content += tasks.filter(t => !t.completed).map(task => `○ ${task.content}`).join('\n');
        }
        filename = 'noted-export.txt';
        mimeType = 'text/plain';
        break;
      
      case 'json':
        content = JSON.stringify({ notes, tasks }, null, 2);
        filename = 'noted-export.json';
        mimeType = 'application/json';
        break;
    }

    downloadFile(content, filename, mimeType);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: `${filename} has been downloaded.`,
      variant: "success"
    });
    
    onClose();
  };

  const formatButtons = [
    { format: 'markdown' as const, icon: FileText, label: 'MD' },
    { format: 'txt' as const, icon: File, label: 'TXT' },
    { format: 'json' as const, icon: File, label: 'JSON' }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="glass-strong w-full sm:w-[400px] md:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <span>Export Data</span>
          </SheetTitle>
          <SheetDescription className="text-sm">
            Export your notes and tasks in different formats
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Export Notes */}
          <Card className="glass border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                Export Notes
                <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                  {notes.length} note{notes.length !== 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {formatButtons.map(({ format, icon: Icon, label }) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    onClick={() => exportNotes(format)}
                    className="glass hover:glass-strong transition-all duration-200 w-full text-xs sm:text-sm px-2 py-1 h-8 sm:h-9"
                    disabled={notes.length === 0}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Tasks */}
          <Card className="glass border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                Export Tasks
                <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {formatButtons.map(({ format, icon: Icon, label }) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    onClick={() => exportTasks(format)}
                    className="glass hover:glass-strong transition-all duration-200 w-full text-xs sm:text-sm px-2 py-1 h-8 sm:h-9"
                    disabled={tasks.length === 0}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export All */}
          <Card className="glass border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                Export Everything
                <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                  All data
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {formatButtons.map(({ format, icon: Icon, label }) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    onClick={() => exportAll(format)}
                    className="glass hover:glass-strong transition-all duration-200 bg-primary/10 hover:bg-primary/20 w-full text-xs sm:text-sm px-2 py-1 h-8 sm:h-9"
                    disabled={notes.length === 0 && tasks.length === 0}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
