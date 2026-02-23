import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type StoreContextValue = { storeId: number | null; setStoreId: (id: number | null) => void };
const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [storeId, setStoreId] = useState<number | null>(null);
  const value: StoreContextValue = { storeId, setStoreId: useCallback((id) => setStoreId(id), []) };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStoreId(): number | null {
  const ctx = useContext(StoreContext);
  return ctx?.storeId ?? null;
}

export function useStoreContext(): StoreContextValue | null {
  return useContext(StoreContext);
}
