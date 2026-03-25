
import { toast } from 'react-toastify';
import { ApiError } from '../services/apiClient';

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (error: unknown, defaultMessage = 'An unexpected error occurred.') => {
  let message = defaultMessage;
  if (error instanceof ApiError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  toast.error(message);
};
