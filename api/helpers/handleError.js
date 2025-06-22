export const handleError = (statusCode, message) => {
  const error = new Error(message); // ✅ Pass the message directly
  error.statusCode = statusCode;
  return error;
};
