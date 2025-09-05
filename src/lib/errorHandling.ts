// Comprehensive error handling and validation for chart generation
import {
  ChartType,
  ChartParameters,
  ChartValidationError,
  ChartGenerationError,
  ChartDataResponse,
} from "@/types";
import { CHART_REQUIREMENTS } from "./chartUtils";

// Error codes for different types of validation failures
export const ERROR_CODES = {
  // Parameter validation errors
  MISSING_REQUIRED_PARAMETER: "MISSING_REQUIRED_PARAMETER",
  INVALID_PARAMETER_TYPE: "INVALID_PARAMETER_TYPE",
  PARAMETER_OUT_OF_RANGE: "PARAMETER_OUT_OF_RANGE",
  INCOMPATIBLE_PARAMETERS: "INCOMPATIBLE_PARAMETERS",

  // Data validation errors
  INSUFFICIENT_DATA: "INSUFFICIENT_DATA",
  INVALID_DATA_TYPE: "INVALID_DATA_TYPE",
  TOO_MANY_CATEGORIES: "TOO_MANY_CATEGORIES",
  MISSING_COLUMN: "MISSING_COLUMN",
  HIGH_MISSING_VALUES: "HIGH_MISSING_VALUES",

  // Chart type errors
  UNSUPPORTED_CHART_TYPE: "UNSUPPORTED_CHART_TYPE",
  CHART_TYPE_DATA_MISMATCH: "CHART_TYPE_DATA_MISMATCH",

  // API and processing errors
  API_ERROR: "API_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",

  // Rendering errors
  RENDERING_ERROR: "RENDERING_ERROR",
  BROWSER_COMPATIBILITY: "BROWSER_COMPATIBILITY",
  CANVAS_ERROR: "CANVAS_ERROR",
} as const;

// Error severity levels
export type ErrorSeverity = "error" | "warning" | "info";

// Enhanced error interface with recovery suggestions
export interface EnhancedChartError extends ChartValidationError {
  severity: ErrorSeverity;
  category: "validation" | "data" | "processing" | "rendering";
  recovery_actions: string[];
  documentation_link?: string;
}

// Main validation class
class ChartValidator {
  static validateChartRequest(
    chartType: ChartType,
    parameters: ChartParameters,
    availableColumns: string[],
    columnTypes: Record<string, string>,
    dataRowCount: number
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];

    // 1. Validate chart type
    errors.push(...this.validateChartType(chartType));

    // 2. Validate required parameters
    errors.push(...this.validateRequiredParameters(chartType, parameters));

    // 3. Validate parameter types and values
    errors.push(...this.validateParameterValues(chartType, parameters));

    // 4. Validate data compatibility
    errors.push(
      ...this.validateDataCompatibility(
        chartType,
        parameters,
        availableColumns,
        columnTypes,
        dataRowCount
      )
    );

    // 5. Validate parameter combinations
    errors.push(...this.validateParameterCombinations(chartType, parameters));

