'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Task } from "@/components/taskItem";
import { TaskFormValues } from "@/components/taskForm";

export type SortBy = 'none' | 'dueDateAsc' | 'dueDateDesc' | 'statusPending' | 'statusCompleted';

interface TaskContextType {
  tasks: Task[];
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  editingTask: Task | null;
  formOpen: boolean;
  subtaskLoadingId: string | null;
  handleOpenAddForm: () => void;
  handleOpenEditForm: (task: Task) => void;
  handleCloseForm: () => void;
  handleAddTask: (values: TaskFormValues) => void;
  handleEditTask: (values: TaskFormValues) => void;
  handleDeleteTask: (id: string) => void;
  handleSuggestSubtasks: (task: Task) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);


export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const savedTasks = localStorage.getItem("smart-task-manager-tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
      }
      return [];
    }
    return [];
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [subtaskLoadingId, setSubtaskLoadingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('none');

  const sortedTasks = React.useMemo(() => {
    let sortableTasks = [...tasks];

    switch (sortBy) {
      case 'dueDateAsc':
        sortableTasks.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        break;
      case 'dueDateDesc':
        sortableTasks.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.getTime() - a.dueDate.getTime();
        });
        break;
      
      case 'statusPending':
        sortableTasks.sort((a, b) => {
          if (a.status === b.status) return 0;
          if (a.status === 'pending') return -1;
          return 1;
        });
        break;
      case 'statusCompleted':
        sortableTasks.sort((a, b) => {
          if (a.status === b.status) return 0;
          if (a.status === 'completed') return -1;
          return 1;
        });
        break;
      default:
        // No sorting, or default to original order (which is usually insertion order for useState)
        break;
    }
    return sortableTasks;
  }, [tasks, sortBy]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("smart-task-manager-tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // trigger in the function open modal for add task form 
  const handleOpenAddForm = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  // trigger in the function open modal for edit task form 
  const handleOpenEditForm = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  // trigger in the function close modal add task or edit task form 
  const handleCloseForm = () => {
    setEditingTask(null);
    setFormOpen(false);
  };

  // trigger in the function store add from value inside setTask state
  const handleAddTask = (values: TaskFormValues) => {
    setTasks(tasks => [
      ...tasks,
      { ...values, id: Date.now().toString() },
    ]);
    setFormOpen(false);
  };

  // trigger in the function store edit from value inside setTask state
  const handleEditTask = (values: TaskFormValues) => {
    if (!editingTask) return;
    setTasks(tasks => tasks.map(t => t.id === editingTask.id ? { ...t, ...values } : t));
    setEditingTask(null);
    setFormOpen(false);
  };

  // delete task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks => tasks.filter(t => t.id !== id));
  };

  // 
  const handleSuggestSubtasks = async (task: Task) => {
    setSubtaskLoadingId(task.id);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: task.title, description:task.description }),
      });
      const data = await res.json();
      setTasks(tasks => tasks.map(t => t.id === task.id ? { ...t, subtasks: data.subtasks } : t));
    } catch {
      setTasks(tasks => tasks.map(t => t.id === task.id ? { ...t, subtasks: ["Failed to fetch subtasks"] } : t));
    }
    setSubtaskLoadingId(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: sortedTasks,
        editingTask,
        formOpen,
        subtaskLoadingId,
        sortBy,
        setSortBy,
        handleOpenAddForm,
        handleOpenEditForm,
        handleCloseForm,
        handleAddTask,
        handleEditTask,
        handleDeleteTask,
        handleSuggestSubtasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
} 