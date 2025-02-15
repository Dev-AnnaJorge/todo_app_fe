import { AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

export const TodoApi = {
  get: (endpoint: string, params?: any) => axiosInstance.get(endpoint, params),
  post: (endpoint: string, body?: unknown, headers?: AxiosRequestConfig) => axiosInstance.post(endpoint, body, headers),
  put: (endpoint: string, body?: unknown, headers?: AxiosRequestConfig) => axiosInstance.put(endpoint, body, headers),
  
}
