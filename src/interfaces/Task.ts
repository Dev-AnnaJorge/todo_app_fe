export interface TaskProps {
  important: boolean;
  id: number;
  userId:number;
  title: string;
  description: string;
  priority: string;
  category: string;
  status:string;
  createdAt: string,
  updatedAt: string,
  completedAt: string,
  effortBurn?:number,
  note:string
}
