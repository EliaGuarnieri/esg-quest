import { type PdfJs } from "@react-pdf-viewer/core";
import { type HighlightArea } from "@react-pdf-viewer/highlight";

export type ExtendedPageTextItem = PdfJs.PageTextItem & {
  height: number;
  width: number;
  transform: [number, number, number, number, number, number];
};

export type Note = {
  id: string;
  text: string;
  area: HighlightArea;
  fileId: number;
};