    return errors;
  }

  private static validateChartType(
    chartType: ChartType
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];

    if (!CHART_REQUIREMENTS[chartType]) {
      errors.push({
        parameter: "chart_type",
        message: `Chart type "${chartType}" is not supported`,
        code: ERROR_CODES.UNSUPPORTED_CHART_TYPE,
        suggestion: `Use one of the supported chart types: ${Object.keys(
          CHART_REQUIREMENTS
        ).join(", ")}`,
      });
    }

    return errors;
  }

  private static validateRequiredParameters(
    chartType: ChartType,
    parameters: ChartParameters
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];
    const requirements = CHART_REQUIREMENTS[chartType];

    if (!requirements) return errors;

    for (const requiredParam of requirements.required_parameters) {
      const paramValue = parameters[requiredParam as keyof ChartParameters];

      if (
        !paramValue ||
        (typeof paramValue === "string" && paramValue.trim() === "")
      ) {
        errors.push({
          parameter: requiredParam,
          message: `Parameter "${requiredParam}" is required for ${chartType} charts`,
          code: ERROR_CODES.MISSING_REQUIRED_PARAMETER,
          suggestion: this.getParameterSuggestion(requiredParam, chartType),
        });
      }
    }

    return errors;
  }

  private static validateParameterValues(
    chartType: ChartType,
    parameters: ChartParameters
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];

    // Validate numeric parameters
    if (parameters.bins !== undefined) {
      if (
        !Number.isInteger(parameters.bins) ||
        parameters.bins < 5 ||
        parameters.bins > 100
      ) {
        errors.push({
          parameter: "bins",
          message: "bins parameter must be an integer between 5 and 100",
          code: ERROR_CODES.PARAMETER_OUT_OF_RANGE,
          suggestion: "Use a value between 10-30 for most histograms",
        });
      }
    }

    if (parameters.limit !== undefined) {
      if (
        !Number.isInteger(parameters.limit) ||
        parameters.limit < 1 ||
        parameters.limit > 1000
      ) {
        errors.push({
          parameter: "limit",
          message: "limit parameter must be an integer between 1 and 1000",
          code: ERROR_CODES.PARAMETER_OUT_OF_RANGE,
          suggestion: "Use 10-50 for most visualizations",
        });
      }
    }

    if (parameters.rolling_window !== undefined) {
      if (
        !Number.isInteger(parameters.rolling_window) ||
        parameters.rolling_window < 2
      ) {
        errors.push({
          parameter: "rolling_window",
          message: "rolling_window must be an integer >= 2",
          code: ERROR_CODES.PARAMETER_OUT_OF_RANGE,
          suggestion: "Use 3-30 depending on your data frequency",
        });
      }
    }

    if (parameters.inner_radius !== undefined) {
      if (parameters.inner_radius < 0 || parameters.inner_radius >= 1) {
        errors.push({
          parameter: "inner_radius",
          message: "inner_radius must be between 0 and 1",
          code: ERROR_CODES.PARAMETER_OUT_OF_RANGE,
          suggestion: "Use 0.3-0.6 for donut charts",
        });
      }
    }

    // Validate enum parameters
    if (
      parameters.sort_order &&
      !["asc", "desc", "none"].includes(parameters.sort_order)
    ) {
      errors.push({
        parameter: "sort_order",
        message: "sort_order must be 'asc', 'desc', or 'none'",
        code: ERROR_CODES.INVALID_PARAMETER_TYPE,
        suggestion: "Use 'desc' for ranking, 'asc' for alphabetical",
      });
    }

    if (
      parameters.aggregation &&
      !["count", "sum", "mean", "median", "min", "max", "std", "var"].includes(
        parameters.aggregation
      )
    ) {
      errors.push({
        parameter: "aggregation",
        message: "Invalid aggregation function",
        code: ERROR_CODES.INVALID_PARAMETER_TYPE,
        suggestion:
          "Use 'sum' for totals, 'mean' for averages, 'count' for frequencies",
      });
    }

    return errors;
  }

  private static validateDataCompatibility(
    chartType: ChartType,
    parameters: ChartParameters,
    availableColumns: string[],
    columnTypes: Record<string, string>,
    dataRowCount: number
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];
    const requirements = CHART_REQUIREMENTS[chartType];

    if (!requirements) return errors;

    // Check minimum data points
    if (dataRowCount < requirements.min_data_points) {
      errors.push({
        parameter: "data",
        message: `${chartType} charts require at least ${requirements.min_data_points} data points, but only ${dataRowCount} available`,
        code: ERROR_CODES.INSUFFICIENT_DATA,
        suggestion: `Collect more data or use a simpler chart type like bar or pie`,
      });
    }

    // Validate column existence and types
    const columnsToCheck = [
      { param: "x_axis", expectedType: requirements.data_types.x_axis },
      { param: "y_axis", expectedType: requirements.data_types.y_axis },
      { param: "color_by", expectedType: requirements.data_types.color_by },
      { param: "size_by", expectedType: requirements.data_types.size_by },
    ];

    for (const { param, expectedType } of columnsToCheck) {
      const columnName = parameters[param as keyof ChartParameters] as string;

      if (columnName) {
        // Check if column exists
        if (!availableColumns.includes(columnName)) {
          errors.push({
            parameter: param,
            message: `Column "${columnName}" not found in dataset`,
            code: ERROR_CODES.MISSING_COLUMN,
            suggestion: `Available columns: ${availableColumns.join(", ")}`,
          });
          continue;
        }

        // Check data type compatibility
        if (expectedType && expectedType !== "any") {
          const actualType = columnTypes[columnName];
          if (!this.isCompatibleType(actualType, expectedType)) {
            errors.push({
              parameter: param,
              message: `Column "${columnName}" has type "${actualType}" but "${expectedType}" is required`,
              code: ERROR_CODES.INVALID_DATA_TYPE,
              suggestion: this.getTypeConversionSuggestion(
                actualType,
                expectedType
              ),
            });
          }
        }
      }
    }

    return errors;
  }

  private static validateParameterCombinations(
    chartType: ChartType,
    parameters: ChartParameters
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];

    // Bubble chart specific validation
    if (chartType === "bubble") {
      if (!parameters.size_by) {
        errors.push({
          parameter: "size_by",
          message: "Bubble charts require a size_by parameter",
          code: ERROR_CODES.MISSING_REQUIRED_PARAMETER,
          suggestion: "Add a numeric column to control bubble sizes",
        });
      }
    }

    // Stacked chart validation
    if (["stacked_bar", "stacked_area"].includes(chartType)) {
      if (!parameters.stack_by) {
        errors.push({
          parameter: "stack_by",
          message: `${chartType} charts require a stack_by parameter`,
          code: ERROR_CODES.MISSING_REQUIRED_PARAMETER,
          suggestion: "Add a categorical column for stacking",
        });
      }
    }

    // Grouped chart validation
    if (["grouped_bar", "multi_line"].includes(chartType)) {
      if (!parameters.group_by) {
        errors.push({
          parameter: "group_by",
          message: `${chartType} charts require a group_by parameter`,
          code: ERROR_CODES.MISSING_REQUIRED_PARAMETER,
          suggestion: "Add a categorical column for grouping",
        });
      }
    }

    // Time series validation
    if (["line", "area", "multi_line", "stacked_area"].includes(chartType)) {
      if (parameters.rolling_window && !parameters.x_axis) {
        errors.push({
          parameter: "rolling_window",
          message: "rolling_window requires x_axis to be specified",
          code: ERROR_CODES.INCOMPATIBLE_PARAMETERS,
          suggestion: "Specify x_axis parameter for time series analysis",
        });
      }
    }

    // Normalization validation
    if (
      parameters.normalize &&
      !["stacked_bar", "stacked_area", "pie"].includes(chartType)
    ) {
      errors.push({
        parameter: "normalize",
        message: `normalize parameter is not applicable for ${chartType} charts`,
        code: ERROR_CODES.INCOMPATIBLE_PARAMETERS,
        suggestion: "Remove normalize parameter or use a stacked chart type",
      });
    }

    return errors;
  }

  private static isCompatibleType(
    actualType: string,
    expectedType: string
  ): boolean {
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
  }

  private static getParameterSuggestion(
    parameter: string,
    chartType: ChartType
  ): string {
    const suggestions: Record<string, string> = {
      x_axis: `Specify a column name for the X-axis. For ${chartType} charts, this should be a categorical or datetime column.`,
      y_axis: `Specify a column name for the Y-axis. This should typically be a numeric column.`,
      size_by:
        "Specify a numeric column to control the size of bubbles or points.",
      color_by: "Specify a categorical column to color-code your data points.",
      stack_by: "Specify a categorical column to create stacked segments.",
      group_by: "Specify a categorical column to group your data series.",
    };

    return (
      suggestions[parameter] ||
      `Provide a valid value for the ${parameter} parameter.`
    );
  }

  private static getTypeConversionSuggestion(
    actualType: string,
    expectedType: string
  ): string {
    const suggestions: Record<string, Record<string, string>> = {
      numeric: {
        object: "Convert text values to numbers, or check for non-numeric data",
        category: "Ensure categorical values can be converted to numbers",
        datetime: "Extract numeric components from dates (year, month, etc.)",
      },
      categorical: {
        numeric: "Convert numbers to text categories or use binning",
        datetime: "Format dates as text or extract categorical components",
      },
      datetime: {
        object: "Parse text as dates using proper date format",
        numeric: "Convert timestamps to datetime objects",
      },
    };

    return (
      suggestions[expectedType]?.[actualType] ||
      `Convert ${actualType} column to ${expectedType} format`
    );
  }
}

