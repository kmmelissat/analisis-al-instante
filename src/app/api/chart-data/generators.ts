// Chart data generation functions

export function generateBarChartData(data: any[], parameters: any) {
  const {
    x_axis,
    y_axis,
    aggregation = "count",
    sort_order = "desc",
    limit = 10,
  } = parameters;

  // Group by x_axis and aggregate
  const grouped = data.reduce((acc, row) => {
    const key = row[x_axis];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  let chartData = Object.entries(grouped).map(([key, values]) => {
    const count = (values as any[]).length;
    let aggregatedValue;

    if (aggregation === "count") {
      aggregatedValue = count;
    } else if (y_axis) {
      // Use y_axis column for aggregation
      const numericValues = (values as any[])
        .map((v) => parseFloat(v[y_axis]))
        .filter((v) => !isNaN(v));

      if (numericValues.length === 0) {
        // If no numeric values, fall back to count
        aggregatedValue = count;
      } else {
        // Apply aggregation function
        switch (aggregation) {
          case "mean":
            aggregatedValue =
              numericValues.reduce((sum, v) => sum + v, 0) /
              numericValues.length;
            break;
          case "sum":
            aggregatedValue = numericValues.reduce((sum, v) => sum + v, 0);
            break;
          case "max":
            aggregatedValue = Math.max(...numericValues);
            break;
          case "min":
            aggregatedValue = Math.min(...numericValues);
            break;
          default:
            aggregatedValue =
              numericValues.reduce((sum, v) => sum + v, 0) /
              numericValues.length;
        }
      }
    } else {
      // No y_axis specified, use count
      aggregatedValue = count;
    }

    // Create data point with actual column names
    const dataPoint: any = {
      [x_axis]: key,
    };

    // Use y_axis name if provided, otherwise use 'value'
    if (y_axis) {
      dataPoint[y_axis] = aggregatedValue;
    } else {
      dataPoint.value = aggregatedValue;
    }

    return dataPoint;
  });

  // Sort and limit
  const sortKey = y_axis || "value";
  chartData.sort((a, b) =>
    sort_order === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
  );
  chartData = chartData.slice(0, limit);

  console.log("[generateBarChartData] Generated data:", chartData);
  console.log("[generateBarChartData] x_axis:", x_axis);
  console.log("[generateBarChartData] Sample data point:", chartData[0]);

  return {
    data: chartData,
    metadata: {
      x_column: x_axis,
      y_column: y_axis,
      total_points: chartData.length,
      aggregation,
    },
    title: y_axis
      ? `${x_axis.replace(/_/g, " ")} vs ${y_axis.replace(/_/g, " ")}`
      : `${x_axis.replace(/_/g, " ")} Distribution`,
    insight: y_axis
      ? `This bar chart shows the ${aggregation} of ${y_axis.replace(
          /_/g,
          " "
        )} by ${x_axis.replace(/_/g, " ")}, with ${
          chartData.length
        } categories displayed.`
      : `This bar chart shows the distribution of ${x_axis.replace(
          /_/g,
          " "
        )} values, with ${chartData.length} categories displayed.`,
    interpretation:
      chartData.length > 0
        ? `The highest value is "${chartData[0][x_axis]}" with ${
            chartData[0][y_axis || "value"]
          } ${y_axis ? y_axis.replace(/_/g, " ") : "occurrences"}. ${
            chartData.length > 1
              ? `The data shows ${
                  sort_order === "desc" ? "decreasing" : "increasing"
                } values across categories.`
              : ""
          }`
        : "No data available for interpretation.",
  };
}

export function generatePieChartData(data: any[], parameters: any) {
  const {
    x_axis,
    y_axis,
    aggregation = "count",
    percentage = true,
    limit = 7,
  } = parameters;

  const grouped = data.reduce((acc, row) => {
    const key = row[x_axis];
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  let chartData = Object.entries(grouped).map(([key, values]) => {
    const count = (values as any[]).length;
    let aggregatedValue;

    if (aggregation === "count") {
      aggregatedValue = count;
    } else if (y_axis) {
      // Use y_axis column for aggregation
      const numericValues = (values as any[])
        .map((v) => parseFloat(v[y_axis]))
        .filter((v) => !isNaN(v));

      if (numericValues.length === 0) {
        aggregatedValue = count;
      } else {
        switch (aggregation) {
          case "mean":
            aggregatedValue =
              numericValues.reduce((sum, v) => sum + v, 0) /
              numericValues.length;
            break;
          case "sum":
            aggregatedValue = numericValues.reduce((sum, v) => sum + v, 0);
            break;
          case "max":
            aggregatedValue = Math.max(...numericValues);
            break;
          case "min":
            aggregatedValue = Math.min(...numericValues);
            break;
          default:
            aggregatedValue = numericValues.reduce((sum, v) => sum + v, 0);
        }
      }
    } else {
      aggregatedValue = count;
    }

    return {
      name: key,
      value: aggregatedValue,
      percentage: percentage
        ? Math.round(
            (aggregatedValue /
              data.reduce((sum, row) => {
                const val = y_axis ? parseFloat(row[y_axis]) || 0 : 1;
                return sum + val;
              }, 0)) *
              100
          )
        : aggregatedValue,
    };
  });

  chartData.sort((a, b) => (b.value as number) - (a.value as number));
  chartData = chartData.slice(0, limit);

  return {
    data: chartData,
    metadata: {
      x_column: x_axis,
      y_column: y_axis,
      total_points: chartData.length,
      show_percentage: percentage,
      aggregation,
    },
    title: y_axis
      ? `${x_axis.replace(/_/g, " ")} vs ${y_axis.replace(/_/g, " ")}`
      : `${x_axis.replace(/_/g, " ")} Composition`,
    insight: y_axis
      ? `This pie chart shows the ${aggregation} of ${y_axis.replace(
          /_/g,
          " "
        )} by ${x_axis.replace(/_/g, " ")} categories.`
      : `This pie chart shows the proportional breakdown of ${x_axis.replace(
          /_/g,
          " "
        )} categories.`,
    interpretation:
      chartData.length > 0
        ? `The largest segment is "${chartData[0].name}" representing ${
            chartData[0].percentage
          }% of the total${y_axis ? ` ${y_axis.replace(/_/g, " ")}` : ""}. ${
            chartData.length > 1
              ? `The distribution shows ${chartData.length} different categories.`
              : ""
          }`
        : "No data available for interpretation.",
  };
}

export function generateLineChartData(data: any[], parameters: any) {
  const { x_axis, y_axis, aggregation = "mean" } = parameters;

  // Group by x_axis and aggregate y_axis
  const grouped = data.reduce((acc, row) => {
    const key = row[x_axis];
    if (!acc[key]) acc[key] = [];
    acc[key].push(parseFloat(row[y_axis]) || 0);
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([key, values]) => {
    const vals = values as number[];
    let aggregatedValue;
    switch (aggregation) {
      case "sum":
        aggregatedValue = vals.reduce((sum: number, v: number) => sum + v, 0);
        break;
      case "mean":
      default:
        aggregatedValue =
          vals.reduce((sum: number, v: number) => sum + v, 0) / vals.length;
        break;
    }

    return {
      [x_axis]: key,
      [y_axis]: aggregatedValue,
    };
  });

  // Sort by x_axis if it's a date/time or numeric
  chartData.sort((a, b) => {
    const aVal = a[x_axis];
    const bVal = b[x_axis];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return String(aVal).localeCompare(String(bVal));
    }
    return parseFloat(String(aVal)) - parseFloat(String(bVal));
  });

  return {
    data: chartData,
    metadata: {
      x_column: x_axis,
      y_column: y_axis,
      total_points: chartData.length,
      aggregation,
    },
    title: `${y_axis.replace(/_/g, " ")} Trends Over ${x_axis.replace(
      /_/g,
      " "
    )}`,
    insight: `This line chart displays the trend of ${y_axis.replace(
      /_/g,
      " "
    )} over ${x_axis.replace(/_/g, " ")} using ${aggregation} aggregation.`,
    interpretation:
      chartData.length > 0
        ? `The chart shows ${chartData.length} data points. Look for trends, patterns, seasonality, or sudden changes in the line progression.`
        : "No data available for interpretation.",
  };
}

export function generateScatterChartData(data: any[], parameters: any) {
  const { x_axis, y_axis, color_by } = parameters;

  const chartData = data
    .map((row) => ({
      [x_axis]: parseFloat(row[x_axis]) || 0,
      [y_axis]: parseFloat(row[y_axis]) || 0,
      ...(color_by && { [color_by]: row[color_by] }),
    }))
    .filter((row) => !isNaN(row[x_axis]) && !isNaN(row[y_axis]));

  return {
    data: chartData,
    metadata: {
      x_column: x_axis,
      y_column: y_axis,
      color_column: color_by,
      total_points: chartData.length,
    },
    title: `${x_axis.replace(/_/g, " ")} vs ${y_axis.replace(/_/g, " ")}`,
    insight: `This scatter chart shows the relationship between ${x_axis.replace(
      /_/g,
      " "
    )} and ${y_axis.replace(/_/g, " ")}.`,
    interpretation:
      chartData.length > 0
        ? `The chart displays ${chartData.length} data points. ${
            color_by
              ? `Points are colored by ${color_by.replace(
                  /_/g,
                  " "
                )} for additional insight.`
              : ""
          } Look for patterns, clusters, or correlations in the data distribution.`
        : "No data available for interpretation.",
  };
}

export function generateHistogramData(data: any[], parameters: any) {
  const { x_axis, bins = 10 } = parameters;

  const values = data
    .map((row) => parseFloat(row[x_axis]))
    .filter((v) => !isNaN(v));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;

  const histogram = Array(bins)
    .fill(0)
    .map((_, i) => ({
      bin: `${(min + i * binWidth).toFixed(1)}-${(
        min +
        (i + 1) * binWidth
      ).toFixed(1)}`,
      count: 0,
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
    }));

  values.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    histogram[binIndex].count++;
  });

  return {
    data: histogram,
    metadata: {
      x_column: x_axis,
      total_points: histogram.length,
      bins,
      min,
      max,
    },
    title: `${x_axis.replace(/_/g, " ")} Distribution`,
    insight: `This histogram shows the frequency distribution of ${x_axis.replace(
      /_/g,
      " "
    )} values across ${bins} bins.`,
    interpretation: `The data ranges from ${min.toFixed(2)} to ${max.toFixed(
      2
    )}. The histogram reveals the shape of the distribution and can help identify patterns like normal distribution, skewness, or outliers.`,
  };
}

export function generateBoxPlotData(data: any[], parameters: any) {
  const { x_axis, y_axis, show_outliers = true } = parameters;

  const grouped = data.reduce((acc, row) => {
    const key = row[x_axis];
    if (!acc[key]) acc[key] = [];
    const value = parseFloat(row[y_axis]);
    if (!isNaN(value)) acc[key].push(value);
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([key, values]) => {
    const vals = values as number[];
    vals.sort((a: number, b: number) => a - b);
    const q1 = vals[Math.floor(vals.length * 0.25)];
    const median = vals[Math.floor(vals.length * 0.5)];
    const q3 = vals[Math.floor(vals.length * 0.75)];
    const iqr = q3 - q1;
    const min = Math.max(vals[0], q1 - 1.5 * iqr);
    const max = Math.min(vals[vals.length - 1], q3 + 1.5 * iqr);

    return {
      category: key,
      min,
      q1,
      median,
      q3,
      max,
      outliers: show_outliers
        ? vals.filter((v: number) => v < min || v > max)
        : [],
    };
  });

  return {
    data: chartData,
    metadata: {
      x_column: x_axis,
      y_column: y_axis,
      total_points: chartData.length,
      show_outliers,
    },
    title: `${y_axis.replace(/_/g, " ")} by ${x_axis.replace(/_/g, " ")}`,
    insight: `This box plot compares the distribution of ${y_axis.replace(
      /_/g,
      " "
    )} across different ${x_axis.replace(/_/g, " ")} categories.`,
    interpretation:
      chartData.length > 0
        ? `The chart shows statistical summaries (median, quartiles, outliers) for ${chartData.length} categories. Compare the box positions and sizes to understand differences between groups.`
        : "No data available for interpretation.",
  };
}

export function generateRadarChartData(data: any[], parameters: any) {
  const { group_by, aggregation = "mean", limit = 6 } = parameters;

  // Get numeric columns for radar chart
  const numericColumns = Object.keys(data[0] || {}).filter((key) =>
    data.some((row) => !isNaN(parseFloat(row[key])))
  );

  let chartData;

  if (group_by) {
    const grouped = data.reduce((acc, row) => {
      const key = row[group_by];
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    chartData = Object.entries(grouped)
      .slice(0, limit)
      .map(([key, rows]) => {
        const result: any = { group: key };
        const rowsArray = rows as any[];
        numericColumns.forEach((col) => {
          const values = rowsArray
            .map((row: any) => parseFloat(row[col]))
            .filter((v: number) => !isNaN(v));
          result[col] =
            aggregation === "sum"
              ? values.reduce((sum: number, v: number) => sum + v, 0)
              : values.reduce((sum: number, v: number) => sum + v, 0) /
                values.length;
        });
        return result;
      });
  } else {
    // Single profile
    const result: any = { group: "Overall" };
    numericColumns.forEach((col) => {
      const values = data
        .map((row) => parseFloat(row[col]))
        .filter((v) => !isNaN(v));
      result[col] =
        aggregation === "sum"
          ? values.reduce((sum, v) => sum + v, 0)
          : values.reduce((sum, v) => sum + v, 0) / values.length;
    });
    chartData = [result];
  }

  return {
    data: chartData,
    metadata: {
      group_column: group_by,
      numeric_columns: numericColumns,
      total_points: chartData.length,
      aggregation,
    },
    title: "Multi-dimensional Profile Analysis",
    insight: `This radar chart provides a multi-dimensional view of ${
      numericColumns.length
    } numeric variables${
      group_by ? ` grouped by ${group_by.replace(/_/g, " ")}` : ""
    }.`,
    interpretation:
      chartData.length > 0
        ? `The chart displays ${chartData.length} profile${
            chartData.length > 1 ? "s" : ""
          } across ${
            numericColumns.length
          } dimensions. Compare the shapes and sizes of the radar areas to identify patterns and differences between groups.`
        : "No data available for interpretation.",
  };
}

export function generateHeatmapData(data: any[], parameters: any) {
  const {
    x_axis,
    y_axis,
    value_column = null,
    bins_x = 10,
    bins_y = 10,
  } = parameters;

  console.log("[generateHeatmapData] Parameters:", {
    x_axis,
    y_axis,
    value_column,
    bins_x,
    bins_y,
  });

  if (!x_axis || !y_axis) {
    throw new Error("Heatmap requires both x_axis and y_axis parameters");
  }

  // Get unique categories for x and y axes
  const xValues = [...new Set(data.map((row) => String(row[x_axis])))].sort();
  const yValues = [...new Set(data.map((row) => String(row[y_axis])))].sort();

  console.log("[generateHeatmapData] Categories:", {
    xValues: xValues.length,
    yValues: yValues.length,
  });

  // Create a map to count occurrences or aggregate values
  const heatmapMap = new Map();
  let maxValue = 0;
  let minValue = Infinity;

  // Initialize all combinations with 0
  xValues.forEach((x) => {
    yValues.forEach((y) => {
      heatmapMap.set(`${x}-${y}`, 0);
    });
  });

  // Populate the heatmap with data
  data.forEach((row) => {
    const x = String(row[x_axis]);
    const y = String(row[y_axis]);
    const key = `${x}-${y}`;

    if (value_column && row[value_column] !== undefined) {
      // Use the specified value column
      const value = parseFloat(row[value_column]) || 0;
      heatmapMap.set(key, (heatmapMap.get(key) || 0) + value);
    } else {
      // Count occurrences
      heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
    }
  });

  // Find min and max values
  heatmapMap.forEach((value) => {
    maxValue = Math.max(maxValue, value);
    minValue = Math.min(minValue, value);
  });

  // Convert to array format expected by the renderer
  const heatmapData: any[] = [];

  xValues.forEach((x, xIndex) => {
    yValues.forEach((y, yIndex) => {
      const key = `${x}-${y}`;
      const value = heatmapMap.get(key) || 0;

      heatmapData.push({
        x: x,
        y: y,
        value: value,
        x_index: xIndex,
        y_index: yIndex,
      });
    });
  });

  console.log(
    "[generateHeatmapData] Generated data points:",
    heatmapData.length
  );
  console.log("[generateHeatmapData] Value range:", { minValue, maxValue });

  return {
    data: heatmapData,
    metadata: {
      x_column: x_axis,
      y_column: y_axis,
      value_column: value_column,
      x_categories: xValues,
      y_categories: yValues,
      total_points: heatmapData.length,
      max_value: maxValue,
      min_value: minValue,
    },
    title: `${x_axis.replace(/_/g, " ")} vs ${y_axis.replace(/_/g, " ")}`,
    insight: value_column
      ? `This heatmap shows the distribution of ${value_column.replace(
          /_/g,
          " "
        )} across ${x_axis.replace(/_/g, " ")} and ${y_axis.replace(
          /_/g,
          " "
        )} combinations.`
      : `This heatmap shows the frequency of occurrences for each combination of ${x_axis.replace(
          /_/g,
          " "
        )} and ${y_axis.replace(/_/g, " ")}.`,
    interpretation:
      heatmapData.length > 0
        ? `The heatmap displays ${xValues.length} x ${
            yValues.length
          } cells with values ranging from ${minValue} to ${maxValue}. ${
            maxValue > 0
              ? `The highest intensity areas indicate the most ${
                  value_column ? "significant values" : "frequent combinations"
                }.`
              : "Most combinations show zero or minimal activity."
          } Look for patterns, clusters, or gaps in the data distribution.`
        : "No data available for interpretation.",
  };
}
