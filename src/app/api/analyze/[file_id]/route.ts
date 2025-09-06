import { NextRequest, NextResponse } from "next/server";
import { AnalyzeResponse, AIChartSuggestion, ChartType } from "@/types/charts";

// Mock data storage - in production, use a database
const fileStorage = new Map<string, any>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ file_id: string }> }
) {
  try {
    const { file_id } = await params;

    // Get the stored file data (in production, fetch from database)
    const fileData = fileStorage.get(file_id);

    if (!fileData) {
      return NextResponse.json(
        { message: "File not found", error: "FILE_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Extract data summary from the stored file data
    const dataSummary = {
      total_rows: fileData.shape[0],
      total_columns: fileData.shape[1],
      numeric_columns: Object.entries(fileData.data_types)
        .filter(([_, type]) => type === "int64" || type === "float64")
        .map(([column, _]) => column),
      categorical_columns: Object.entries(fileData.data_types)
        .filter(([_, type]) => type === "object")
        .map(([column, _]) => column),
      datetime_columns: Object.entries(fileData.data_types)
        .filter(([_, type]) => type === "datetime64")
        .map(([column, _]) => column),
      missing_data_summary: {}, // Would calculate from actual data
    };

    // Generate AI insights based on the data
    const aiInsights = generateAIInsights(dataSummary, fileData);

    // Generate chart suggestions based on data characteristics
    const suggestedCharts = generateChartSuggestions(dataSummary, fileData);

    const response: AnalyzeResponse = {
      file_id,
      filename: fileData.filename,
      data_summary: dataSummary,
      ai_insights: aiInsights,
      suggested_charts: suggestedCharts,
      message: `Analysis complete! Generated ${suggestedCharts.length} chart recommendations based on your data structure and patterns.`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        message: "Internal server error occurred during analysis",
        error: "ANALYSIS_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateAIInsights(dataSummary: any, fileData: any) {
  const { numeric_columns, categorical_columns, datetime_columns, total_rows } =
    dataSummary;

  // Generate overview
  let overview = `Your dataset contains ${total_rows} records with ${dataSummary.total_columns} columns. `;

  if (numeric_columns.length > 0) {
    overview += `There are ${numeric_columns.length} numeric columns ideal for statistical analysis and trend visualization. `;
  }

  if (categorical_columns.length > 0) {
    overview += `${categorical_columns.length} categorical columns provide excellent grouping and comparison opportunities. `;
  }

  if (datetime_columns.length > 0) {
    overview += `Time-based analysis is possible with ${datetime_columns.length} datetime columns. `;
  }

  // Generate key patterns
  const keyPatterns = [];

  if (numeric_columns.length >= 2) {
    keyPatterns.push(
      `Multiple numeric variables (${numeric_columns.join(
        ", "
      )}) suggest correlation analysis opportunities`
    );
  }

  if (categorical_columns.length > 0 && numeric_columns.length > 0) {
    keyPatterns.push(
      `Combination of categorical and numeric data enables comparative analysis across groups`
    );
  }

  if (datetime_columns.length > 0) {
    keyPatterns.push(
      `Time-series data detected - trend analysis and temporal patterns can be explored`
    );
  }

  // Check for specific column patterns
  const columnNames = [
    ...numeric_columns,
    ...categorical_columns,
    ...datetime_columns,
  ];
  if (
    columnNames.some(
      (col) =>
        col.toLowerCase().includes("sales") ||
        col.toLowerCase().includes("revenue")
    )
  ) {
    keyPatterns.push(
      `Sales/revenue data detected - business performance analysis recommended`
    );
  }

  if (
    columnNames.some(
      (col) =>
        col.toLowerCase().includes("date") || col.toLowerCase().includes("time")
    )
  ) {
    keyPatterns.push(
      `Temporal data structure suitable for time-series analysis and forecasting`
    );
  }

  // Data quality notes
  const dataQualityNotes = [];

  if (total_rows < 50) {
    dataQualityNotes.push(
      `Small dataset (${total_rows} rows) - individual data points will be clearly visible in charts`
    );
  } else if (total_rows > 1000) {
    dataQualityNotes.push(
      `Large dataset (${total_rows} rows) - aggregation recommended for cleaner visualizations`
    );
  }

  if (numeric_columns.length === 0) {
    dataQualityNotes.push(
      `No numeric columns detected - analysis limited to categorical distributions`
    );
  }

  // Analysis approach recommendation
  let recommendedApproach =
    "Start with overview charts to understand data distribution, then drill down into specific relationships. ";

  if (datetime_columns.length > 0) {
    recommendedApproach +=
      "Begin with time-series analysis to identify trends. ";
  }

  if (numeric_columns.length >= 2) {
    recommendedApproach += "Explore correlations between numeric variables. ";
  }

  if (categorical_columns.length > 0) {
    recommendedApproach +=
      "Use categorical groupings to segment your analysis.";
  }

  return {
    overview,
    key_patterns: keyPatterns,
    data_quality_notes: dataQualityNotes,
    recommended_analysis_approach: recommendedApproach,
  };
}

function generateChartSuggestions(
  dataSummary: any,
  fileData: any
): AIChartSuggestion[] {
  const { numeric_columns, categorical_columns, datetime_columns, total_rows } =
    dataSummary;
  const suggestions: AIChartSuggestion[] = [];

  // 1. Overview Charts (High Priority)
  if (categorical_columns.length > 0) {
    suggestions.push({
      chart_type: "bar" as ChartType,
      title: `${categorical_columns[0].replace(/_/g, " ")} Distribution`,
      description: `Compare frequencies across ${categorical_columns[0]} categories`,
      reasoning: `Bar charts are ideal for comparing categorical data. ${categorical_columns[0]} appears to be a key grouping variable.`,
      parameters: {
        x_axis: categorical_columns[0],
        aggregation: "count",
        sort_order: "desc",
        limit: 10,
      },
      priority: 9,
      category: "overview",
    });

    // Pie chart for categorical distribution
    suggestions.push({
      chart_type: "pie" as ChartType,
      title: `${categorical_columns[0].replace(/_/g, " ")} Composition`,
      description: `Part-to-whole view of ${categorical_columns[0]} distribution`,
      reasoning: `Pie charts effectively show proportional relationships in categorical data.`,
      parameters: {
        x_axis: categorical_columns[0],
        percentage: true,
        limit: 7,
      },
      priority: 7,
      category: "overview",
    });
  }

  // 2. Numeric Distribution Analysis
  if (numeric_columns.length > 0) {
    const primaryNumeric = numeric_columns[0];

    suggestions.push({
      chart_type: "histogram" as ChartType,
      title: `${primaryNumeric.replace(/_/g, " ")} Distribution`,
      description: `Analyze the distribution pattern of ${primaryNumeric}`,
      reasoning: `Histograms reveal distribution shape, outliers, and data patterns in numeric variables.`,
      parameters: {
        x_axis: primaryNumeric,
        bins: Math.min(20, Math.max(10, Math.floor(Math.sqrt(total_rows)))),
      },
      priority: 8,
      category: "statistical",
    });

    // Box plot if we have categorical grouping
    if (categorical_columns.length > 0) {
      suggestions.push({
        chart_type: "box" as ChartType,
        title: `${primaryNumeric.replace(
          /_/g,
          " "
        )} by ${categorical_columns[0].replace(/_/g, " ")}`,
        description: `Compare ${primaryNumeric} distributions across ${categorical_columns[0]} groups`,
        reasoning: `Box plots reveal statistical summaries and outliers across different categories.`,
        parameters: {
          y_axis: primaryNumeric,
          x_axis: categorical_columns[0],
          show_outliers: true,
        },
        priority: 8,
        category: "comparative",
      });
    }
  }

  // 3. Time Series Analysis
  if (datetime_columns.length > 0 && numeric_columns.length > 0) {
    suggestions.push({
      chart_type: "line" as ChartType,
      title: `${numeric_columns[0].replace(/_/g, " ")} Trends Over Time`,
      description: `Track ${numeric_columns[0]} changes over ${datetime_columns[0]}`,
      reasoning: `Line charts are perfect for showing trends and patterns in time-series data.`,
      parameters: {
        x_axis: datetime_columns[0],
        y_axis: numeric_columns[0],
        aggregation: "mean",
      },
      priority: 9,
      category: "overview",
    });
  }

  // 4. Correlation Analysis
  if (numeric_columns.length >= 2) {
    suggestions.push({
      chart_type: "scatter" as ChartType,
      title: `${numeric_columns[0].replace(
        /_/g,
        " "
      )} vs ${numeric_columns[1].replace(/_/g, " ")}`,
      description: `Explore relationship between ${numeric_columns[0]} and ${numeric_columns[1]}`,
      reasoning: `Scatter plots reveal correlations, patterns, and outliers between numeric variables.`,
      parameters: {
        x_axis: numeric_columns[0],
        y_axis: numeric_columns[1],
        color_by:
          categorical_columns.length > 0 ? categorical_columns[0] : undefined,
      },
      priority: 8,
      category: "detailed",
    });

    // Bubble chart if we have a third numeric variable
    if (numeric_columns.length >= 3) {
      suggestions.push({
        chart_type: "bubble" as ChartType,
        title: `Multi-dimensional Analysis: ${numeric_columns[0]}, ${numeric_columns[1]}, ${numeric_columns[2]}`,
        description: `3D relationship analysis with ${numeric_columns[2]} as bubble size`,
        reasoning: `Bubble charts enable analysis of three numeric dimensions simultaneously.`,
        parameters: {
          x_axis: numeric_columns[0],
          y_axis: numeric_columns[1],
          size_by: numeric_columns[2],
          color_by:
            categorical_columns.length > 0 ? categorical_columns[0] : undefined,
        },
        priority: 6,
        category: "detailed",
      });
    }
  }

  // 5. Advanced Grouping Analysis
  if (categorical_columns.length > 0 && numeric_columns.length > 0) {
    // Stacked bar for multi-dimensional categorical analysis
    if (categorical_columns.length >= 2) {
      suggestions.push({
        chart_type: "stacked_bar" as ChartType,
        title: `${numeric_columns[0].replace(/_/g, " ")} by ${
          categorical_columns[0]
        } and ${categorical_columns[1]}`,
        description: `Analyze ${numeric_columns[0]} across multiple categorical dimensions`,
        reasoning: `Stacked bars show both total values and sub-category breakdowns effectively.`,
        parameters: {
          x_axis: categorical_columns[0],
          y_axis: numeric_columns[0],
          stack_by: categorical_columns[1],
          aggregation: "sum",
        },
        priority: 7,
        category: "comparative",
      });
    }

    // Heatmap for pattern detection
    if (categorical_columns.length >= 2) {
      suggestions.push({
        chart_type: "heatmap" as ChartType,
        title: `${categorical_columns[0]} vs ${categorical_columns[1]} Heatmap`,
        description: `Pattern detection across ${categorical_columns[0]} and ${categorical_columns[1]}`,
        reasoning: `Heatmaps reveal patterns and relationships in two-dimensional categorical data.`,
        parameters: {
          x_axis: categorical_columns[0],
          y_axis: categorical_columns[1],
          color_by: numeric_columns[0],
          aggregation: "mean",
        },
        priority: 6,
        category: "detailed",
      });
    }
  }

  // 6. Multi-dimensional Analysis
  if (numeric_columns.length >= 3) {
    suggestions.push({
      chart_type: "radar" as ChartType,
      title: `Multi-dimensional Profile Analysis`,
      description: `Compare profiles across all numeric dimensions`,
      reasoning: `Radar charts provide comprehensive multi-dimensional comparisons and profile analysis.`,
      parameters: {
        group_by:
          categorical_columns.length > 0 ? categorical_columns[0] : undefined,
        aggregation: "mean",
        limit: 6,
      },
      priority: 5,
      category: "detailed",
    });
  }

  // Sort by priority (highest first)
  suggestions.sort((a, b) => b.priority - a.priority);

  // Limit to top 8 suggestions to avoid overwhelming the user
  return suggestions.slice(0, 8);
}

// Store file data for analysis (temporary - in production use database)
export function storeFileData(fileId: string, data: any) {
  fileStorage.set(fileId, data);
}
