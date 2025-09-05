// Intelligent chart selection and recommendation system
import {
  ChartType,
  ChartParameters,
  RecommendedChart,
  ChartCategory,
  AggregationFunction,
} from "@/types";
import {
  CHART_REQUIREMENTS,
  CHART_SELECTION_MATRIX,
  recommendChartTypes,
  validateChartCompatibility,
  generateDefaultParameters,
  getChartInfo,
} from "./chartUtils";

// Data analysis interface
export interface DataAnalysis {
  columns: string[];
  columnTypes: Record<string, string>;
  rowCount: number;
  numericColumns: string[];
  categoricalColumns: string[];
  datetimeColumns: string[];
  uniqueValueCounts: Record<string, number>;
  correlations?: Record<string, Record<string, number>>;
  missingValueCounts: Record<string, number>;
  summaryStats?: Record<
    string,
    {
      count: number;
      mean: number;
      std: number;
      min: number;
      "25%": number;
      "50%": number;
      "75%": number;
      max: number;
    }
  >;
}

// Chart recommendation scoring system
interface ChartScore {
  chartType: ChartType;
  score: number;
  confidence: number;
  reasoning: string[];
  parameters: ChartParameters;
  category: ChartCategory;
}

// Main recommendation engine
export class ChartRecommendationEngine {
  private dataAnalysis: DataAnalysis;

  constructor(dataAnalysis: DataAnalysis) {
    this.dataAnalysis = dataAnalysis;
  }

  // Generate comprehensive chart recommendations
  generateRecommendations(maxRecommendations: number = 8): RecommendedChart[] {
    const scores: ChartScore[] = [];

    // Score all possible chart types
    const allChartTypes = Object.keys(CHART_REQUIREMENTS) as ChartType[];

    for (const chartType of allChartTypes) {
      const score = this.scoreChartType(chartType);
      if (score.score > 0) {
        scores.push(score);
      }
    }

    // Sort by score and confidence
    scores.sort((a, b) => {
      const scoreA = a.score * (a.confidence / 100);
      const scoreB = b.score * (b.confidence / 100);
      return scoreB - scoreA;
    });

    // Convert to RecommendedChart format
    return scores.slice(0, maxRecommendations).map((score, index) => {
      const chartInfo = getChartInfo(score.chartType);

      return {
        title: this.generateChartTitle(score.chartType, score.parameters),
        chart_type: score.chartType,
        parameters: score.parameters,
        insight: this.generateInsight(
          score.chartType,
          score.parameters,
          score.reasoning
        ),
        priority: index + 1,
        confidence: score.confidence,
        category: score.category,
        use_case: chartInfo.description,
        data_requirements: {
          min_rows: CHART_REQUIREMENTS[score.chartType].min_data_points,
          required_columns: this.getRequiredColumns(score.parameters),
          column_types: this.getColumnTypes(score.parameters),
        },
      };
    });
  }

  // Score individual chart type
  private scoreChartType(chartType: ChartType): ChartScore {
    const requirements = CHART_REQUIREMENTS[chartType];
    let score = 0;
    let confidence = 0;
    const reasoning: string[] = [];

    // Generate default parameters for this chart type
    const parameters = generateDefaultParameters(
      chartType,
      this.dataAnalysis.columns,
      this.dataAnalysis.columnTypes
    );

    // Check if we have required data
    const compatibility = validateChartCompatibility(
      chartType,
      this.dataAnalysis.columnTypes,
      parameters
    );

    if (!compatibility.isValid) {
      return {
        chartType,
        score: 0,
        confidence: 0,
        reasoning: compatibility.errors,
        parameters,
        category: this.getChartCategory(chartType),
      };
    }

    // Base scoring factors

    // 1. Data compatibility (0-30 points)
    const compatibilityScore = this.scoreDataCompatibility(
      chartType,
      parameters
    );
    score += compatibilityScore.score;
    confidence += compatibilityScore.confidence;
    reasoning.push(...compatibilityScore.reasoning);

    // 2. Data size appropriateness (0-20 points)
    const sizeScore = this.scoreDataSize(chartType);
    score += sizeScore.score;
    confidence += sizeScore.confidence;
    reasoning.push(...sizeScore.reasoning);

    // 3. Data quality (0-15 points)
    const qualityScore = this.scoreDataQuality(chartType, parameters);
    score += qualityScore.score;
    confidence += qualityScore.confidence;
    reasoning.push(...qualityScore.reasoning);

    // 4. Chart complexity vs data complexity (0-15 points)
    const complexityScore = this.scoreComplexity(chartType);
    score += complexityScore.score;
    confidence += complexityScore.confidence;
    reasoning.push(...complexityScore.reasoning);

    // 5. Business value and insights potential (0-20 points)
    const insightScore = this.scoreInsightPotential(chartType, parameters);
    score += insightScore.score;
    confidence += insightScore.confidence;
    reasoning.push(...insightScore.reasoning);

    return {
      chartType,
      score,
      confidence: Math.min(confidence, 100),
      reasoning,
      parameters,
      category: this.getChartCategory(chartType),
    };
  }

