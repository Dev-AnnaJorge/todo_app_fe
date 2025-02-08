
import { ErrorMessage } from "../errors";


export const handleError = (error: any) => {
  console.error("Error during API call:", error);

  let errorMessage = ErrorMessage.default;

  if (error.response) {
    const status = error.response.status;
    const responseMessage = error.response.data?.message;

    errorMessage = ErrorMessage[status] || responseMessage || ErrorMessage.default;

  } else if (error.message === 'Network Error') {
    errorMessage = 'Network Error. Please check your internet connection and try again.';
  }

//   Swal.fire({
//     icon: 'error',
//     title: 'Login Failed',
//     text: errorMessage,
//   });
};