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
export { LoginService };