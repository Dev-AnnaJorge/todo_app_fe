import { TodoApi } from "@/api/todoAppApi";
import { TaskProps } from "@/interfaces";
import { AxiosPromise } from "axios";


const GetTodosService = async (route: string, userId: number): Promise<TaskProps[]> => {
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
    console.error("Error fetching today's tasks:", err);
    return [];
  }
};

const GetBacklogService = async (route: string, userId: number): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.get(`${route}/${userId}`);
    return res;
  } catch (err) {
    const error = err as any;
    console.error("GetBacklogService error:", error.response?.data || error.message);
    throw err;
  }
};

const GetTodoByDateService = async (route: string, data: any): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.post(route, data)
        
        return res;
    }catch(err){
        throw err;
    }
}

const GetTodosCompletedService = async (route: string, userId: number): Promise<AxiosPromise | any>=>{
    try{
      const res = await TodoApi.get(`${route}/${userId}`);

        return res;
    }catch(err){
        throw err;
    }
}
const GetTodosCompletedTodayService = async (route: string, userId:number): Promise<AxiosPromise | any>=>{
  try{
      const res = await TodoApi.get(`${route}/${userId}`)

      return res;
  }catch(err){
      throw err;
  }
}


const GetTodosSummaryService = async (route: string, userId:number): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.get(`${route}/${userId}`)
        return res;
    }catch(err){
        throw err;
    }
}


const GetTodosWeeklyTasksService = async (route: string, data: any): Promise<AxiosPromise | any>=>{
  try{
      const res = await TodoApi.post(route,data)
      return res;
    
  }catch(err){
      throw err;
  }
}

const GetAllNotes = async (route: string, data: any): Promise<AxiosPromise | any> => {
    try {
      const res = await TodoApi.post(route, data);
      return res;
    } catch (err) {
      console.error("Error fetching notes:", err);
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
        console.log({err});
    }
  };
  

  const UpdateNote = async (route: string, data: any): Promise<AxiosPromise | any> => {
    try {
      const res = await TodoApi.put(route, data);
      return res;
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };


  const AddNoteByTask = async (route: string, data: any): Promise<AxiosPromise | any> => {
    try {
      const res = await TodoApi.post(route, data);
      return res;
    } catch (err) {
      console.error("Error fetching notes:", err);
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
     AddNoteByTask
    };