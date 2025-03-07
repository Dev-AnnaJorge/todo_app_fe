import { TodoApi } from "@/api/todoAppApi";
import { AxiosPromise } from "axios";

const RegisterService = async (route: string, data: any): Promise<AxiosPromise | any> => {
    try {
      const res = await TodoApi.post(route, data);
      return res;
    } catch (err) {
      console.error("Error during registration:", err);
      throw err;
    }
  };
  

export { RegisterService };