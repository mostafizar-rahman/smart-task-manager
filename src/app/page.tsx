import React from "react";
import TaskList from "@/components/taskList";
import TaskForm from "@/components/taskForm";
import { TaskProvider } from "@/context/taskContext";


export default function page() {
  return (
    <main className="container mx-auto py-10">
      <TaskForm />
      <TaskList />
    </main>
  );
}
