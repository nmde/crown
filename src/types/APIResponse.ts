type APIResponse<T> = {
  message: string;
  error?: string;
  statusCode: number;
  data?: T;
};

export default APIResponse;
