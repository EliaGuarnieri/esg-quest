import type { Plugin } from "@react-pdf-viewer/core";
import { createContext, type Dispatch, type SetStateAction } from "react";

type ContextValue = {
  plugins: Plugin[];
  setPlugins: Dispatch<SetStateAction<Plugin[]>>;
};

export const PluginsInstance = createContext<ContextValue>({
  plugins: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlugins: () => {},
});
