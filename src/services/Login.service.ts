import { TodoApi } from "@/api/todoAppApi";
import { AxiosPromise } from "axios";

const LoginService = async (route: string, data: {username: string; password: string }): Promise<AxiosPromise | any> => {
    try {
        const res = await TodoApi.post(route, data);
        return res;
    } catch (err) {
        console.error("Error during login:", err);
        throw err;
    }
};

export { LoginService };