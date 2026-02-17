const defaultApiHost = 'http://127.0.0.1:8000/api';
const apiHost = import.meta.env.VITE_API_HOST ?? defaultApiHost;
const apiDomain = import.meta.env.VITE_API_DOMAIN ?? '';

export const API_HOST = String(apiHost).trim() || defaultApiHost;
export const API_DOMAIN = (() => {
  const d = String(apiDomain).trim();
  if (d) return d.replace(/\/+$/, '');
  if (API_HOST.startsWith('http')) {
    try {
      return new URL(API_HOST).origin;
    } catch {
      return 'http://127.0.0.1:8000';
    }
  }
  return '';
})();
