'use client'
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon } from "lucide-react";
import { DateFormatter } from "@/lib/dateFormatter";
import { useTaskContext } from "@/context/taskContext"
import { Task } from "./taskItem";

export interface TaskFormValues extends Omit<Task, 'id'> { }

const initialTask: TaskFormValues = {
    title: "",
    description: "",
    status: "pending",
    dueDate: undefined,
    subtasks: []
};

export default function TaskForm() {
    const { editingTask, handleAddTask, handleEditTask, handleCloseForm, formOpen, } = useTaskContext();
    const [form, setForm] = useState<TaskFormValues>(editingTask || initialTask);
    const [dateSelectOpen, setdateSelectOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(editingTask?.dueDate);

    useEffect(() => {
        setForm(editingTask || initialTask);
        setDate(editingTask?.dueDate);
    }, [editingTask]);

    // this function handle input and textarea value
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // this function handle shadcn select component
    const handleStatusChange = (value: "pending" | "completed") => {
        setForm({ ...form, status: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        const values = { ...form, dueDate: date };
        if (editingTask) {
            handleEditTask(values);
        } else {
            handleAddTask(values);
            setForm(initialTask)
            setDate(undefined)
        }
    };

    return (
        <Dialog open={formOpen} onOpenChange={handleCloseForm}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="p-0">
                <DialogHeader className="pb-4 bg-muted rounded-t-lg px-5 pt-4">
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="">
                    <div className="px-5 space-y-5 max-h-[400px] overflow-y-auto">
                        <div>
                            <Label htmlFor="title" className="pb-2">
                                Title:
                            </Label>
                            <Input id="title" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="description" className="pb-2">
                                Description:
                            </Label>
                            <Textarea id="description" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                        </div>
                        {
                            form.subtasks?.length ?
                                <div>
                                    <Label htmlFor="subtasks" className="pb-2">
                                        Subtasks:
                                    </Label>
                                    <Textarea
                                        id="subtasks"
                                        name="subtasks"
                                        placeholder="Subtasks"
                                        value={form.subtasks?.join('\n') || ''}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                subtasks: e.target.value.split('\n').filter(Boolean),
                                            })
                                        }
                                    />
                                </div>
                                : null
                        }
                        <div className="flex sm:flex-row flex-col gap-x-2 gap-y-5 justify-between">
                            {/* Status Select */}
                            <div className="flex sm:flex-row flex-col gap-2">
                                <Label htmlFor="status">
                                    Status:
                                </Label>
                                <Select name="status" value={form.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger id="status" className="w-32">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Date Picker */}
                            <div className="flex sm:flex-row flex-col gap-2">
                                <Label htmlFor="date">
                                    Due Date:
                                </Label>
                                <Popover open={dateSelectOpen} onOpenChange={setdateSelectOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {date ? DateFormatter(date) : "Select date"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDate(date)
                                                setdateSelectOpen(false)
                                            }}
                                            disabled={(date) =>date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="sm:mt-8 mt-5 border-t px-5 pb-4">
                        <div className="flex gap-2 mt-4">
                            <Button type="submit">{editingTask ? "Update Task" : "Add Task"}</Button>
                            <Button type="button" variant="outline" onClick={handleCloseForm}>Cancel</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >

    );
} 