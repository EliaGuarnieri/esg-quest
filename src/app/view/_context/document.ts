import { type PdfJs } from "@react-pdf-viewer/core";
import { createContext, type Dispatch, type SetStateAction } from "react";

type ContextValue = {
  document: PdfJs.PdfDocument | null;
  setDocument: Dispatch<SetStateAction<PdfJs.PdfDocument | null>>;
};

export const Document = createContext<ContextValue>({
  document: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setDocument: () => {},
});
