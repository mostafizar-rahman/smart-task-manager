"use client";
import { useTaskContext } from "@/context/taskContext";
import { Button } from "./ui/button";

const Header = () => {
  const { handleOpenAddForm } = useTaskContext();
  return (
    <div className="container max-sm:px-4 mx-auto flex justify-between items-center py-4">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div className="flex gap-2">
        <Button onClick={handleOpenAddForm}>Add Task</Button>
      </div>
    </div>
  );
};

export default Header;
