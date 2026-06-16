import path from "path";
import { readCSV } from "./csvReader";
import { readExcel } from "./excelReader";
import fs from "fs";

export function readData(filePath: string, sheetName?: string) {
  const ext = path.extname(filePath).toLowerCase();
  
  // Safely converts any relative path into an absolute system path 
  // relative to the execution root directory
  const absolutePath = path.resolve(process.cwd(), filePath);

  switch (ext) {
    // case ".csv":
    //   return readCSV(absolutePath);

    // case ".xlsx":
    //   return readExcel(absolutePath, sheetName || "Sheet1");

    case ".json":
      const JSONData = fs.readFileSync(absolutePath, "utf-8");
      return JSON.parse(JSONData);

    default:
      throw new Error(`Unsupported file type - ${ext}`);
  }
}