// Error recovery and suggestion system
class ErrorRecoverySystem {
  static generateRecoverySuggestions(errors: ChartValidationError[]): string[] {
    const suggestions: string[] = [];
    const errorCounts = this.categorizeErrors(errors);

    // Generate high-level recovery strategies
    if (errorCounts.missing_parameters > 0) {
      suggestions.push("Review required parameters for your chosen chart type");
      suggestions.push(
        "Check the chart documentation for parameter requirements"
      );
    }

    if (errorCounts.data_type_issues > 0) {
      suggestions.push("Verify column data types match chart requirements");
      suggestions.push("Consider data preprocessing or type conversion");
    }

    if (errorCounts.insufficient_data > 0) {
      suggestions.push("Try a simpler chart type that requires less data");
      suggestions.push(
        "Aggregate or filter your data to meet minimum requirements"
      );
    }

    if (errorCounts.parameter_conflicts > 0) {
      suggestions.push("Review parameter combinations for compatibility");
      suggestions.push("Remove conflicting parameters or adjust chart type");
    }

    // Add specific suggestions from individual errors
    suggestions.push(
      ...(errors.map((e) => e.suggestion).filter(Boolean) as string[])
    );

    return [...new Set(suggestions)]; // Remove duplicates
  }

  static suggestAlternativeChartTypes(
    originalChartType: ChartType,
    errors: ChartValidationError[]
  ): ChartType[] {
    const alternatives: ChartType[] = [];

    // Analyze error patterns to suggest alternatives
    const hasDataTypeIssues = errors.some(
      (e) => e.code === ERROR_CODES.INVALID_DATA_TYPE
    );
    const hasInsufficientData = errors.some(
      (e) => e.code === ERROR_CODES.INSUFFICIENT_DATA
    );
    const hasMissingParameters = errors.some(
      (e) => e.code === ERROR_CODES.MISSING_REQUIRED_PARAMETER
    );

    if (hasInsufficientData) {
      // Suggest simpler charts that need less data
      alternatives.push("bar", "pie", "line");
    }

    if (hasDataTypeIssues) {
      // Suggest charts with more flexible data requirements
      alternatives.push("bar", "scatter", "histogram");
    }

    if (hasMissingParameters) {
      // Suggest charts with fewer required parameters
      alternatives.push("pie", "histogram", "bar");
    }

    // Chart-specific alternatives (partial mapping)
    const chartAlternatives: Partial<Record<ChartType, ChartType[]>> = {
      bubble: ["scatter", "bar", "heatmap"],
      violin: ["box", "histogram", "density"],
      radar: ["bar", "line", "area"],
      treemap: ["pie", "bar", "sunburst"],
      sankey: ["bar", "heatmap", "chord"],
      stacked_bar: ["bar", "grouped_bar", "pie"],
      multi_line: ["line", "area", "bar"],
      heatmap: ["scatter", "bar", "bubble"],
      candlestick: ["line", "area", "bar"],
      waterfall: ["bar", "line", "area"],
    };

    if (chartAlternatives[originalChartType]) {
      alternatives.push(...chartAlternatives[originalChartType]);
    }

    return [...new Set(alternatives)]; // Remove duplicates
  }

