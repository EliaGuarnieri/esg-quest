import { createContext, type Dispatch, type SetStateAction } from "react";

type ContextValue = {
  fileName: string;
  setFileName: Dispatch<SetStateAction<string>>;
};

export const FileName = createContext<ContextValue>({
  fileName: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFileName: () => {},
});