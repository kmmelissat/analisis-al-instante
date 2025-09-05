// Chart utilities for Análisis al Instante
import {
  ChartType,
  ChartParameters,
  ChartRequirements,
  ChartSelectionMatrix,
  ChartPreset,
  ChartCategory,
  AggregationFunction,
} from "@/types";

// Chart category mapping
export const CHART_CATEGORIES: Record<ChartType, ChartCategory> = {
  // Basic Charts
  bar: "basic",
  line: "basic",
  pie: "basic",
  scatter: "basic",
  histogram: "basic",
  box: "basic",

  // Advanced Charts
  area: "advanced",
  donut: "advanced",
  violin: "advanced",
  heatmap: "advanced",
  bubble: "advanced",
  radar: "advanced",
  treemap: "advanced",
  sunburst: "advanced",

  // Statistical Charts
  density: "statistical",
  ridgeline: "statistical",
  candlestick: "statistical",
  waterfall: "statistical",

  // Specialized Charts
  gantt: "specialized",
  sankey: "specialized",
  chord: "specialized",
  funnel: "specialized",

  // Multi-series Charts
  stacked_bar: "multi_series",
  grouped_bar: "multi_series",
  multi_line: "multi_series",
  stacked_area: "multi_series",
};

// Chart requirements definition
export const CHART_REQUIREMENTS: Record<ChartType, ChartRequirements> = {
  // Basic Charts
  bar: {
    required_parameters: ["x_axis"],
    optional_parameters: [
      "y_axis",
      "aggregation",
      "sort_by",
      "sort_order",
      "limit",
    ],
    data_types: { x_axis: "categorical", y_axis: "numeric" },
    min_data_points: 1,
    max_categories: 50,
  },
  line: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["rolling_window", "time_unit", "cumulative"],
    data_types: { x_axis: "datetime", y_axis: "numeric" },
    min_data_points: 2,
  },
  pie: {
    required_parameters: ["x_axis"],
    optional_parameters: ["limit", "percentage", "sort_order"],
    data_types: { x_axis: "categorical" },
    min_data_points: 2,
    max_categories: 8,
  },
  scatter: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["color_by", "size_by", "opacity_by", "shape_by"],
    data_types: {
      x_axis: "numeric",
      y_axis: "numeric",
      color_by: "categorical",
      size_by: "numeric",
    },
    min_data_points: 3,
  },
  histogram: {
    required_parameters: ["x_axis"],
    optional_parameters: ["bins", "normalize", "cumulative"],
    data_types: { x_axis: "numeric" },
    min_data_points: 10,
  },
  box: {
    required_parameters: ["y_axis"],
    optional_parameters: ["x_axis", "show_outliers"],
    data_types: { y_axis: "numeric", x_axis: "categorical" },
    min_data_points: 5,
  },

  // Advanced Charts
  area: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["stack_by", "normalize", "cumulative"],
    data_types: { x_axis: "datetime", y_axis: "numeric" },
    min_data_points: 3,
  },
  donut: {
    required_parameters: ["x_axis"],
    optional_parameters: ["limit", "percentage", "sort_order", "inner_radius"],
    data_types: { x_axis: "categorical" },
    min_data_points: 2,
    max_categories: 8,
  },
  violin: {
    required_parameters: ["y_axis"],
    optional_parameters: ["x_axis", "bandwidth"],
    data_types: { y_axis: "numeric", x_axis: "categorical" },
    min_data_points: 10,
  },
  heatmap: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["color_by", "aggregation", "normalize", "threshold"],
    data_types: { x_axis: "categorical", y_axis: "categorical" },
    min_data_points: 4,
  },
  bubble: {
    required_parameters: ["x_axis", "y_axis", "size_by"],
    optional_parameters: ["color_by", "opacity_by"],
    data_types: {
      x_axis: "numeric",
      y_axis: "numeric",
      size_by: "numeric",
      color_by: "categorical",
    },
    min_data_points: 3,
  },
  radar: {
    required_parameters: [],
    optional_parameters: [
      "group_by",
      "aggregation",
      "limit",
      "normalize",
      "axes",
    ],
    data_types: { group_by: "categorical" },
    min_data_points: 3,
  },
  treemap: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["color_by"],
    data_types: {
      x_axis: "categorical",
      y_axis: "numeric",
      color_by: "categorical",
    },
    min_data_points: 2,
  },
  sunburst: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["color_by"],
    data_types: {
      x_axis: "categorical",
      y_axis: "numeric",
      color_by: "categorical",
    },
    min_data_points: 2,
  },

  // Statistical Charts
  density: {
    required_parameters: ["x_axis"],
    optional_parameters: ["color_by", "bandwidth"],
    data_types: { x_axis: "numeric", color_by: "categorical" },
    min_data_points: 10,
  },
  ridgeline: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["bandwidth"],
    data_types: { x_axis: "numeric", y_axis: "categorical" },
    min_data_points: 20,
  },
  candlestick: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["time_unit"],
    data_types: { x_axis: "datetime", y_axis: "numeric" },
    min_data_points: 5,
  },
  waterfall: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: [],
    data_types: { x_axis: "categorical", y_axis: "numeric" },
    min_data_points: 2,
  },

  // Specialized Charts
  gantt: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["color_by"],
    data_types: {
      x_axis: "datetime",
      y_axis: "categorical",
      color_by: "categorical",
    },
    min_data_points: 1,
  },
  sankey: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: [],
    data_types: { x_axis: "categorical", y_axis: "categorical" },
    min_data_points: 3,
  },
  chord: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: [],
    data_types: { x_axis: "categorical", y_axis: "categorical" },
    min_data_points: 3,
  },
  funnel: {
    required_parameters: ["x_axis", "y_axis"],
    optional_parameters: ["aggregation"],
    data_types: { x_axis: "categorical", y_axis: "numeric" },
    min_data_points: 2,
  },

  // Multi-series Charts
  stacked_bar: {
    required_parameters: ["x_axis", "y_axis", "stack_by"],
    optional_parameters: ["aggregation", "normalize"],
    data_types: { x_axis: "categorical", y_axis: "numeric" },
    min_data_points: 2,
  },
  grouped_bar: {
    required_parameters: ["x_axis", "y_axis", "group_by"],
    optional_parameters: ["aggregation"],
    data_types: { x_axis: "categorical", y_axis: "numeric" },
    min_data_points: 2,
  },
  multi_line: {
    required_parameters: ["x_axis", "y_axis", "group_by"],
    optional_parameters: ["time_unit", "rolling_window"],
    data_types: { x_axis: "datetime", y_axis: "numeric" },
    min_data_points: 4,
  },
  stacked_area: {
    required_parameters: ["x_axis", "y_axis", "stack_by"],
    optional_parameters: ["normalize", "cumulative"],
    data_types: { x_axis: "datetime", y_axis: "numeric" },
    min_data_points: 3,
  },
};

