import { TaskProps } from "@/interfaces";

// Initial sample data for tasks and completed tasks
export const initialTasks: TaskProps[] = [
  {
    id: 1,
    title: "Review my  schedule",
    description: "Check my assigned schedule every hour throughout the day.",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description for Task 2",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description for Task 3",
    priority: "low",
    completed: false,
  },
  {
    id: 5,
    title: "Task 5",
    description: "Description for Task 5",
    priority: "low",
    completed: false,
  },
  {
    id: 6,
    title: "Task 6",
    description: "Description for Task 6",
    priority: "low",
    completed: false,
  },
];

export const initialCompletedTasks: TaskProps[] = [
  {
    id: 4,
    title: "Completed Task 4",
    description: "Description for Completed Task 4",
    priority: "medium",
    completed: true,
    completedDate: new Date().toISOString(), // Current date
  },
];
