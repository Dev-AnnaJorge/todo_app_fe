import { config } from '@/config';
import axios from 'axios';
import { setupInterceptors } from './interceptors';



const axiosInstance = axios.create({
    baseURL: config.todoAppBaseUrl,
});

setupInterceptors(axiosInstance);

export default axiosInstance;