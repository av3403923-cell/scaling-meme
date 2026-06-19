export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

export const STATUS_CODES = {
  SUCCESS: { 200: 'OK', 201: 'Created', 204: 'No Content' },
  REDIRECT: { 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified' },
  CLIENT_ERROR: { 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found' },
  SERVER_ERROR: { 500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable' },
};

export const MIME_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  HTML: 'text/html',
  PLAIN: 'text/plain',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
};

export const MAX_BODY_SIZE = 50 * 1024 * 1024;
export const MAX_REQUESTS_STORE = 10000;
export const DEFAULT_PROXY_PORT = 8080;
export const DEFAULT_API_PORT = 3000;