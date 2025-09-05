// Comprehensive chart configuration panel for all chart types
"use client";

import React, { useState, useEffect } from "react";
import {
  ChartType,
  ChartParameters,
  AggregationFunction,
  TimeUnit,
  SortOrder,
} from "@/types";
import { CHART_REQUIREMENTS, getChartInfo } from "@/lib/chartUtils";
import { ChartValidator } from "@/lib/errorHandling";

interface ChartConfigPanelProps {
  chartType: ChartType;
  parameters: ChartParameters;
  availableColumns: string[];
  columnTypes: Record<string, string>;
  onParametersChange: (parameters: ChartParameters) => void;
  onChartTypeChange?: (chartType: ChartType) => void;
  className?: string;
}

export const ChartConfigPanel: React.FC<ChartConfigPanelProps> = ({
  chartType,
  parameters,
  availableColumns,
  columnTypes,
  onParametersChange,
  onChartTypeChange,
  className = "",
}) => {
  const [localParameters, setLocalParameters] =
    useState<ChartParameters>(parameters);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const requirements = CHART_REQUIREMENTS[chartType];
  const chartInfo = getChartInfo(chartType);

  // Update local parameters when props change
  useEffect(() => {
    setLocalParameters(parameters);
  }, [parameters]);

  // Validate parameters when they change
  useEffect(() => {
    if (requirements) {
      const errors = ChartValidator.validateChartRequest(
        chartType,
        localParameters,
        availableColumns,
        columnTypes,
        1000 // Assume sufficient data for UI validation
      );
      setValidationErrors(errors.map((e) => e.message));
    }
  }, [chartType, localParameters, availableColumns, columnTypes]);

  const updateParameter = (key: keyof ChartParameters, value: any) => {
    const newParameters = { ...localParameters, [key]: value };
    setLocalParameters(newParameters);
    onParametersChange(newParameters);
  };

  const getColumnsByType = (expectedType: string) => {
    if (expectedType === "any") return availableColumns;

    const typeMapping: Record<string, string[]> = {
      numeric: ["int64", "float64", "int32", "float32", "number"],
      categorical: ["object", "category", "string", "bool"],
      datetime: ["datetime64", "datetime", "date", "timestamp"],
    };

    const compatibleTypes = typeMapping[expectedType] || [];
    return availableColumns.filter((col) =>
      compatibleTypes.includes(columnTypes[col])
    );
  };

  const renderColumnSelect = (
    paramKey: keyof ChartParameters,
    label: string,
    expectedType?: string,
    required: boolean = false
  ) => {
    const availableCols = expectedType
      ? getColumnsByType(expectedType)
      : availableColumns;
    const currentValue = localParameters[paramKey] as string;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={currentValue || ""}
          onChange={(e) =>
            updateParameter(paramKey, e.target.value || undefined)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select column...</option>
          {availableCols.map((col) => (
            <option key={col} value={col}>
              {col} ({columnTypes[col]})
            </option>
          ))}
        </select>
        {expectedType && (
          <p className="text-xs text-gray-500 mt-1">
            Expected type: {expectedType}
          </p>
        )}
      </div>
    );
  };

  const renderNumberInput = (
    paramKey: keyof ChartParameters,
    label: string,
    min?: number,
    max?: number,
    step?: number
  ) => {
    const currentValue = localParameters[paramKey] as number;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="number"
          value={currentValue || ""}
          onChange={(e) =>
            updateParameter(
              paramKey,
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {min !== undefined && max !== undefined && (
          <p className="text-xs text-gray-500 mt-1">
            Range: {min} - {max}
          </p>
        )}
      </div>
    );
  };

  const renderSelectInput = (
    paramKey: keyof ChartParameters,
    label: string,
    options: Array<{ value: string; label: string }>
  ) => {
    const currentValue = localParameters[paramKey] as string;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          value={currentValue || ""}
          onChange={(e) =>
            updateParameter(paramKey, e.target.value || undefined)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select option...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderCheckbox = (
    paramKey: keyof ChartParameters,
    label: string,
    description?: string
  ) => {
    const currentValue = localParameters[paramKey] as boolean;

    return (
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={currentValue || false}
            onChange={(e) => updateParameter(paramKey, e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1 ml-6">{description}</p>
        )}
      </div>
    );
  };

  const renderChartTypeSelector = () => {
    if (!onChartTypeChange) return null;

    const chartTypes: Array<{
      value: ChartType;
      label: string;
      category: string;
    }> = [
      // Basic Charts
      { value: "bar", label: "Bar Chart", category: "Basic" },
      { value: "line", label: "Line Chart", category: "Basic" },
      { value: "pie", label: "Pie Chart", category: "Basic" },
      { value: "scatter", label: "Scatter Plot", category: "Basic" },
      { value: "histogram", label: "Histogram", category: "Basic" },
      { value: "box", label: "Box Plot", category: "Basic" },

      // Advanced Charts
      { value: "area", label: "Area Chart", category: "Advanced" },
      { value: "donut", label: "Donut Chart", category: "Advanced" },
      { value: "violin", label: "Violin Plot", category: "Advanced" },
      { value: "heatmap", label: "Heatmap", category: "Advanced" },
      { value: "bubble", label: "Bubble Chart", category: "Advanced" },
      { value: "radar", label: "Radar Chart", category: "Advanced" },
      { value: "treemap", label: "Treemap", category: "Advanced" },
      { value: "sunburst", label: "Sunburst", category: "Advanced" },

      // Statistical Charts
      { value: "density", label: "Density Plot", category: "Statistical" },
      { value: "ridgeline", label: "Ridgeline Plot", category: "Statistical" },
      { value: "candlestick", label: "Candlestick", category: "Statistical" },
      { value: "waterfall", label: "Waterfall", category: "Statistical" },

      // Specialized Charts
      { value: "gantt", label: "Gantt Chart", category: "Specialized" },
      { value: "sankey", label: "Sankey Diagram", category: "Specialized" },
      { value: "chord", label: "Chord Diagram", category: "Specialized" },
      { value: "funnel", label: "Funnel Chart", category: "Specialized" },

      // Multi-series Charts
      { value: "stacked_bar", label: "Stacked Bar", category: "Multi-series" },
      { value: "grouped_bar", label: "Grouped Bar", category: "Multi-series" },
      { value: "multi_line", label: "Multi-line", category: "Multi-series" },
      {
        value: "stacked_area",
        label: "Stacked Area",
        category: "Multi-series",
      },
    ];

    const groupedTypes = chartTypes.reduce((acc, type) => {
      if (!acc[type.category]) acc[type.category] = [];
      acc[type.category].push(type);
      return acc;
    }, {} as Record<string, typeof chartTypes>);

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chart Type
        </label>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(groupedTypes).map(([category, types]) => (
            <optgroup key={category} label={category}>
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="mt-2 text-xs text-gray-600">
          <strong>{chartInfo.description}</strong>
        </div>
      </div>
    );
  };

  if (!requirements) {
    return (
      <div
        className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
      >
        <p className="text-red-600">Unsupported chart type: {chartType}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chart Configuration
      </h3>

      {renderChartTypeSelector()}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Configuration Issues:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Parameters */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">
          Required Parameters
        </h4>

        {requirements.required_parameters.includes("x_axis") &&
          renderColumnSelect(
            "x_axis",
            "X-Axis Column",
            requirements.data_types.x_axis,
            true
          )}

        {requirements.required_parameters.includes("y_axis") &&
          renderColumnSelect(
            "y_axis",
            "Y-Axis Column",
            requirements.data_types.y_axis,
            true
          )}

        {requirements.required_parameters.includes("size_by") &&
          renderColumnSelect(
            "size_by",
            "Size Column",
            requirements.data_types.size_by,
            true
          )}

        {requirements.required_parameters.includes("stack_by") &&
          renderColumnSelect(
            "stack_by",
            "Stack By Column",
            "categorical",
            true
          )}

        {requirements.required_parameters.includes("group_by") &&
          renderColumnSelect(
            "group_by",
            "Group By Column",
            "categorical",
            true
          )}
      </div>

      {/* Optional Parameters */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-3">
          Optional Parameters
        </h4>

        {/* Visual Encoding */}
        {requirements.optional_parameters.includes("color_by") &&
          renderColumnSelect(
            "color_by",
            "Color By Column",
            requirements.data_types.color_by
          )}

        {requirements.optional_parameters.includes("size_by") &&
          !requirements.required_parameters.includes("size_by") &&
          renderColumnSelect(
            "size_by",
            "Size By Column",
            requirements.data_types.size_by
          )}

        {requirements.optional_parameters.includes("shape_by") &&
          renderColumnSelect("shape_by", "Shape By Column", "categorical")}

        {requirements.optional_parameters.includes("opacity_by") &&
          renderColumnSelect("opacity_by", "Opacity By Column", "numeric")}

        {/* Aggregation */}
        {requirements.optional_parameters.includes("aggregation") &&
          renderSelectInput("aggregation", "Aggregation Function", [
            { value: "count", label: "Count" },
            { value: "sum", label: "Sum" },
            { value: "mean", label: "Mean" },
            { value: "median", label: "Median" },
            { value: "min", label: "Minimum" },
            { value: "max", label: "Maximum" },
            { value: "std", label: "Standard Deviation" },
            { value: "var", label: "Variance" },
          ])}

        {/* Sorting */}
        {requirements.optional_parameters.includes("sort_by") &&
          renderColumnSelect("sort_by", "Sort By Column")}

        {requirements.optional_parameters.includes("sort_order") &&
          renderSelectInput("sort_order", "Sort Order", [
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
            { value: "none", label: "No Sorting" },
          ])}

        {/* Numeric Parameters */}
        {requirements.optional_parameters.includes("limit") &&
          renderNumberInput("limit", "Limit Results", 1, 1000)}

        {requirements.optional_parameters.includes("bins") &&
          renderNumberInput("bins", "Number of Bins", 5, 100)}

        {requirements.optional_parameters.includes("rolling_window") &&
          renderNumberInput("rolling_window", "Rolling Window Size", 2, 100)}

        {requirements.optional_parameters.includes("bandwidth") &&
          renderNumberInput("bandwidth", "Bandwidth", 0.01, 1, 0.01)}

        {requirements.optional_parameters.includes("inner_radius") &&
          renderNumberInput("inner_radius", "Inner Radius", 0, 0.9, 0.1)}

        {requirements.optional_parameters.includes("threshold") &&
          renderNumberInput("threshold", "Threshold Value")}

        {/* Time Series */}
        {requirements.optional_parameters.includes("time_unit") &&
          renderSelectInput("time_unit", "Time Unit", [
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "quarter", label: "Quarter" },
            { value: "year", label: "Year" },
          ])}

        {/* Boolean Parameters */}
        {requirements.optional_parameters.includes("normalize") &&
          renderCheckbox(
            "normalize",
            "Normalize Values",
            "Show as percentages"
          )}

        {requirements.optional_parameters.includes("cumulative") &&
          renderCheckbox(
            "cumulative",
            "Cumulative Values",
            "Show cumulative sum"
          )}

        {requirements.optional_parameters.includes("percentage") &&
          renderCheckbox("percentage", "Show as Percentages")}

        {requirements.optional_parameters.includes("show_outliers") &&
          renderCheckbox(
            "show_outliers",
            "Show Outliers",
            "Display outlier points"
          )}
      </div>

      {/* Chart Info */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          Chart Information
        </h4>
        <p className="text-sm text-blue-700">{chartInfo.description}</p>
        <div className="mt-2 text-xs text-blue-600">
          <strong>Use cases:</strong> {chartInfo.useCases.join(", ")}
        </div>
        <div className="mt-1 text-xs text-blue-600">
          <strong>Min data points:</strong> {requirements.min_data_points}
          {requirements.max_categories && (
            <span>
              {" "}
              • <strong>Max categories:</strong> {requirements.max_categories}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartConfigPanel;
