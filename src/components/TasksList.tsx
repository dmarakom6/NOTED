
import { useState } from "react";
import { Task } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Plus, FileText } from "lucide-react";

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
    <div className="space-y-4">
      {/* Today's Progress */}
      <Card className="glass-strong border-white/20 animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Today's Progress
            <span className="text-2xl font-bold text-neon-green">
              {completedToday.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {completedToday.length === 0 
              ? "No tasks completed yet today" 
              : `${completedToday.length} task${completedToday.length === 1 ? '' : 's'} completed!`
            }
          </div>
          {completedToday.length > 0 && (
            <div className="mt-3 space-y-2">
              {completedToday.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                  <span className="text-muted-foreground line-through">
                    {task.content.length > 30 ? `${task.content.slice(0, 30)}...` : task.content}
                  </span>
                </div>
              ))}
              {completedToday.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{completedToday.length - 3} more
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card className="glass-strong border-white/20 animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Tasks
            <span className="text-sm font-normal text-muted-foreground">
              {pendingTasks.length} pending
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm">No pending tasks</p>
              </div>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-3 rounded-lg glass hover:glass-strong transition-all duration-200 group"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.content}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {onConvertToNote && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onConvertToNote(task.content, task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"
                      title="Convert to note"
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
