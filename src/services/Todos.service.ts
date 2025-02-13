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
const GetAllNotes = async (route: string, data: any): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.post(route, data)
        return res;
    }catch(err){
        throw err;
    }
}

const GetAllNotesByDate = async (route: string, data: any): Promise<AxiosPromise | any>=>{
    try{
        const res = await TodoApi.post(route, data)
        return res;
    }catch(err){
        console.error (err);
    }
}

export { 
    GetTodosService,
     GetTodosCompletedService, 
     GetTodosSummaryService, 
     GetTodosWeeklyTasksService,
     GetAllNotes,
     GetAllNotesByDate,
     GetTodoByDateService
    
    };