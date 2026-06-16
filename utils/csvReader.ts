import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export function readCSV(filePath: string) {
  // const fullPath = path.resolve(filepath);

  const fileContent = fs.readFileSync(filePath);

  const records = parse(fileContent, {
    // first row becomes keys
    columns: true,
    skip_empty_lines: true,
  });
  //   return array of objects (perfect for loop)
  return records;
}
