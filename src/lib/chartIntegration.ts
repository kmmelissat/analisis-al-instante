// Frontend chart integration utilities for Chart.js and D3.js
import { ChartType, ChartDataResponse, ChartJSConfig, D3Config } from "@/types";

// Color palettes for consistent styling
export const COLOR_PALETTES = {
  default: [
    "#2563eb",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ],
  categorical: [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ],
  sequential: [
    "#eff6ff",
    "#dbeafe",
    "#bfdbfe",
    "#93c5fd",
    "#60a5fa",
    "#3b82f6",
    "#2563eb",
    "#1d4ed8",
    "#1e40af",
    "#1e3a8a",
  ],
  diverging: [
    "#7f1d1d",
    "#dc2626",
    "#f87171",
    "#fecaca",
    "#f3f4f6",
    "#d1fae5",
    "#6ee7b7",
    "#34d399",
    "#10b981",
    "#047857",
  ],
};

// Chart.js configuration generator
export class ChartJSIntegration {
  static generateConfig(response: ChartDataResponse): ChartJSConfig {
    const { config, data, metadata } = response;
    const chartType = config.chart_type;

    switch (chartType) {
      case "bar":
      case "grouped_bar":
        return this.generateBarConfig(response);
      case "line":
      case "multi_line":
        return this.generateLineConfig(response);
      case "pie":
      case "donut":
        return this.generatePieConfig(response);
      case "scatter":
        return this.generateScatterConfig(response);
      case "bubble":
        return this.generateBubbleConfig(response);
      case "area":
      case "stacked_area":
        return this.generateAreaConfig(response);
      case "stacked_bar":
        return this.generateStackedBarConfig(response);
      case "histogram":
        return this.generateHistogramConfig(response);
      case "box":
        return this.generateBoxConfig(response);
      case "radar":
        return this.generateRadarConfig(response);
      case "heatmap":
        return this.generateHeatmapConfig(response);
      default:
        return this.generateDefaultConfig(response);
    }
  }

