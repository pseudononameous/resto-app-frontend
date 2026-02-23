import { useEffect } from "react";
import { useApiHelp, buildApiSpec, type ApiHelpSpec } from "@contexts/ApiHelpContext";

export function usePageApiHelp(spec: ApiHelpSpec | null) {
  const { setApiHelp } = useApiHelp();
  useEffect(() => {
    setApiHelp(spec);
    return () => setApiHelp(null);
  }, [spec?.resourceName, spec?.basePath, setApiHelp]);
}

export function usePageApiHelpSimple(resourceName: string, basePath: string, createBody?: object) {
  const { setApiHelp } = useApiHelp();
  useEffect(() => {
    setApiHelp(buildApiSpec(resourceName, basePath, createBody, createBody));
    return () => setApiHelp(null);
  }, [resourceName, basePath, setApiHelp]);
}