  private static categorizeErrors(errors: ChartValidationError[]) {
    return {
      missing_parameters: errors.filter(
        (e) => e.code === ERROR_CODES.MISSING_REQUIRED_PARAMETER
      ).length,
      data_type_issues: errors.filter(
        (e) => e.code === ERROR_CODES.INVALID_DATA_TYPE
      ).length,
      insufficient_data: errors.filter(
        (e) => e.code === ERROR_CODES.INSUFFICIENT_DATA
      ).length,
      parameter_conflicts: errors.filter(
        (e) => e.code === ERROR_CODES.INCOMPATIBLE_PARAMETERS
      ).length,
      missing_columns: errors.filter(
        (e) => e.code === ERROR_CODES.MISSING_COLUMN
      ).length,
    };
  }
}

// Response validation for API responses
class ResponseValidator {
  static validateChartResponse(
    response: ChartDataResponse
  ): ChartValidationError[] {
    const errors: ChartValidationError[] = [];

    // Check required fields
    if (!response.data || !Array.isArray(response.data)) {
      errors.push({
        parameter: "data",
        message: "Response data is missing or invalid",
        code: ERROR_CODES.API_ERROR,
        suggestion: "Check API response format and try again",
      });
    }

    if (!response.metadata) {
      errors.push({
        parameter: "metadata",
        message: "Response metadata is missing",
        code: ERROR_CODES.API_ERROR,
        suggestion: "Ensure API returns complete response structure",
      });
    }

    if (!response.config) {
      errors.push({
        parameter: "config",
        message: "Response config is missing",
        code: ERROR_CODES.API_ERROR,
        suggestion: "Check API configuration and try again",
      });
    }

    // Validate data content
    if (response.data && response.data.length === 0) {
      errors.push({
        parameter: "data",
        message: "No data returned from API",
        code: ERROR_CODES.INSUFFICIENT_DATA,
        suggestion: "Check data filters and query parameters",
      });
    }

    // Check for API errors in response
    if (response.error) {
      errors.push({
        parameter: "api",
        message: response.error,
        code: ERROR_CODES.API_ERROR,
        suggestion: "Review API error message and adjust request",
      });
    }

    return errors;
  }
}

