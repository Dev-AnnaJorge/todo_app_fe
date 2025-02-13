export interface TaskProps {
  important: boolean;
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
}

export interface TaskNoteProps {
  id: number;
  createdAt: string,
  updatedAt: string,
  content: string,
}