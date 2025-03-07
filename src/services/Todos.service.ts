import { TodoApi } from "@/api/todoAppApi";
import { TaskProps } from "@/interfaces";
import { AxiosError, AxiosPromise } from "axios";

const GetTodosService = async (
  route: string,
  userId: number
): Promise<TaskProps[]> => {
  const res = await TodoApi.get(`${route}/${userId}`);
  return res.data;
};

const GetTodosTodayService = async (
  route: string,
  userId: number
): Promise<TaskProps[]> => {
  try {
    const res = await TodoApi.get(`${route}/${userId}`);
    return res.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
    return [];
  }
};

const GetBacklogService = async (
  route: string,
  userId: number
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.get(`${route}/${userId}`);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const GetTodoByDateService = async (
  route: string,
  data: any
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.post(route, data);

    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const GetTodosCompletedService = async (
  route: string,
  userId: number
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.get(`${route}/${userId}`);

    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};
const GetTodosCompletedTodayService = async (
  route: string,
  userId: number
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.get(`${route}/${userId}`);

    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const GetTodosSummaryService = async (
  route: string,
  userId: number
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.get(`${route}/${userId}`);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const GetTodosWeeklyTasksService = async (
  route: string,
  data: any
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.post(route, data);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const GetAllNotes = async (
  route: string,
  data: any
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.post(route, data);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const GetAllNotesByDate = async (route: string, data: any): Promise<any> => {
  try {
    const res = await TodoApi.post(route, data);

    if (res.status !== 200 && res.status !== 201) {
      console.log("Error: Invalid response status", res.status);
      return {};
    }
    return res.data;
  } catch (err: any) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const UpdateNote = async (
  route: string,
  data: any
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.put(route, data);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const AddNoteByTask = async (
  route: string,
  data: any
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.post(route, data);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
  }
};
export {
  GetTodosService,
  GetTodosCompletedService,
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
};