  private static generateBarConfig(response: ChartDataResponse): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "bar",
      data: {
        labels: data.map((item) =>
          String(item[metadata.x_column || config.x_axis || "x"])
        ),
        datasets: [
          {
            label: metadata.y_column || config.y_axis || "Values",
            data: data.map((item) =>
              Number(item[metadata.y_column || config.y_axis || "y"])
            ),
            backgroundColor: COLOR_PALETTES.default[0] + "CC",
            borderColor: COLOR_PALETTES.default[0],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text:
              response.title ||
              `${metadata.y_column || "Values"} by ${
                metadata.x_column || "Category"
              }`,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "Category",
            },
          },
          y: {
            title: {
              display: true,
              text: metadata.y_column || config.y_axis || "Values",
            },
            beginAtZero: true,
          },
        },
      },
    };
  }

  private static generateLineConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    // Handle multi-line charts
    if (
      config.chart_type === "multi_line" &&
      Array.isArray(data) &&
      data.length > 0 &&
      "series" in data[0]
    ) {
      const seriesData = data as Array<{
        series: string;
        points: Array<{ x: any; y: number }>;
      }>;

      return {
        type: "line",
        data: {
          datasets: seriesData.map((series, index) => ({
            label: series.series,
            data: series.points,
            borderColor:
              COLOR_PALETTES.default[index % COLOR_PALETTES.default.length],
            backgroundColor:
              COLOR_PALETTES.default[index % COLOR_PALETTES.default.length] +
              "20",
            tension: 0.4,
            parsing: {
              xAxisKey: "x",
              yAxisKey: "y",
            },
          })),
        },
        options: {
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
              text: response.title || "Multi-line Trend Analysis",
            },
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: metadata.x_column || config.x_axis || "X Axis",
              },
            },
            y: {
              title: {
                display: true,
                text: metadata.y_column || config.y_axis || "Y Axis",
              },
            },
          },
        },
      };
    }

    // Single line chart
    return {
      type: "line",
      data: {
        labels: data.map((item) =>
          String(item[metadata.x_column || config.x_axis || "x"])
        ),
        datasets: [
          {
            label: metadata.y_column || config.y_axis || "Values",
            data: data.map((item) =>
              Number(item[metadata.y_column || config.y_axis || "y"])
            ),
            borderColor: COLOR_PALETTES.default[0],
            backgroundColor: COLOR_PALETTES.default[0] + "20",
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Trend Analysis",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "Time",
            },
          },
          y: {
            title: {
              display: true,
              text: metadata.y_column || config.y_axis || "Values",
            },
          },
        },
      },
    };
  }

  private static generatePieConfig(response: ChartDataResponse): ChartJSConfig {
    const { data, metadata, config } = response;
    const isDonut = config.chart_type === "donut";

    return {
      type: isDonut ? "doughnut" : "pie",
      data: {
        labels: data.map((item) =>
          String(item[metadata.x_column || config.x_axis || "label"])
        ),
        datasets: [
          {
            data: data.map((item) =>
              Number(item.value || item[metadata.y_column || "value"])
            ),
            backgroundColor: COLOR_PALETTES.categorical.slice(0, data.length),
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Distribution Analysis",
          },
          legend: {
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = (context.dataset.data as number[]).reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = (
                  ((context.parsed as number) / total) *
                  100
                ).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              },
            },
          },
        },
      },
    };
  }

  private static generateScatterConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Data Points",
            data: data.map((item) => ({
              x: Number(item[metadata.x_column || config.x_axis || "x"]),
              y: Number(item[metadata.y_column || config.y_axis || "y"]),
            })),
            backgroundColor: COLOR_PALETTES.default[0] + "80",
            borderColor: COLOR_PALETTES.default[0],
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Scatter Plot Analysis",
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              afterLabel: function (context) {
                if (metadata.correlation) {
                  return `Correlation: ${metadata.correlation.toFixed(3)}`;
                }
                return "";
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "X Values",
            },
          },
          y: {
            title: {
              display: true,
              text: metadata.y_column || config.y_axis || "Y Values",
            },
          },
        },
      },
    };
  }

  private static generateBubbleConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "Bubble Chart",
            data: data.map((item) => ({
              x: Number(item[metadata.x_column || config.x_axis || "x"]),
              y: Number(item[metadata.y_column || config.y_axis || "y"]),
              r: Math.sqrt(Number(item.size || item.r || 10)) * 2, // Scale bubble size
            })),
            backgroundColor: COLOR_PALETTES.default[0] + "60",
            borderColor: COLOR_PALETTES.default[0],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Bubble Chart Analysis",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            type: "linear",
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "X Values",
            },
          },
          y: {
            title: {
              display: true,
              text: metadata.y_column || config.y_axis || "Y Values",
            },
          },
        },
      },
    };
  }

  private static generateAreaConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "line",
      data: {
        labels: data.map((item) =>
          String(item[metadata.x_column || config.x_axis || "x"])
        ),
        datasets: [
          {
            label: metadata.y_column || config.y_axis || "Values",
            data: data.map((item) =>
              Number(item[metadata.y_column || config.y_axis || "y"])
            ),
            borderColor: COLOR_PALETTES.default[0],
            backgroundColor: COLOR_PALETTES.default[0] + "40",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Area Chart Analysis",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "Time",
            },
          },
          y: {
            title: {
              display: true,
              text: metadata.y_column || config.y_axis || "Values",
            },
            beginAtZero: true,
          },
        },
      },
    };
  }

  private static generateStackedBarConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    // Group data by stack category
    const stackedData = this.groupDataForStacking(data, metadata);

    return {
      type: "bar",
      data: {
        labels: stackedData.labels,
        datasets: stackedData.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor:
            COLOR_PALETTES.default[index % COLOR_PALETTES.default.length] +
            "CC",
          borderColor:
            COLOR_PALETTES.default[index % COLOR_PALETTES.default.length],
          borderWidth: 1,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Stacked Bar Analysis",
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "Categories",
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: metadata.y_column || config.y_axis || "Values",
            },
          },
        },
      },
    };
  }

  private static generateHistogramConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "bar",
      data: {
        labels: data.map((item) =>
          String(item.bin || item.range || item[metadata.x_column || "bin"])
        ),
        datasets: [
          {
            label: "Frequency",
            data: data.map((item) =>
              Number(item.count || item.frequency || item.value)
            ),
            backgroundColor: COLOR_PALETTES.default[0] + "80",
            borderColor: COLOR_PALETTES.default[0],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Distribution Histogram",
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: metadata.x_column || config.x_axis || "Bins",
            },
          },
          y: {
            title: {
              display: true,
              text: "Frequency",
            },
            beginAtZero: true,
          },
        },
      },
    };
  }

  private static generateBoxConfig(response: ChartDataResponse): ChartJSConfig {
    // Note: Chart.js doesn't have native box plot support
    // This would require a plugin like chartjs-chart-box-and-violin-plot
    return this.generateDefaultConfig(response);
  }

  private static generateRadarConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "radar",
      data: {
        labels:
          metadata.axes || data.map((item) => String(item.axis || item.label)),
        datasets: [
          {
            label: "Values",
            data: data.map((item) => Number(item.value || item.y)),
            borderColor: COLOR_PALETTES.default[0],
            backgroundColor: COLOR_PALETTES.default[0] + "40",
            pointBackgroundColor: COLOR_PALETTES.default[0],
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: COLOR_PALETTES.default[0],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Radar Chart Analysis",
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: metadata.max_value,
          },
        },
      },
    };
  }

  private static generateHeatmapConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    // Note: Chart.js doesn't have native heatmap support
    // This would require a plugin or custom implementation
    return this.generateDefaultConfig(response);
  }

  private static generateDefaultConfig(
    response: ChartDataResponse
  ): ChartJSConfig {
    const { data, metadata, config } = response;

    return {
      type: "bar", // Default fallback
      data: {
        labels: data.map((_, index) => `Item ${index + 1}`),
        datasets: [
          {
            label: "Data",
            data: data.map((item) => Number(Object.values(item)[0] || 0)),
            backgroundColor: COLOR_PALETTES.default[0] + "CC",
            borderColor: COLOR_PALETTES.default[0],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: response.title || "Chart Analysis",
          },
        },
      },
    };
  }

  private static groupDataForStacking(data: any[], metadata: any) {
    // Helper method to group data for stacked charts
    const labels: string[] = [];
    const datasets: Array<{ label: string; data: number[] }> = [];

    // This is a simplified implementation
    // In practice, you'd need to properly group by stack_by parameter

    return { labels, datasets };
  }
}

