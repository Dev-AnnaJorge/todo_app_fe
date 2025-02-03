export interface TaskProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  status:string;
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}