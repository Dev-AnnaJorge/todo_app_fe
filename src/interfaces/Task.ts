interface TaskProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  status: "todo" | "in_progress" | "completed"; // Restrict status values
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  effortBurn?: number;
  content: string;
}


export type { TaskProps };