// D3.js configuration and utilities
export class D3Integration {
  static generateConfig(response: ChartDataResponse): D3Config {
    const { config, data, metadata } = response;

    const baseConfig: D3Config = {
      width: 800,
      height: 600,
      margin: { top: 50, right: 50, bottom: 100, left: 100 },
      scales: {},
      data: data,
    };

    switch (config.chart_type) {
      case "heatmap":
        return this.generateHeatmapConfig(response, baseConfig);
      case "treemap":
        return this.generateTreemapConfig(response, baseConfig);
      case "sunburst":
        return this.generateSunburstConfig(response, baseConfig);
      case "sankey":
        return this.generateSankeyConfig(response, baseConfig);
      case "chord":
        return this.generateChordConfig(response, baseConfig);
      case "violin":
        return this.generateViolinConfig(response, baseConfig);
      case "density":
        return this.generateDensityConfig(response, baseConfig);
      default:
        return baseConfig;
    }
  }

  private static generateHeatmapConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    const { metadata } = response;

    return {
      ...baseConfig,
      scales: {
        x: {
          type: "scaleBand",
          domain: metadata.x_categories || [],
          range: [
            0,
            baseConfig.width - baseConfig.margin.left - baseConfig.margin.right,
          ],
          padding: 0.1,
        },
        y: {
          type: "scaleBand",
          domain: metadata.y_categories || [],
          range: [
            baseConfig.height -
              baseConfig.margin.top -
              baseConfig.margin.bottom,
            0,
          ],
          padding: 0.1,
        },
        color: {
          type: "scaleSequential",
          domain: [metadata.min_value || 0, metadata.max_value || 100],
          interpolator: "interpolateBlues",
        },
      },
      chartSpecific: {
        cellSize: {
          width:
            (baseConfig.width -
              baseConfig.margin.left -
              baseConfig.margin.right) /
            (metadata.x_categories?.length || 1),
          height:
            (baseConfig.height -
              baseConfig.margin.top -
              baseConfig.margin.bottom) /
            (metadata.y_categories?.length || 1),
        },
      },
    };
  }

  private static generateTreemapConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    return {
      ...baseConfig,
      scales: {
        color: {
          type: "scaleOrdinal",
          domain: response.data.map((d) => d.category || d.name),
          range: COLOR_PALETTES.categorical,
        },
      },
      chartSpecific: {
        hierarchy: {
          sum: (d: any) => d.value || 0,
          sort: (a: any, b: any) => b.value - a.value,
        },
      },
    };
  }

  private static generateSunburstConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    const radius = Math.min(baseConfig.width, baseConfig.height) / 2 - 50;

    return {
      ...baseConfig,
      width: radius * 2 + 100,
      height: radius * 2 + 100,
      scales: {
        color: {
          type: "scaleOrdinal",
          range: COLOR_PALETTES.categorical,
        },
      },
      chartSpecific: {
        radius,
        partition: {
          size: [2 * Math.PI, radius],
        },
      },
    };
  }

  private static generateSankeyConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    return {
      ...baseConfig,
      scales: {
        color: {
          type: "scaleOrdinal",
          range: COLOR_PALETTES.categorical,
        },
      },
      chartSpecific: {
        sankey: {
          nodeWidth: 15,
          nodePadding: 10,
          extent: [
            [1, 1],
            [baseConfig.width - 1, baseConfig.height - 6],
          ],
        },
      },
    };
  }

  private static generateChordConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    const radius = Math.min(baseConfig.width, baseConfig.height) / 2 - 100;

    return {
      ...baseConfig,
      width: radius * 2 + 200,
      height: radius * 2 + 200,
      scales: {
        color: {
          type: "scaleOrdinal",
          range: COLOR_PALETTES.categorical,
        },
      },
      chartSpecific: {
        radius,
        innerRadius: radius - 100,
        outerRadius: radius - 50,
      },
    };
  }

  private static generateViolinConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    const { metadata } = response;

    return {
      ...baseConfig,
      scales: {
        x: {
          type: "scaleBand",
          domain: metadata.x_categories || [],
          range: [
            0,
            baseConfig.width - baseConfig.margin.left - baseConfig.margin.right,
          ],
          padding: 0.2,
        },
        y: {
          type: "scaleLinear",
          domain: [metadata.min_value || 0, metadata.max_value || 100],
          range: [
            baseConfig.height -
              baseConfig.margin.top -
              baseConfig.margin.bottom,
            0,
          ],
        },
      },
      chartSpecific: {
        bandwidth: 0.1, // KDE bandwidth
        violinWidth: 50,
      },
    };
  }

  private static generateDensityConfig(
    response: ChartDataResponse,
    baseConfig: D3Config
  ): D3Config {
    const { metadata } = response;

    return {
      ...baseConfig,
      scales: {
        x: {
          type: "scaleLinear",
          domain: [metadata.min_value || 0, metadata.max_value || 100],
          range: [
            0,
            baseConfig.width - baseConfig.margin.left - baseConfig.margin.right,
          ],
        },
        y: {
          type: "scaleLinear",
          domain: [0, 1], // Density values
          range: [
            baseConfig.height -
              baseConfig.margin.top -
              baseConfig.margin.bottom,
            0,
          ],
        },
      },
      chartSpecific: {
        bandwidth: 0.1,
        curve: "curveBasis",
      },
    };
  }
}

