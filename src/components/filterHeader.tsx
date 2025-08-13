"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortBy, useTaskContext } from "@/context/taskContext";
const FilterHeader = () => {
  const { sortBy, setSortBy } = useTaskContext();
  return (
    <div className="container max-sm:px-4 mx-auto mt-2 flex justify-between items-center">
      <div></div>
      <Select
        onValueChange={(value) => setSortBy(value as SortBy)}
        value={sortBy}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sort Task</SelectItem>
          <SelectItem value="dueDateAsc">Due Date (Asc)</SelectItem>
          <SelectItem value="dueDateDesc">Due Date (Desc)</SelectItem>
          <SelectItem value="statusPending">Pending</SelectItem>
          <SelectItem value="statusCompleted">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterHeader;
