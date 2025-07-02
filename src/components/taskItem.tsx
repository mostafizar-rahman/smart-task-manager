import React from "react";
import { Button } from "@/components/ui/button";
import SubtaskList from "./subtaskList";
import { DateFormatter } from "@/lib/dateFormatter";
import { useTaskContext } from "@/context/taskContext";
import { Edit, Trash } from "lucide-react";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: "pending" | "completed";
    dueDate: Date | undefined;
    subtasks?: string[];
}

interface TaskItemProps {
    task: Task;
    subtaskLoading: boolean;
}

export default function TaskItem({ task, subtaskLoading }: TaskItemProps) {
    const { handleOpenEditForm, handleDeleteTask, handleSuggestSubtasks } = useTaskContext();
    return (
        <li className="bg-gray-50 p-4 rounded shadow flex flex-col gap-2 overflow-hidden mb-5">
            <div>
                <div className="pb-2">
                    <h2 className="text-lg font-semibold">{task.title}</h2>
                    <div className="text-sm text-gray-500 mt-1.5">
                        Status: {task.status} | Due: {task.dueDate ? DateFormatter(task.dueDate) : "-"}
                    </div>
                </div>
                <p className="text-gray-600">{task.description}</p>

            </div>

            <div>
                <SubtaskList subtasks={task.subtasks} />
                <div className="flex items-center justify-between mt-5">
                    <Button size="sm" onClick={() => handleSuggestSubtasks(task)} disabled={subtaskLoading}>
                        {subtaskLoading ? "Suggesting..." : "Suggest Subtasks"}
                    </Button>
                    <div className="flex gap-5">
                        <button className="hover:text-green-500 transition-all duration-500" onClick={() => handleOpenEditForm(task)}><Edit size={'20'}/></button>
                        <button className="hover:text-destructive transition-all duration-500" onClick={() => handleDeleteTask(task.id)}><Trash size={'20'}/></button>
                    </div>
                </div>
            </div>
        </li>
    );
} 