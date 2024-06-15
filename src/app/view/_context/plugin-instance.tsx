import { type Dispatch, type SetStateAction, createContext } from "react";
import type { Plugin } from "@react-pdf-viewer/core";

type ContextValue = {
  plugins: Plugin[];
  setPlugins: Dispatch<SetStateAction<Plugin[]>>;
};

export const PluginsInstance = createContext<ContextValue>({
  plugins: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlugins: () => {},
});
