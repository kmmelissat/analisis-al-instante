import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { storeFileData } from "../analyze/[file_id]/route";

// Helper function to detect data type
function detectDataType(values: any[]): string {
  const nonNullValues = values.filter(
    (v) => v !== null && v !== undefined && v !== ""
  );

  if (nonNullValues.length === 0) return "object";

  // Check if all values are numbers
  const numericValues = nonNullValues.filter(
    (v) => !isNaN(Number(v)) && isFinite(Number(v))
  );
  if (numericValues.length === nonNullValues.length) {
    // Check if all are integers
    const integerValues = numericValues.filter((v) =>
      Number.isInteger(Number(v))
    );
    return integerValues.length === numericValues.length ? "int64" : "float64";
  }

  // Check if values look like dates
  const dateValues = nonNullValues.filter((v) => {
    const date = new Date(v);
    return (
      !isNaN(date.getTime()) &&
      v
        .toString()
        .match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/)
    );
  });

  if (dateValues.length > nonNullValues.length * 0.8) {
    return "datetime64";
  }

  return "object";
}

// Helper function to calculate statistics for numeric columns
function calculateStats(values: number[]) {
  const validValues = values
    .filter((v) => !isNaN(v) && isFinite(v))
    .sort((a, b) => a - b);
  const count = validValues.length;

  if (count === 0) return null;

  const sum = validValues.reduce((a, b) => a + b, 0);
  const mean = sum / count;

  // Calculate standard deviation
  const variance =
    validValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const std = Math.sqrt(variance);

  // Calculate percentiles
  const q1Index = Math.floor(count * 0.25);
  const medianIndex = Math.floor(count * 0.5);
  const q3Index = Math.floor(count * 0.75);

  return {
    count,
    mean: Math.round(mean * 100) / 100,
    std: Math.round(std * 100) / 100,
    min: validValues[0],
    "25%": validValues[q1Index],
    "50%": validValues[medianIndex],
    "75%": validValues[q3Index],
    max: validValues[count - 1],
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided", error: "MISSING_FILE" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message: "Invalid file type. Only CSV and Excel files are supported.",
          error: "INVALID_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    let data: any[][] = [];
    let columns: string[] = [];

    try {
      if (file.type === "text/csv") {
        // Process CSV file
        const text = new TextDecoder().decode(buffer);
        const parseResult = Papa.parse(text, {
          header: false,
          skipEmptyLines: true,
          dynamicTyping: false, // Keep as strings initially for type detection
        });

        if (parseResult.errors.length > 0) {
          console.warn("CSV parsing warnings:", parseResult.errors);
        }

        data = parseResult.data as any[][];
        columns = data[0]?.map((col) => String(col).trim()) || [];
        data = data.slice(1); // Remove header row
      } else {
        // Process Excel file
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: null,
          raw: false, // Keep as strings for type detection
        }) as any[][];

        columns = jsonData[0]?.map((col) => String(col).trim()) || [];
        data = jsonData.slice(1);
      }

      if (columns.length === 0 || data.length === 0) {
        return NextResponse.json(
          {
            message: "File appears to be empty or invalid",
            error: "EMPTY_FILE",
          },
          { status: 400 }
        );
      }

      // Analyze data types for each column
      const dataTypes: { [key: string]: string } = {};
      const summaryStats: { [key: string]: any } = {};

      columns.forEach((column, colIndex) => {
        const columnValues = data.map((row) => row[colIndex]);
        const dataType = detectDataType(columnValues);
        dataTypes[column] = dataType;

        // Calculate statistics for numeric columns
        if (dataType === "int64" || dataType === "float64") {
          const numericValues = columnValues
            .map((v) => Number(v))
            .filter((v) => !isNaN(v) && isFinite(v));
          const stats = calculateStats(numericValues);
          if (stats) {
            summaryStats[column] = stats;
          }
        }
      });

      // Generate response
      const response = {
        file_id: `file_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        filename: file.name,
        columns,
        data_types: dataTypes,
        shape: [data.length, columns.length],
        summary_stats: summaryStats,
        message: `File processed successfully! Analyzed ${
          data.length
        } rows and ${columns.length} columns with ${
          Object.keys(summaryStats).length
        } numeric columns.`,
      };

      // Store file data for analysis
      storeFileData(response.file_id, response);

      return NextResponse.json(response);
    } catch (parseError) {
      console.error("File parsing error:", parseError);
      return NextResponse.json(
        {
          message:
            "Failed to parse the uploaded file. Please ensure it's a valid CSV or Excel file.",
          error: "PARSE_ERROR",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Unknown parsing error",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message: "Internal server error occurred during file processing",
        error: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: "Method not allowed", error: "METHOD_NOT_ALLOWED" },
    { status: 405 }
  );
}
