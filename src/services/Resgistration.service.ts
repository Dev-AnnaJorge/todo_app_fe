import { TodoApi } from "@/api/todoAppApi";
import { AxiosError, AxiosPromise } from "axios";

const RegisterService = async (
  route: string,
  data: any
): Promise<AxiosPromise | any> => {
  try {
    const res = await TodoApi.post(route, data);
    return res;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export { RegisterService };
