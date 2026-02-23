import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ApiEndpoint = {
  method: string;
  path: string;
  description: string;
  bodyExample?: object;
};

export type ApiHelpSpec = {
  resourceName: string;
  basePath: string;
  endpoints: ApiEndpoint[];
};

type ApiHelpContextValue = {
  apiHelp: ApiHelpSpec | null;
  setApiHelp: (spec: ApiHelpSpec | null) => void;
  sidebarOpened: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const ApiHelpContext = createContext<ApiHelpContextValue | null>(null);

export function ApiHelpProvider({ children }: { children: ReactNode }) {
  const [apiHelp, setApiHelpState] = useState<ApiHelpSpec | null>(null);
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const setApiHelp = useCallback((spec: ApiHelpSpec | null) => setApiHelpState(spec), []);
  const openSidebar = useCallback(() => setSidebarOpened(true), []);
  const closeSidebar = useCallback(() => setSidebarOpened(false), []);
  return (
    <ApiHelpContext.Provider value={{ apiHelp, setApiHelp, sidebarOpened, openSidebar, closeSidebar }}>
      {children}
    </ApiHelpContext.Provider>
  );
}

export function useApiHelp() {
  const ctx = useContext(ApiHelpContext);
  if (!ctx) return { apiHelp: null, setApiHelp: () => { }, sidebarOpened: false, openSidebar: () => { }, closeSidebar: () => { } };
  return ctx;
}

export function buildApiSpec(
  resourceName: string,
  basePath: string,
  createBody?: object,
  updateBody?: object
): ApiHelpSpec {
  const id = "{id}";
  return {
    resourceName,
    basePath: `/v1/${basePath}`,
    endpoints: [
      { method: "GET", path: `/v1/${basePath}`, description: "List all records" },
      { method: "GET", path: `/v1/${basePath}/${id}`, description: "Get a single record by ID" },
      { method: "POST", path: `/v1/${basePath}`, description: "Create a new record", bodyExample: createBody ?? undefined },
      { method: "PUT", path: `/v1/${basePath}/${id}`, description: "Update a record", bodyExample: updateBody ?? createBody ?? undefined },
      { method: "DELETE", path: `/v1/${basePath}/${id}`, description: "Delete a record" },
    ],
  };
}