// Chart selection matrix based on data types
export const CHART_SELECTION_MATRIX: ChartSelectionMatrix = {
  categorical_numeric: {
    x_type: "categorical",
    y_type: "numeric",
    recommended_charts: ["bar", "box", "violin", "stacked_bar", "grouped_bar"],
    analysis_goals: [
      "Compare categories",
      "Show distributions",
      "Identify outliers",
    ],
  },
  numeric_numeric: {
    x_type: "numeric",
    y_type: "numeric",
    recommended_charts: ["scatter", "bubble", "heatmap"],
    analysis_goals: [
      "Find relationships",
      "Identify correlations",
      "Detect patterns",
    ],
  },
  datetime_numeric: {
    x_type: "datetime",
    y_type: "numeric",
    recommended_charts: [
      "line",
      "area",
      "candlestick",
      "multi_line",
      "stacked_area",
    ],
    analysis_goals: [
      "Show trends",
      "Track changes over time",
      "Identify seasonality",
    ],
  },
  categorical_none: {
    x_type: "categorical",
    y_type: "none",
    recommended_charts: ["pie", "donut", "treemap", "sunburst"],
    analysis_goals: [
      "Show composition",
      "Display proportions",
      "Hierarchical data",
    ],
  },
  numeric_none: {
    x_type: "numeric",
    y_type: "none",
    recommended_charts: ["histogram", "density", "box"],
    analysis_goals: [
      "Show distribution",
      "Identify patterns",
      "Statistical analysis",
    ],
  },
  categorical_categorical: {
    x_type: "categorical",
    y_type: "categorical",
    recommended_charts: ["heatmap", "sankey", "chord"],
    analysis_goals: [
      "Show relationships",
      "Flow analysis",
      "Network visualization",
    ],
  },
};