  // Score data compatibility
  private scoreDataCompatibility(
    chartType: ChartType,
    parameters: ChartParameters
  ) {
    let score = 0;
    let confidence = 0;
    const reasoning: string[] = [];

    const requirements = CHART_REQUIREMENTS[chartType];

    // Check if we have suitable columns for required parameters
    let requiredParamsSatisfied = 0;
    for (const param of requirements.required_parameters) {
      if (parameters[param as keyof ChartParameters]) {
        requiredParamsSatisfied++;
        score += 5;
        confidence += 10;
      }
    }

    if (requiredParamsSatisfied === requirements.required_parameters.length) {
      score += 10; // Bonus for all required params
      confidence += 20;
      reasoning.push(
        "All required parameters can be satisfied with available data"
      );
    } else {
      reasoning.push(
        `Missing ${
          requirements.required_parameters.length - requiredParamsSatisfied
        } required parameters`
      );
    }

    // Check data type compatibility
    if (parameters.x_axis && requirements.data_types.x_axis) {
      const xType = this.dataAnalysis.columnTypes[parameters.x_axis];
      if (this.isCompatibleType(xType, requirements.data_types.x_axis)) {
        score += 5;
        confidence += 15;
        reasoning.push(`X-axis data type (${xType}) is compatible`);
      }
    }

    if (parameters.y_axis && requirements.data_types.y_axis) {
      const yType = this.dataAnalysis.columnTypes[parameters.y_axis];
      if (this.isCompatibleType(yType, requirements.data_types.y_axis)) {
        score += 5;
        confidence += 15;
        reasoning.push(`Y-axis data type (${yType}) is compatible`);
      }
    }

    return { score, confidence, reasoning };
  }

  // Score data size appropriateness
  private scoreDataSize(chartType: ChartType) {
    let score = 0;
    let confidence = 0;
    const reasoning: string[] = [];

    const requirements = CHART_REQUIREMENTS[chartType];
    const rowCount = this.dataAnalysis.rowCount;

    // Check minimum data points
    if (rowCount >= requirements.min_data_points) {
      score += 10;
      confidence += 20;
      reasoning.push(
        `Sufficient data points (${rowCount} >= ${requirements.min_data_points})`
      );
    } else {
      score -= 10;
      reasoning.push(
        `Insufficient data points (${rowCount} < ${requirements.min_data_points})`
      );
    }

    // Optimal data size ranges for different chart types
    const optimalRanges: Record<string, { min: number; max: number }> = {
      pie: { min: 3, max: 8 },
      bar: { min: 3, max: 50 },
      scatter: { min: 10, max: 10000 },
      histogram: { min: 30, max: 100000 },
      heatmap: { min: 10, max: 1000 },
      bubble: { min: 10, max: 1000 },
    };

    const range = optimalRanges[chartType];
    if (range) {
      if (rowCount >= range.min && rowCount <= range.max) {
        score += 10;
        confidence += 15;
        reasoning.push(`Data size is in optimal range for ${chartType} charts`);
      } else if (rowCount > range.max) {
        score += 5; // Still usable but not optimal
        reasoning.push(
          `Large dataset - consider aggregation for ${chartType} charts`
        );
      }
    }

    return { score, confidence, reasoning };
  }

