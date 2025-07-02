'use client'
import React from "react";
import TaskItem from "./taskItem";
import { useTaskContext } from "@/context/taskContext";

export default function TaskList() {
    const { tasks, subtaskLoadingId } = useTaskContext();

    if (!tasks.length) return <div className="text-gray-500">No tasks yet.</div>;
    return (
        <ul className="lg:columns-3 sm:columns-2 gap-5">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    subtaskLoading={subtaskLoadingId === task.id}
                />
            ))}
        </ul>
    );
} 