// Chart presets for common use cases
export const CHART_PRESETS: ChartPreset[] = [
  {
    id: "sales_by_region",
    name: "Sales by Region",
    chart_type: "bar",
    parameters: {
      x_axis: "region",
      y_axis: "sales_amount",
      aggregation: "sum",
      sort_order: "desc",
    },
    description: "Compare sales performance across different regions",
    use_cases: [
      "Regional analysis",
      "Performance comparison",
      "Sales reporting",
    ],
    data_requirements: CHART_REQUIREMENTS.bar,
  },
  {
    id: "revenue_trend",
    name: "Revenue Trend",
    chart_type: "line",
    parameters: {
      x_axis: "date",
      y_axis: "revenue",
      time_unit: "month",
      rolling_window: 3,
    },
    description: "Track revenue trends over time with smoothing",
    use_cases: ["Financial reporting", "Trend analysis", "Forecasting"],
    data_requirements: CHART_REQUIREMENTS.line,
  },
  {
    id: "market_share",
    name: "Market Share",
    chart_type: "pie",
    parameters: {
      x_axis: "product_category",
      percentage: true,
      limit: 6,
    },
    description: "Visualize market share distribution by product category",
    use_cases: ["Market analysis", "Portfolio review", "Strategic planning"],
    data_requirements: CHART_REQUIREMENTS.pie,
  },
  {
    id: "price_quality_analysis",
    name: "Price vs Quality Analysis",
    chart_type: "scatter",
    parameters: {
      x_axis: "price",
      y_axis: "quality_score",
      color_by: "brand",
      size_by: "market_share",
    },
    description:
      "Analyze relationship between price and quality with brand differentiation",
    use_cases: [
      "Product positioning",
      "Competitive analysis",
      "Value assessment",
    ],
    data_requirements: CHART_REQUIREMENTS.scatter,
  },
  {
    id: "salary_distribution",
    name: "Salary Distribution",
    chart_type: "histogram",
    parameters: {
      x_axis: "salary",
      bins: 20,
      normalize: true,
    },
    description: "Analyze salary distribution patterns in the organization",
    use_cases: ["HR analytics", "Compensation analysis", "Pay equity"],
    data_requirements: CHART_REQUIREMENTS.histogram,
  },
];

// Utility functions
export const getChartCategory = (chartType: ChartType): ChartCategory => {
  return CHART_CATEGORIES[chartType];
};

export const getChartRequirements = (
  chartType: ChartType
): ChartRequirements => {
  return CHART_REQUIREMENTS[chartType];
};

export const recommendChartTypes = (
  xType: string,
  yType: string | null,
  analysisGoal?: string
): ChartType[] => {
  const key = yType ? `${xType}_${yType}` : `${xType}_none`;
  const matrix = CHART_SELECTION_MATRIX[key];

  if (!matrix) {
    // Fallback recommendations
    if (xType === "categorical" && yType === "numeric") return ["bar"];
    if (xType === "numeric" && yType === "numeric") return ["scatter"];
    if (xType === "datetime" && yType === "numeric") return ["line"];
    if (xType === "categorical" && !yType) return ["pie"];
    if (xType === "numeric" && !yType) return ["histogram"];
    return ["bar"]; // Default fallback
  }

  return matrix.recommended_charts;
};