// Utility functions for chart rendering
export const getOptimalChartSize = (
  chartType: ChartType,
  containerWidth: number,
  containerHeight: number
) => {
  const aspectRatios: Record<ChartType, number> = {
    bar: 1.6,
    line: 1.6,
    scatter: 1.2,
    bubble: 1.2,
    pie: 1,
    donut: 1,
    radar: 1,
    heatmap: 1.2,
    treemap: 1.6,
    sunburst: 1,
    histogram: 1.6,
    box: 1.4,
    violin: 1.4,
    area: 1.6,
    stacked_bar: 1.6,
    grouped_bar: 1.6,
    multi_line: 1.6,
    stacked_area: 1.6,
    density: 1.6,
    ridgeline: 2,
    candlestick: 1.6,
    waterfall: 1.6,
    gantt: 2,
    sankey: 1.6,
    chord: 1,
    funnel: 1.4,
  };

  const targetRatio = aspectRatios[chartType] || 1.6;
  const currentRatio = containerWidth / containerHeight;

  if (currentRatio > targetRatio) {
    // Container is too wide
    return {
      width: containerHeight * targetRatio,
      height: containerHeight,
    };
  } else {
    // Container is too tall
    return {
      width: containerWidth,
      height: containerWidth / targetRatio,
    };
  }
};

export const getChartColors = (
  count: number,
  palette: keyof typeof COLOR_PALETTES = "default"
) => {
  const colors = COLOR_PALETTES[palette];
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }

  return result;
};

export const formatChartData = (data: any[], chartType: ChartType) => {
  // Format data based on chart type requirements
  switch (chartType) {
    case "scatter":
    case "bubble":
      return data.map((item) => ({
        x: Number(item.x || 0),
        y: Number(item.y || 0),
        r: Number(item.r || item.size || 5),
      }));

    case "pie":
    case "donut":
      return data.map((item) => ({
        label: String(item.label || item.name || "Unknown"),
        value: Number(item.value || 0),
      }));

    default:
      return data;
  }
};

// Export configuration generators
export { ChartJSIntegration, D3Integration };
