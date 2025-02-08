import { AxiosError, AxiosResponse } from 'axios';

export const setupInterceptors = (axiosInstance: any) => {
    axiosInstance.interceptors.response.use(
        interceptSuccessResponse,
        interceptErrorResponse,
    );
};

function interceptErrorResponse(error: AxiosError) {
    throw error;
}

function interceptSuccessResponse(res: AxiosResponse) {
    return res;
}