export const validateChartCompatibility = (
  chartType: ChartType,
  columnTypes: Record<string, string>,
  parameters: ChartParameters
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const requirements = getChartRequirements(chartType);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required parameters
  for (const param of requirements.required_parameters) {
    if (!parameters[param as keyof ChartParameters]) {
      errors.push(`Missing required parameter: ${param}`);
    }
  }

  // Check data type compatibility
  if (parameters.x_axis && requirements.data_types.x_axis) {
    const expectedType = requirements.data_types.x_axis;
    const actualType = columnTypes[parameters.x_axis];

    if (expectedType !== "any" && !isCompatibleType(actualType, expectedType)) {
      errors.push(
        `x_axis column "${parameters.x_axis}" should be ${expectedType}, but is ${actualType}`
      );
    }
  }

  if (parameters.y_axis && requirements.data_types.y_axis) {
    const expectedType = requirements.data_types.y_axis;
    const actualType = columnTypes[parameters.y_axis];

    if (expectedType !== "any" && !isCompatibleType(actualType, expectedType)) {
      errors.push(
        `y_axis column "${parameters.y_axis}" should be ${expectedType}, but is ${actualType}`
      );
    }
  }

  // Check data point requirements
  // Note: This would need actual data to validate, so we'll skip for now

  // Check category limits for categorical data
  if (requirements.max_categories && parameters.x_axis) {
    const xType = columnTypes[parameters.x_axis];
    if (xType === "categorical" || xType === "object") {
      warnings.push(
        `Consider using limit parameter if ${parameters.x_axis} has more than ${requirements.max_categories} categories`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Helper function to check type compatibility
const isCompatibleType = (
  actualType: string,
  expectedType: string
): boolean => {
  const typeMapping: Record<string, string[]> = {
    numeric: ["int64", "float64", "int32", "float32", "number"],
    categorical: ["object", "category", "string", "bool"],
    datetime: ["datetime64", "datetime", "date", "timestamp"],
    any: [
      "int64",
      "float64",
      "object",
      "category",
      "datetime64",
      "bool",
      "string",
      "number",
      "date",
      "timestamp",
    ],
  };

  const compatibleTypes = typeMapping[expectedType] || [];
  return compatibleTypes.includes(actualType);
};

// Generate default parameters for a chart type
export const generateDefaultParameters = (
  chartType: ChartType,
  availableColumns: string[],
  columnTypes: Record<string, string>
): ChartParameters => {
  const requirements = getChartRequirements(chartType);
  const parameters: ChartParameters = {};

  // Find suitable columns for required parameters
  for (const param of requirements.required_parameters) {
    if (param === "x_axis" && requirements.data_types.x_axis) {
      const suitableColumn = findSuitableColumn(
        availableColumns,
        columnTypes,
        requirements.data_types.x_axis
      );
      if (suitableColumn) parameters.x_axis = suitableColumn;
    }

    if (param === "y_axis" && requirements.data_types.y_axis) {
      const suitableColumn = findSuitableColumn(
        availableColumns,
        columnTypes,
        requirements.data_types.y_axis
      );
      if (suitableColumn && suitableColumn !== parameters.x_axis) {
        parameters.y_axis = suitableColumn;
      }
    }

    if (param === "size_by" && requirements.data_types.size_by) {
      const suitableColumn = findSuitableColumn(
        availableColumns,
        columnTypes,
        requirements.data_types.size_by
      );
      if (
        suitableColumn &&
        suitableColumn !== parameters.x_axis &&
        suitableColumn !== parameters.y_axis
      ) {
        parameters.size_by = suitableColumn;
      }
    }
  }

  // Add sensible defaults for optional parameters
  if (chartType === "histogram" && !parameters.bins) {
    parameters.bins = 20;
  }

  if (chartType === "pie" && !parameters.limit) {
    parameters.limit = 8;
  }

  if (
    ["bar", "stacked_bar", "grouped_bar"].includes(chartType) &&
    !parameters.aggregation
  ) {
    parameters.aggregation = "sum";
  }

  if (["bar", "pie"].includes(chartType) && !parameters.sort_order) {
    parameters.sort_order = "desc";
  }

  return parameters;
};

// Helper function to find suitable column for a data type
const findSuitableColumn = (
  columns: string[],
  columnTypes: Record<string, string>,
  expectedType: string
): string | null => {
  for (const column of columns) {
    const actualType = columnTypes[column];
    if (isCompatibleType(actualType, expectedType)) {
      return column;
    }
  }
  return null;
};

// Get chart description and use cases
export const getChartInfo = (chartType: ChartType) => {
  const descriptions: Record<
    ChartType,
    { description: string; useCases: string[] }
  > = {
    // Basic Charts
    bar: {
      description:
        "Compare categorical data, show rankings, display frequencies",
      useCases: [
        "Comparing sales across regions",
        "Survey response counts",
        "Product performance rankings",
      ],
    },
    line: {
      description: "Show trends over time, display continuous data progression",
      useCases: [
        "Sales trends over months",
        "Stock price movements",
        "Website traffic patterns",
      ],
    },
    pie: {
      description:
        "Show part-to-whole relationships, market share, category distribution",
      useCases: [
        "Market share analysis",
        "Budget allocation",
        "Survey response distribution",
      ],
    },
    scatter: {
      description:
        "Explore relationships between variables, identify correlations, detect outliers",
      useCases: [
        "Salary vs experience analysis",
        "Sales vs marketing spend correlation",
        "Performance metrics",
      ],
    },
    histogram: {
      description:
        "Show distribution of continuous data, identify patterns, detect skewness",
      useCases: [
        "Age distribution analysis",
        "Salary range visualization",
        "Quality measurements",
      ],
    },
    box: {
      description: "Statistical summary, outlier detection, group comparisons",
      useCases: [
        "Salary distribution by department",
        "Performance scores across teams",
        "Quality metrics",
      ],
    },

    // Advanced Charts
    area: {
      description:
        "Show trends with magnitude emphasis, compare multiple series",
      useCases: [
        "Revenue growth over time",
        "Market share evolution",
        "Cumulative metrics",
      ],
    },
    donut: {
      description: "Pie chart with center space for additional information",
      useCases: [
        "Modern dashboard KPIs",
        "Multiple concentric data series",
        "Clean aesthetic displays",
      ],
    },
    violin: {
      description: "Combine box plot statistics with distribution shape",
      useCases: [
        "Detailed distribution analysis",
        "Comparing distribution shapes",
        "Statistical research",
      ],
    },
    heatmap: {
      description:
        "Show relationships in 2D data, correlation matrices, pattern detection",
      useCases: [
        "Correlation analysis",
        "Time-based patterns",
        "Performance matrices",
      ],
    },
    bubble: {
      description: "3-dimensional scatter plot with size encoding",
      useCases: [
        "Market analysis",
        "Portfolio analysis",
        "Multi-dimensional comparisons",
      ],
    },
    radar: {
      description: "Multi-dimensional data comparison, profile analysis",
      useCases: [
        "Employee skill assessments",
        "Product feature comparisons",
        "Performance dashboards",
      ],
    },
    treemap: {
      description:
        "Hierarchical data visualization, space-efficient category comparison",
      useCases: [
        "Budget allocation visualization",
        "File system analysis",
        "Market capitalization",
      ],
    },
    sunburst: {
      description:
        "Hierarchical data in circular format, drill-down visualization",
      useCases: [
        "Organizational hierarchies",
        "File directory structures",
        "Multi-level categorization",
      ],
    },

    // Statistical Charts
    density: {
      description: "Smooth distribution curves, probability density estimation",
      useCases: [
        "Comparing distribution shapes",
        "Smooth alternative to histograms",
        "Statistical analysis",
      ],
    },
    ridgeline: {
      description: "Multiple density plots stacked vertically",
      useCases: [
        "Comparing distributions across many groups",
        "Time series of distributions",
        "Joy plots",
      ],
    },
    candlestick: {
      description:
        "Financial data visualization showing open, high, low, close values",
      useCases: [
        "Stock price analysis",
        "Financial market data",
        "Trading analysis",
      ],
    },
    waterfall: {
      description: "Show cumulative effect of sequential changes",
      useCases: [
        "Financial analysis",
        "Budget variance analysis",
        "Process improvement tracking",
      ],
    },

    // Specialized Charts
    gantt: {
      description: "Project timeline visualization with task dependencies",
      useCases: [
        "Project management",
        "Timeline planning",
        "Resource scheduling",
      ],
    },
    sankey: {
      description: "Flow diagram showing quantities moving between nodes",
      useCases: [
        "Energy flow analysis",
        "Budget allocation flows",
        "Process flow visualization",
      ],
    },
    chord: {
      description:
        "Circular network diagram showing relationships between entities",
      useCases: [
        "Migration patterns",
        "Trade relationships",
        "Network analysis",
      ],
    },
    funnel: {
      description: "Show conversion rates through process stages",
      useCases: [
        "Sales pipeline analysis",
        "Website conversion tracking",
        "Customer journey mapping",
      ],
    },

    // Multi-series Charts
    stacked_bar: {
      description: "Show part-to-whole relationships across categories",
      useCases: [
        "Revenue by product and region",
        "Survey responses by demographics",
        "Budget breakdown",
      ],
    },
    grouped_bar: {
      description: "Compare multiple series side-by-side",
      useCases: [
        "Performance comparison across groups",
        "Before/after analysis",
        "Multi-metric comparison",
      ],
    },
    multi_line: {
      description: "Compare trends across multiple series",
      useCases: [
        "Multiple product performance",
        "Regional trend comparison",
        "Multi-metric tracking",
      ],
    },
    stacked_area: {
      description: "Show cumulative trends with category breakdown",
      useCases: [
        "Revenue composition over time",
        "Market share evolution",
        "Resource utilization",
      ],
    },
  };

  return (
    descriptions[chartType] || {
      description: "Advanced data visualization",
      useCases: ["Data analysis", "Business intelligence", "Reporting"],
    }
  );
};
