import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

export const TodoApi = {
    get: (endpoint: string, params?:any) => axiosInstance.get(endpoint,params),
    post: (endpoint: string, body?: unknown, headers?: AxiosRequestConfig) => {
        return axiosInstance.post(endpoint, body, headers);
    },
};