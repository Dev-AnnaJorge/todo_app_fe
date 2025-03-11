import { TodoApi } from "@/api/todoAppApi";
import { AxiosPromise, AxiosError } from "axios";

const LoginService = async (route: string, data: {username: string; password: string }): Promise<AxiosPromise | any> => {
    try {
        const res = await TodoApi.post(route, data);
        return res;
    } catch (err) {
        const error = err as AxiosError;
        console.error("Login failed:", error.response?.data || error.message);
    }
};

const ResetPasswordService = async (route: string, userId: number, password: string) => {
    try {
      const res = await TodoApi.put(`${route}/${userId}`, { password }); 
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  
export { LoginService,  ResetPasswordService, };