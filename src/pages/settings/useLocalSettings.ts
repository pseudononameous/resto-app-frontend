import { useEffect, useState } from 'react';

export function useLocalSettings<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // ignore parse errors
    }
  }, [key]);

  const update = (next: T) => {
    setValue(next);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  return [value, update];
}

