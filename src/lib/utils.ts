import { type PdfJs } from "@react-pdf-viewer/core";
import { type HighlightArea } from "@react-pdf-viewer/highlight";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { type ExtendedPageTextItem } from "@/app/view/_types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function transformJsonString(jsonString: string) {
  try {
      // Define the structure of the input and output data
      interface InputData {
          text: string;
          page: number;
      }

      interface OutputData {
          texts: string[];
          page: number;
      }

      // Parse the input JSON string
      const dataArray = JSON.parse(jsonString) as InputData[];
      const transformedData: OutputData[] = [];

      // Iterate over each item in the array
      dataArray.forEach((item) => {
          // Split the text by line breaks, trim each line, and create a new object for each line
          const lines = item.text.split(/\n|\r/).map(line => line.trim()).filter(line => line !== '');
          transformedData.push({ texts: lines, page: item.page });
      });

      return transformedData.sort((a, b) => a.page - b.page);
  } catch (error) {
      console.error("Invalid JSON string:", error);
      return null;
  }
}

/**
 * Extracts the area of the highlighted text
 * @param items The text items of the page
 * @param viewport The viewport of the page
 * @param pageIndex The index of the page
 * @returns The area of the highlighted text
 */
export const extractArea = ({
    items,
    viewport,
    pageIndex,
  }: {
    items: ExtendedPageTextItem[];
    viewport: PdfJs.ViewPort;
    pageIndex: number;
  }): HighlightArea[] => {
    const viewportHeight = viewport.height;
    const viewportWidth = viewport.width;

    const areas = items.map((item) => {
      // Convert the item's coordinates to the viewport's coordinate system
      const left = ((item.transform[4]) / viewportWidth) * 100;
      const top = ((viewportHeight - item.transform[5] - item.height) / viewportHeight) * 100;

      // Convert the item's dimensions to percentages relative to the viewport's dimensions
      const width = (item.width / viewportWidth) * 100;
      const height = (item.height / viewportHeight) * 100;

      return {
        height,
        width,
        top,
        left,
        pageIndex: pageIndex - 1,
      };
    });

    return areas
  };