// Main error handler class
class ChartErrorHandler {
  static handleError(error: any): ChartGenerationError {
    // Determine error type and create appropriate response
    if (error.type === "validation") {
      return error as ChartGenerationError;
    }

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return {
        type: "processing",
        message: "Request timed out. The server may be busy.",
        recovery_suggestions: [
          "Try again in a few moments",
          "Reduce data size or complexity",
          "Check your internet connection",
        ],
      };
    }

    if (error.response?.status >= 500) {
      return {
        type: "processing",
        message: "Server error occurred while generating chart",
        recovery_suggestions: [
          "Try again later",
          "Contact support if problem persists",
          "Use a simpler chart type",
        ],
      };
    }

    if (error.response?.status === 404) {
      return {
        type: "data",
        message: "Data not found. The file may have been deleted.",
        recovery_suggestions: [
          "Upload the file again",
          "Check file ID is correct",
          "Verify file still exists",
        ],
      };
    }

    if (error.response?.status >= 400 && error.response?.status < 500) {
      return {
        type: "validation",
        message: error.response.data?.message || "Invalid request parameters",
        recovery_suggestions: [
          "Check request parameters",
          "Verify data format",
          "Review API documentation",
        ],
      };
    }

    // Default error handling
    return {
      type: "processing",
      message: error.message || "An unexpected error occurred",
      recovery_suggestions: [
        "Try again",
        "Refresh the page",
        "Contact support if problem persists",
      ],
    };
  }

  static formatErrorForUser(error: ChartGenerationError): string {
    const baseMessage = error.message;
    const suggestions = error.recovery_suggestions?.slice(0, 2).join(" or ");

    return suggestions ? `${baseMessage}. ${suggestions}.` : baseMessage;
  }
}

// Export all utilities
export {
  ChartValidator,
  ErrorRecoverySystem,
  ResponseValidator,
  ChartErrorHandler,
};
