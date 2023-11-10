export function buildErrorData(err?: any) {
  const errorData = {
    message: '',
    name: '',
    reason: '',
    code: '',
    action: '',
  };
  if (!err) {
    return errorData;
  }
  if (!err.originalError) {
    errorData.message = err.message;
    return errorData;
  }
  return {
    message: err.message,
    name: err.originalError.name,
    reason: err.originalError.reason,
    code: err.originalError.code,
    action: err.originalError.action,
  };
}