  // Score data quality
  private scoreDataQuality(chartType: ChartType, parameters: ChartParameters) {
    let score = 0;
    let confidence = 0;
    const reasoning: string[] = [];

    // Check for missing values in key columns
    const keyColumns = [
      parameters.x_axis,
      parameters.y_axis,
      parameters.color_by,
      parameters.size_by,
    ].filter(Boolean) as string[];

    let totalMissingRatio = 0;
    for (const column of keyColumns) {
      let missingRatio = 0;

      // Use summary stats if available to estimate missing values
      if (this.dataAnalysis.summaryStats?.[column]) {
        const stats = this.dataAnalysis.summaryStats[column];
        const expectedCount = this.dataAnalysis.rowCount;
        const actualCount = stats.count;
        missingRatio = (expectedCount - actualCount) / expectedCount;
      } else {
        // Fallback to missing value counts
        const missingCount = this.dataAnalysis.missingValueCounts[column] || 0;
        missingRatio = missingCount / this.dataAnalysis.rowCount;
      }

      totalMissingRatio += missingRatio;

      if (missingRatio < 0.05) {
        score += 3;
        confidence += 5;
      } else if (missingRatio < 0.2) {
        score += 1;
        reasoning.push(
          `Column ${column} has ${(missingRatio * 100).toFixed(
            1
          )}% missing values`
        );
      } else {
        score -= 2;
        reasoning.push(
          `High missing values in ${column} (${(missingRatio * 100).toFixed(
            1
          )}%)`
        );
      }
    }

    // Check categorical column cardinality
    if (
      parameters.x_axis &&
      this.dataAnalysis.categoricalColumns.includes(parameters.x_axis)
    ) {
      const uniqueCount =
        this.dataAnalysis.uniqueValueCounts[parameters.x_axis];
      const requirements = CHART_REQUIREMENTS[chartType];

      if (
        requirements.max_categories &&
        uniqueCount > requirements.max_categories
      ) {
        score -= 5;
        reasoning.push(
          `Too many categories in ${parameters.x_axis} (${uniqueCount} > ${requirements.max_categories})`
        );
      } else if (
        uniqueCount >= 2 &&
        uniqueCount <= (requirements.max_categories || 20)
      ) {
        score += 5;
        confidence += 10;
        reasoning.push(
          `Good number of categories in ${parameters.x_axis} (${uniqueCount})`
        );
      }
    }

    return { score, confidence, reasoning };
  }

  // Score complexity appropriateness
  private scoreComplexity(chartType: ChartType) {
    let score = 0;
    let confidence = 0;
    const reasoning: string[] = [];

    const category = this.getChartCategory(chartType);
    const numColumns = this.dataAnalysis.columns.length;
    const numNumeric = this.dataAnalysis.numericColumns.length;
    const numCategorical = this.dataAnalysis.categoricalColumns.length;

    // Match chart complexity to data complexity
    if (category === "basic") {
      score += 10; // Always good to start with basic charts
      confidence += 15;
      reasoning.push("Basic chart type - good for initial exploration");

      if (numColumns <= 5) {
        score += 5;
        reasoning.push("Simple dataset suits basic charts well");
      }
    } else if (category === "advanced") {
      if (numColumns >= 3 && (numNumeric >= 2 || numCategorical >= 2)) {
        score += 8;
        confidence += 10;
        reasoning.push("Dataset complexity supports advanced visualizations");
      } else {
        score += 3;
        reasoning.push("Advanced chart may be overkill for simple dataset");
      }
    } else if (category === "statistical") {
      if (numNumeric >= 1 && this.dataAnalysis.rowCount >= 30) {
        score += 8;
        confidence += 12;
        reasoning.push("Sufficient data for statistical analysis");
      } else {
        score += 2;
        reasoning.push("Limited data for statistical charts");
      }
    } else if (category === "specialized") {
      if (numColumns >= 4) {
        score += 6;
        confidence += 8;
        reasoning.push(
          "Complex dataset may benefit from specialized visualization"
        );
      } else {
        score += 1;
        reasoning.push("Specialized chart may not add value to simple dataset");
      }
    }

    return { score, confidence, reasoning };
  }

