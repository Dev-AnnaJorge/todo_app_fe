// stores/fetchStore.js
import { TaskProps } from "@/interfaces";
import { User } from "@/interfaces/Users";
import { Category } from "@/libs/constants";
import { TodoRoutes } from "@/routes";
import {
  GetTodosCompletedService,
  GetTodosService,
  GetTodosSummaryService,
  GetTodosWeeklyTasksService,
  GetAllNotes,
  GetAllNotesByDate,
  GetTodoByDateService,
  UpdateNote,
  GetTodosCompletedTodayService,
  GetBacklogService,
  GetTodosTodayService,
  AddNoteByTask,
} from "@/services";
import { LoginService, ResetPasswordService} from "@/services/Login.service";
import { RegisterService } from "@/services/Resgistration.service";
import { makeAutoObservable } from "mobx";

class TodoStore {
  user: User | null = null;
  loading: boolean = false;
  error: string | null = null;
  tasks: TaskProps[] = [];
  taskss: { [date: string]: TaskProps[] } = {};
  tasksToday: TaskProps[] = [];
  completedTasks: TaskProps[] = [];
  summaryTasks: any = [];
  weeklyTasks: any = [];
  notes: any = {};
  notesbydate: any = {};
  category = Category.SCHEDULED;
  completedtoday: TaskProps[] = [];
  backlog: TaskProps[] = [];
  notesByTasks: any = {};
  resetPassword: User | null = null;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      this.loadUserFromLocalStorage();
    }
  }

  loadUserFromLocalStorage() {
    if (typeof window === "undefined") return; // ✅ prevent SSR access
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const userRole = localStorage.getItem("userRole");

    if (userId && username && userRole) {
      this.user = {
        userId: parseInt(userId),
        username,
        userRole,
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        nickname: "",
        contactNo: "",
        birthDate: "",
        createdAt: "",
        updatedAt: "",
        isActive: true,
      };
    }
  }

  setUser(user: User) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this.user = null;
    localStorage.removeItem("user");
  }

  loadUser() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  async login(username: string, password: string) {
    this.loading = true;
    this.error = null;
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await LoginService(TodoRoutes.login, {
        username,
        password,
      });
      if (response?.data) {
        this.setUser(response.data);
      }
    } catch (err: any) {
      this.error = err.response?.data?.message || "Login failed";
    } finally {
      this.loading = false;
    }
  }

  async signup(userData: any) {
    this.loading = true;
    this.error = null;
    try {
      console.log("Sending signup data:", userData);
      const response = await RegisterService(TodoRoutes.register, userData);
      if (response?.data) {
        console.log("Signup successful:", response.data);
        // No auto-login here
      }
    } catch (err: any) {
      console.error("Signup error:", err.response?.data);
      this.error = err.response?.data?.message || "Signup failed";
    } finally {
      this.loading = false;
    }
  }

  addTask(newTask: TaskProps) {
    this.tasks.push(newTask);
    if (
      newTask.category === "scheduled" ||
      newTask.category === "unscheduled"
    ) {
      this.tasksToday.push(newTask);
    }
  }

  deleteTask(id: number) {
    this.tasksToday = this.tasksToday.filter((task) => task.id !== id);
    this.completedTasks = this.completedTasks.filter((task) => task.id !== id);
    this.tasksToday = this.tasksToday.filter((task) => task.id !== id);
  }

  editTask(updatedTask: TaskProps) {
    this.tasksToday = this.tasksToday.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  async fetchTodos(userId: number) {
    if (!this.user) return;
    console.log("fetchTodos userId:", userId);
    this.taskss = await GetTodosService(TodoRoutes.todos, userId);
    console.log("fetchTodos",this.tasks);
  }

  async fetchTodosToday(userId: number) {
    if (!this.user) return;
    this.tasksToday = await GetTodosTodayService(TodoRoutes.tasksToday, userId);
    
  }

  async fetchBacklog(userId: number) {
    if (!this.user) return;
    console.log("Fetching backlog for userId:", userId);
    await GetBacklogService(TodoRoutes.backlog, userId).then(
      (res) => (this.backlog = res?.data || [])
    );
  }

  async fetchCompleted(userId: number) {
    if (!this.user) return;
    await GetTodosCompletedService(TodoRoutes.completed, userId).then(
      (res) => (this.completedTasks = res?.data)
    );
  }

  async fetchCompletedToday(userId: number) {
    if (!this.user) return;
    await GetTodosCompletedTodayService(TodoRoutes.completedtoday, userId).then(
      (res) => (this.completedtoday = res?.data)
    );
  }

  updateTaskStatus(id: number, status: string) {
    let taskIndex = this.completedTasks.findIndex(
      (task: TaskProps) => task.id === id
    );
    let task;
    if (taskIndex !== -1) {
      task = this.completedTasks.splice(taskIndex, 1)[0];
    }
    const taskInItemsIndex = this.tasksToday.findIndex(
      (task: TaskProps) => task.id === id
    );
    if (taskInItemsIndex !== -1) {
      this.tasksToday.splice(taskInItemsIndex, 1);
    }
    if (task) {
      task.status = status;
      if (status === "in_progress") {
        this.tasksToday.push(task);
      }
    }
    this.completedTasks = [...this.completedTasks];
    this.tasksToday = [...this.tasksToday];
  }

  async resetUserPassword(userId: number, newPassword: string): Promise<void> {
    if (!this.user) {
      console.warn("No user is currently set.");
      return;
    }

    try {
      const res: User = await ResetPasswordService(TodoRoutes.resetPassword, userId, newPassword);
      this.resetPassword = res; // Now fully typed
      console.log("Password reset successful for user:", res.username);
    } catch (error: any) {
      console.error("Failed to reset password:", error.response?.data || error.message);
      throw error;
    }
  }


  approveTask(taskId: number, completedAt: string) {
    const taskIndex = this.tasksToday.findIndex(
      (task: TaskProps) => task.id === taskId
    );

    if (taskIndex !== -1) {
      const task = this.tasksToday[taskIndex];
      task.status = "completed";
      task.completedAt = completedAt;
      task.effortBurn = task.effortBurn || 0;
      this.tasksToday.splice(taskIndex, 1);
      this.completedtoday.push(task);
    }
  }

  updateTaskImportance(taskId: number, newImportantValue: boolean) {
    const taskIndex = this.tasksToday.findIndex(
      (tasksToday: TaskProps) => tasksToday.id === taskId
    );
    if (taskIndex !== -1) {
      this.tasksToday[taskIndex] = {
        ...this.tasksToday[taskIndex],
        important: newImportantValue,
      };
    }
  }

  async fetchSummary(userId: number) {
    if (!this.user) return;
    await GetTodosSummaryService(TodoRoutes.summary, userId).then(
      (res) => (this.summaryTasks = res?.data)
    );
  }

  async fetchWeeklyTasks(category: string) {
    await GetTodosWeeklyTasksService(TodoRoutes.weeklyTasks, {
      category: category,
    }).then((res) => {
      this.weeklyTasks = res?.data;
      console.log("Weekly Tasks Data:", this.weeklyTasks); // Check data for Sunday
    });
  }

  async fetchNotes(createdAt: string, content: string) {
    await GetAllNotes(TodoRoutes.notes, {
      createdAt,
      content,
    }).then((res) => {
      this.notes = res?.data;
    });
  }

  async fetchNotesByDate(date: string) {
    await GetAllNotesByDate(TodoRoutes.notesbydate, { date }).then((res) => {
      this.notesbydate = res || {};
      console.log("Notes by date:", this.notesbydate);
    });
  }

  async updateNoteByDate(date: string, content: string) {
    await UpdateNote(TodoRoutes.notes, { date, content }).then((res) => {
      if (res?.data) {
        this.notesbydate = res?.data;
      }
    });
  }

  async addNoteByTask(id: number, note: string) {
    await AddNoteByTask(TodoRoutes.notesByTasks, { id, note }).then((res) => {
      if (res?.data) {
        this.notesByTasks = res?.data;
      }
    });
  }
}

const fetchStore = new TodoStore();
export default fetchStore;
