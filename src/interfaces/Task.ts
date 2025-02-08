export interface TaskProps {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  status:string;
  createdAt: string,
  updatedAt: string,
  completedAt: string,
  effortBurn?:number,
  content:string
}