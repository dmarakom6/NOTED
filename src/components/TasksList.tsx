
import { Task } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, FileText, CheckCircle2, ListTodo } from "lucide-react";

interface TasksListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onConvertToNote?: (taskContent: string, taskId: string) => void;
  completedToday: Task[];
}

export const TasksList = ({ tasks, onToggleTask, onDeleteTask, onConvertToNote, completedToday }: TasksListProps) => {
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Today's Progress */}
      <Card className="glass-strong border-white/10 dark:border-white/5 shadow-lg overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            Progress
            <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {completedToday.length} Done
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedToday.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No tasks completed yet today.</p>
          ) : (
            <div className="space-y-2">
              <div className="w-full bg-muted/50 dark:bg-muted/30 h-1.5 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                <div 
                  className="bg-primary h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (completedToday.length / (tasks.length || 1)) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide">
                Keep it up! {completedToday.length} task{completedToday.length === 1 ? '' : 's'} crushed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card className="glass-strong border-white/10 dark:border-white/5 shadow-lg min-h-[300px] flex flex-col">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            To-Do
            <ListTodo className="w-4 h-4 opacity-20" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-y-auto max-h-[400px] scrollbar-thin">
          {pendingTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <CheckCircle2 className="w-10 h-10 text-primary opacity-20 mb-3" />
              <p className="text-sm font-medium text-muted-foreground/50">All caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="mt-0.5 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight break-words text-foreground/90">
                      {task.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onConvertToNote && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onConvertToNote(task.content, task.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteTask(task.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
