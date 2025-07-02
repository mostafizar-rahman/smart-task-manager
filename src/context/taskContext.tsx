'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/components/taskItem";
import { TaskFormValues } from "@/components/taskForm";

interface TaskContextType {
  tasks: Task[];
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [subtaskLoadingId, setSubtaskLoadingId] = useState<string | null>(null);

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
        tasks,
        editingTask,
        formOpen,
        subtaskLoadingId,
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