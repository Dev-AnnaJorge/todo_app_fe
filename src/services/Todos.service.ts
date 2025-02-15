import { TodoApi } from "@/api/todoAppApi";
import { AxiosPromise } from "axios";

const GetTodosService = async (route: string): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.get(route);

        return res;
    }catch(err){
        throw err;
    }
}
const GetTodoByDateService = async (route: string, data: any): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.post(route, data)
        
        return res;
    }catch(err){
        throw err;
    }
}

const GetTodosCompletedService = async (route: string, data: any): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.post(route, data)

        return res;
    }catch(err){
        throw err;
    }
}


const GetTodosSummaryService = async (route: string, data: any): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.post(route, data)
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

export { 
    GetTodosService,
     GetTodosCompletedService, 
     GetTodosSummaryService, 
     GetTodosWeeklyTasksService,
     GetAllNotes,
     GetAllNotesByDate,
     GetTodoByDateService,
     UpdateNote
    };