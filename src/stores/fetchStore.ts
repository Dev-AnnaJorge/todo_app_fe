// stores/fetchStore.js
import { TaskProps } from "@/interfaces";
import { Category } from "@/libs/constants";
import { TodoRoutes } from "@/routes";
import {
  GetTodosCompletedService,
  GetTodosService,
  GetTodosSummaryService,
  GetTodosWeeklyTasksService,
  GetAllNotes,
  GetAllNotesByDate,
  GetTodoByDateService
} from "@/services";
import { makeAutoObservable } from "mobx";

class TodoStore {
  tasks: any = [];
  tasksbydate:any ={};
  completedTasks: any = [];
  summaryTasks: any = [];
  weeklyTasks: any = [];
  notes: any={};
  notesbydate: any={};
  category = Category.SCHEDULED;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTodos() {
    await GetTodosService(TodoRoutes.todos).then(
      (res) => (this.tasks = res?.data)
    );
  }

  async fetchTodoByDate(date: string, category: string) {
    await GetTodoByDateService(TodoRoutes.todosbydate, {
      date: date,
      category: category,
    }).then((res) => (this.tasksbydate = res?.data));
  }

  async fetchCompleted(date: string, category: string) {
    await GetTodosCompletedService(TodoRoutes.completed, {
      date: date,
      category: category,
    }).then((res) => (this.completedTasks = res?.data));
  }

  updateTaskStatus(id: number, status: string) {
    let taskIndex = this.completedTasks.findIndex((task:TaskProps) => task.id === id);
    let task;
    if (taskIndex !== -1) {
      task = this.completedTasks.splice(taskIndex, 1)[0];
    }
    const taskInItemsIndex = this.tasks.findIndex((task:TaskProps) => task.id === id);
    if (taskInItemsIndex !== -1) {
      this.tasks.splice(taskInItemsIndex, 1);
    }
    if (task) {
      task.status = status;
      if (status === "in_progress") {
        this.tasks.push(task);
      }
    }
    this.completedTasks = [...this.completedTasks];
    this.tasks = [...this.tasks];
  }
  
  
  
  addTask(newTask: TaskProps) {
    this.tasks.push(newTask);
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task: TaskProps) => task.id !== id);
    this.completedTasks = this.completedTasks.filter(
      (task: TaskProps) => task.id !== id
    );
  }

  approveTask(taskId: number, completedAt: string) {
    const task = this.tasks.find((task: TaskProps) => task.id === taskId);
    if (task) {
      task.status = "completed";
      task.completedAt = completedAt;
      task.effortBurn = task.effortBurn || 0;
  
      // Ensure it gets added to completed tasks if needed
      this.completedTasks = [...this.completedTasks, task];
    }
  }
  

  editTask(updatedTask: TaskProps) {
    this.tasks = this.tasks.map((task: TaskProps) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  updateTaskImportance(taskId: number, newImportantValue: boolean) {
    const taskIndex = this.tasks.findIndex((task: TaskProps) => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        important: newImportantValue,
      };
    }
  }

  async fetchSummary(date: string, category: string) {
    await GetTodosSummaryService(TodoRoutes.summary, {
      date: date,
      category: category,
    }).then((res) => (this.summaryTasks = res?.data));
  }
  
  async fetchWeeklyTasks(category: string) {
    await GetTodosWeeklyTasksService(TodoRoutes.weeklyTasks, {
      category: category,
    }).then((res) => (this.weeklyTasks = res?.data));
  }

  async fetchNotes(createdAt: string, content: string) {
    await GetAllNotes(TodoRoutes.notes, {
      createdAt:createdAt,
      content: content,
    }).then((res) => (this.notes = res?.data));
  }

  async fetchNotesByDate(date: string) {
    await GetAllNotesByDate(TodoRoutes.notesbydate, {
      date: date,
    }).then((res) => (this.notesbydate = res?.data));
  }
}




const fetchStore = new TodoStore();
export default fetchStore;