  // Score insight potential
  private scoreInsightPotential(
    chartType: ChartType,
    parameters: ChartParameters
  ) {
    let score = 0;
    let confidence = 0;
    const reasoning: string[] = [];

    // Check for interesting relationships
    if (parameters.x_axis && parameters.y_axis) {
      // Check if we have correlation data
      if (this.dataAnalysis.correlations) {
        const correlation =
          this.dataAnalysis.correlations[parameters.x_axis]?.[
            parameters.y_axis
          ];
        if (correlation !== undefined) {
          const absCorr = Math.abs(correlation);
          if (absCorr > 0.7) {
            score += 10;
            confidence += 15;
            reasoning.push(
              `Strong correlation detected (${correlation.toFixed(2)})`
            );
          } else if (absCorr > 0.3) {
            score += 5;
            confidence += 10;
            reasoning.push(
              `Moderate correlation detected (${correlation.toFixed(2)})`
            );
          }
        }
      }

      // Bonus for scatter plots with numeric data
      if (
        chartType === "scatter" &&
        this.dataAnalysis.numericColumns.includes(parameters.x_axis) &&
        this.dataAnalysis.numericColumns.includes(parameters.y_axis)
      ) {
        score += 5;
        reasoning.push(
          "Scatter plot ideal for exploring numeric relationships"
        );
      }
    }

    // Time series bonus
    if (
      parameters.x_axis &&
      this.dataAnalysis.datetimeColumns.includes(parameters.x_axis)
    ) {
      if (["line", "area", "multi_line", "stacked_area"].includes(chartType)) {
        score += 8;
        confidence += 12;
        reasoning.push(
          "Time series data detected - temporal analysis valuable"
        );
      }
    }

    // Categorical analysis bonus
    if (
      parameters.x_axis &&
      this.dataAnalysis.categoricalColumns.includes(parameters.x_axis)
    ) {
      const uniqueCount =
        this.dataAnalysis.uniqueValueCounts[parameters.x_axis];
      if (uniqueCount >= 3 && uniqueCount <= 12) {
        if (["bar", "pie", "donut"].includes(chartType)) {
          score += 6;
          confidence += 10;
          reasoning.push(
            `Good categorical distribution for comparison (${uniqueCount} categories)`
          );
        }
      }
    }

    // Multi-dimensional analysis bonus
    if (parameters.color_by || parameters.size_by) {
      if (["bubble", "scatter", "heatmap"].includes(chartType)) {
        score += 5;
        confidence += 8;
        reasoning.push("Multi-dimensional encoding adds analytical depth");
      }
    }

    return { score, confidence, reasoning };
  }

