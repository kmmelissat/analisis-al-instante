import { NextRequest, NextResponse } from "next/server";
import {
  generateBarChartData,
  generatePieChartData,
  generateLineChartData,
  generateScatterChartData,
  generateHistogramData,
  generateBoxPlotData,
  generateRadarChartData,
  generateHeatmapData,
} from "./generators";
import { serverFileStorage } from "@/lib/storage";

interface ChartRequest {
  file_id: string;
  chart_type: string;
  parameters: Record<string, any>;
}

interface ChartResponse {
  chart_type: string;
  data: any[];
  metadata: {
    x_column?: string;
    y_column?: string;
    color_column?: string;
    size_column?: string;
    total_points: number;
    [key: string]: any;
  };
  title: string;
  insight?: string;
  interpretation?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChartRequest = await request.json();
    const { file_id, chart_type, parameters } = body;

    console.log(
      `[Chart-Data] Request for file_id: ${file_id}, chart_type: ${chart_type}`
    );
    console.log(
      `[Chart-Data] Server storage has ${serverFileStorage.keys().length} files`
    );

    // Get the stored file data
    const fileData = serverFileStorage.get(file_id);

    if (!fileData) {
      console.error(`File not found for ID: ${file_id}`);
      console.error("Available file IDs:", serverFileStorage.keys());
      return NextResponse.json(
        { message: "File not found", error: "FILE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Validate that sample_data exists
    if (!fileData.sample_data) {
      console.error(
        `File ${file_id} found but missing sample_data:`,
        Object.keys(fileData)
      );
      return NextResponse.json(
        {
          message: "File data incomplete - missing sample data",
          error: "INCOMPLETE_DATA",
        },
        { status: 400 }
      );
    }

    // Generate chart data based on chart type and parameters
    console.log(`Generating ${chart_type} chart for file ${file_id}`);
    console.log(`Parameters:`, parameters);
    console.log(`Sample data keys:`, Object.keys(fileData.sample_data));
    const chartData = generateChartData(fileData, chart_type, parameters);

    const response: ChartResponse = {
      chart_type,
      data: chartData.data,
      metadata: chartData.metadata,
      title: chartData.title,
      insight: chartData.insight,
      interpretation: chartData.interpretation,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chart data generation error:", error);
    return NextResponse.json(
      {
        message: "Internal server error occurred during chart data generation",
        error: "CHART_DATA_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateChartData(fileData: any, chartType: string, parameters: any) {
  const { sample_data } = fileData;

  if (!sample_data) {
    throw new Error("Sample data not found in file data");
  }

  // Convert sample_data object to array format for easier processing
  const dataArray = convertToArrayFormat(sample_data);

  if (dataArray.length === 0) {
    throw new Error("No data available for chart generation");
  }

  switch (chartType) {
    case "bar":
      return generateBarChartData(dataArray, parameters);
    case "pie":
      return generatePieChartData(dataArray, parameters);
    case "line":
      return generateLineChartData(dataArray, parameters);
    case "scatter":
      return generateScatterChartData(dataArray, parameters);
    case "histogram":
      return generateHistogramData(dataArray, parameters);
    case "box":
      return generateBoxPlotData(dataArray, parameters);
    case "stacked_bar":
      return generateBarChartData(dataArray, parameters); // Use bar chart for now
    case "bubble":
      return generateScatterChartData(dataArray, parameters); // Use scatter for now
    case "heatmap":
      return generateHeatmapData(dataArray, parameters);
    case "radar":
      return generateRadarChartData(dataArray, parameters);
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
}

function convertToArrayFormat(
  sampleData: Record<string, any[]>
): Record<string, any>[] {
  const keys = Object.keys(sampleData);
  const length = sampleData[keys[0]]?.length || 0;

  const result = [];
  for (let i = 0; i < length; i++) {
    const row: Record<string, any> = {};
    keys.forEach((key) => {
      row[key] = sampleData[key][i];
    });
    result.push(row);
  }

  return result;
}
