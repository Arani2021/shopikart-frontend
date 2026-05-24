const normalizeUrl = (value) => {
  if (!value) {
    return 'http://localhost:5000';
  }

  return value.replace(/\/$/, '');
};

export const BACKEND_URL = normalizeUrl(
  process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL
);

export const API_BASE_URL = `${BACKEND_URL}/api`;