import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
