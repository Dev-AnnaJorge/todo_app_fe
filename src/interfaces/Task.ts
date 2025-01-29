export interface TaskProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  completedDate?: string;
}