  // Helper methods
  private isCompatibleType(actualType: string, expectedType: string): boolean {
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

  private getChartCategory(chartType: ChartType): ChartCategory {
    const categoryMap: Record<ChartType, ChartCategory> = {
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
    return categoryMap[chartType];
  }

  private generateChartTitle(
    chartType: ChartType,
    parameters: ChartParameters
  ): string {
    const xAxis = parameters.x_axis || "data";
    const yAxis = parameters.y_axis || "values";

    const titleTemplates: Record<ChartType, string> = {
      bar: `${yAxis} by ${xAxis}`,
      line: `${yAxis} trend over ${xAxis}`,
      pie: `${xAxis} distribution`,
      scatter: `${xAxis} vs ${yAxis} relationship`,
      histogram: `${xAxis} distribution`,
      box: `${yAxis} distribution by ${xAxis}`,
      area: `${yAxis} growth over ${xAxis}`,
      donut: `${xAxis} composition`,
      violin: `${yAxis} distribution patterns by ${xAxis}`,
      heatmap: `${xAxis} vs ${yAxis} correlation matrix`,
      bubble: `${xAxis}, ${yAxis} and ${parameters.size_by || "size"} analysis`,
      radar: `Multi-dimensional profile analysis`,
      treemap: `${xAxis} hierarchy by ${yAxis}`,
      sunburst: `${xAxis} hierarchical breakdown`,
      density: `${xAxis} probability density`,
      ridgeline: `${xAxis} distribution by ${yAxis}`,
      candlestick: `${yAxis} price action over ${xAxis}`,
      waterfall: `${yAxis} cumulative changes by ${xAxis}`,
      gantt: `${yAxis} timeline over ${xAxis}`,
      sankey: `${xAxis} to ${yAxis} flow diagram`,
      chord: `${xAxis} to ${yAxis} relationships`,
      funnel: `${xAxis} conversion funnel`,
      stacked_bar: `${yAxis} composition by ${xAxis}`,
      grouped_bar: `${yAxis} comparison across ${xAxis}`,
      multi_line: `${yAxis} trends by ${parameters.group_by || "group"}`,
      stacked_area: `${yAxis} composition over ${xAxis}`,
    };

    return titleTemplates[chartType] || `${chartType} analysis`;
  }

  private generateInsight(
    chartType: ChartType,
    parameters: ChartParameters,
    reasoning: string[]
  ): string {
    const chartInfo = getChartInfo(chartType);
    const mainReason =
      reasoning.find(
        (r) =>
          r.includes("correlation") ||
          r.includes("trend") ||
          r.includes("distribution")
      ) || reasoning[0];

    return `${chartInfo.description}. ${
      mainReason || "This visualization will help reveal patterns in your data."
    }`;
  }

  private getRequiredColumns(parameters: ChartParameters): string[] {
    return [
      parameters.x_axis,
      parameters.y_axis,
      parameters.color_by,
      parameters.size_by,
    ].filter(Boolean) as string[];
  }

  private getColumnTypes(parameters: ChartParameters): Record<string, string> {
    const types: Record<string, string> = {};

    if (parameters.x_axis) {
      types[parameters.x_axis] =
        this.dataAnalysis.columnTypes[parameters.x_axis];
    }
    if (parameters.y_axis) {
      types[parameters.y_axis] =
        this.dataAnalysis.columnTypes[parameters.y_axis];
    }
    if (parameters.color_by) {
      types[parameters.color_by] =
        this.dataAnalysis.columnTypes[parameters.color_by];
    }
    if (parameters.size_by) {
      types[parameters.size_by] =
        this.dataAnalysis.columnTypes[parameters.size_by];
    }

    return types;
  }
}

// Utility functions for quick recommendations
export const getQuickRecommendations = (
  dataAnalysis: DataAnalysis,
  analysisGoal?: string
): RecommendedChart[] => {
  const engine = new ChartRecommendationEngine(dataAnalysis);
  return engine.generateRecommendations(5);
};

export const recommendChartsForColumns = (
  xColumn: string,
  yColumn: string | null,
  dataAnalysis: DataAnalysis
): ChartType[] => {
  const xType = dataAnalysis.columnTypes[xColumn];
  const yType = yColumn ? dataAnalysis.columnTypes[yColumn] : null;

  return recommendChartTypes(xType, yType);
};

export const getBestChartForGoal = (
  goal: "compare" | "trend" | "distribution" | "relationship" | "composition",
  dataAnalysis: DataAnalysis
): ChartType[] => {
  const goalMappings: Record<string, ChartType[]> = {
    compare: ["bar", "grouped_bar", "box", "violin"],
    trend: ["line", "area", "multi_line", "stacked_area"],
    distribution: ["histogram", "density", "box", "violin"],
    relationship: ["scatter", "bubble", "heatmap"],
    composition: ["pie", "donut", "treemap", "stacked_bar"],
  };

  return goalMappings[goal] || ["bar"];
};
