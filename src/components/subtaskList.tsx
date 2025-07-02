import React from "react";

interface SubtaskListProps {
  subtasks?: string[];
}

export default function SubtaskList({ subtasks }: SubtaskListProps) {
  if (!subtasks || subtasks.length === 0) return null;
  return (
    <ul className="mt-2 list-disc list-inside text-gray-700 border-t pt-2.5">
      {subtasks.map((sub, i) => <li key={i}>{sub}</li>)}
    </ul>
  );
} 