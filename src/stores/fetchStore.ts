// stores/fetchStore.js
import { TaskProps } from "@/interfaces";
import { Category } from "@/libs/constants";
import { TodoRoutes } from "@/routes";
import { GetAllNotes, GetTodosCompletedService, GetTodosService, GetTodosSummaryService, GetTodosWeeklyTasksService } from "@/services";
import { makeAutoObservable } from "mobx";

class TodoStore {
  tasks:any = [];
  completedTasks:any = [];
  summaryTasks: any = [];
  weeklyTasks:any = [];
  note:any = [];
  category = Category.SCHEDULED;
  loading = false;
  error = null;


  constructor() {
    makeAutoObservable(this);
  }

  async fetchTodos () {
   await GetTodosService(TodoRoutes.todos).then(res=> this.tasks = res?.data);
  }

  async fetchCompleted (date: string) {
   await GetTodosCompletedService(TodoRoutes.completed, {date: date}).then(res=> this.completedTasks = res?.data);
  }

  addTask(newTask: TaskProps) {
    this.tasks.push(newTask);
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task:TaskProps)=> task.id !== id);
    this.completedTasks = this.completedTasks.filter((task:TaskProps) => task.id !== id);
  }

  approveTask(id: number) {
    const taskToApprove = this.tasks.find((task:TaskProps) => task.id === id);
    if (taskToApprove) {
      this.deleteTask(id);
      this.completedTasks.push(taskToApprove);
    }
  }

  editTask(updatedTask: TaskProps) {
    this.tasks = this.tasks.map((task:TaskProps) => 
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  async fetchSummary (date: string) {
    await GetTodosSummaryService(TodoRoutes.summary, {date: date}).then(res=> this.summaryTasks = res?.data);
   }
  async fetchWeeklyTasks (category: string) {
    await GetTodosWeeklyTasksService(TodoRoutes.weeklyTasks, {category: category}).then(res=> this.weeklyTasks = res?.data);
   }
   async AllNotes (createdAt:string,content: string) {
    await GetAllNotes(TodoRoutes.note,{ccreatedAt:createdAt,content: content}).then(res=> this.note = res?.data);
   }
}

const fetchStore = new TodoStore();
export default fetchStore;