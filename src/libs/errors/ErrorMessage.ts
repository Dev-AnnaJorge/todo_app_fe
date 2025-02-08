import { ErrorCode } from "./ErrorCode";

export const ErrorMessage = {
  [ErrorCode.INVALID_INPUT]: 'Invalid input. Please check your credentials.',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized. Please check your email and password.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.SERVER_ERROR]: 'Server error. Please try again later.',
  default: 'Error logging in. Please try again.',
};