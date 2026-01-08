/**
 * SEC EDGAR API Integration Service
 * Fetches real-time SEC filings and financial data for suppliers
 */

import { callDataApi } from "./_core/dataApi";

// Types for SEC Filing data
export interface SECFiling {
  type: string;
  title: string;
  date: string;
  edgarUrl: string;
  maxAge?: number;
  exhibits?: SECExhibit[];
}

export interface SECExhibit {
  type: string;
  url: string;
}

export interface SECFilingsResponse {
  symbol: string;
  filings: SECFiling[];
  maxAge?: number;
}

export interface StockInsights {
  symbol: string;
  companyName?: string;
  instrumentInfo?: {
    technicalEvents?: {
      provider: string;
      sector: string;
      shortTermOutlook?: {
        stateDescription: string;
        direction: string;
        score: number;
        scoreDescription: string;
      };
      intermediateTermOutlook?: {
        stateDescription: string;
        direction: string;
        score: number;
        scoreDescription: string;
      };
      longTermOutlook?: {
        stateDescription: string;
        direction: string;
        score: number;
        scoreDescription: string;
      };
    };
    valuation?: {
      color: number;
      description: string;
      discount: string;
      relativeValue: string;
      provider: string;
    };
  };
  companySnapshot?: {
    company?: {
      innovativeness: number;
      hiring: number;
      sustainability: number;
      insiderSentiments: number;
      earningsReports: number;
      dividends: number;
    };
    sector?: {
      innovativeness: number;
      hiring: number;
      sustainability: number;
      insiderSentiments: number;
      earningsReports: number;
      dividends: number;
    };
  };
  recommendation?: {
    targetPrice: number;
    provider: string;
    rating: string;
  };
  events?: Array<{
    eventType: string;
    pricePeriod: string;
    tradingHorizon: string;
    tradeType: string;
    startDate: number;
    endDate: number;
  }>;
  reports?: Array<{
    id: string;
    headHtml: string;
    provider: string;
  }>;
  sigDevs?: Array<{
    headline: string;
    date: string;
  }>;
  secReports?: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    filingDate: number;
    snapshotUrl: string;
  }>;
  upsell?: {
    companyName: string;
    upsellReportType: string;
  };
}

export interface FinancialMetrics {
  revenue?: number;
  netIncome?: number;
  grossProfit?: number;
  operatingIncome?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
  currentRatio?: number;
  debtToEquity?: number;
  profitMargin?: number;
}

export interface RiskAssessment {
  overallRiskScore: number;
  financialRiskScore: number;
  qualityRiskScore: number;
  geopoliticalRiskScore: number;
  operationalRiskScore: number;
  riskFactors: string[];
  lastUpdated: Date;
}

/**
 * Fetch SEC filings for a given stock symbol
 */
export async function fetchSECFilings(symbol: string): Promise<SECFilingsResponse | null> {
  try {
    const result = await callDataApi("YahooFinance/get_stock_sec_filing", {
      query: {
        symbol: symbol.toUpperCase(),
        region: "US",
        lang: "en-US",
      },
    });
    
    return result as SECFilingsResponse;
  } catch (error) {
    console.error(`Failed to fetch SEC filings for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch comprehensive stock insights including financial analysis
 */
export async function fetchStockInsights(symbol: string): Promise<StockInsights | null> {
  try {
    const result = await callDataApi("YahooFinance/get_stock_insights", {
      query: {
        symbol: symbol.toUpperCase(),
      },
    });
    
    return result as StockInsights;
  } catch (error) {
    console.error(`Failed to fetch stock insights for ${symbol}:`, error);
    return null;
  }
}

/**
 * Parse SEC filings to extract key financial filing types
 */
export function categorizeFilings(filings: SECFiling[]): {
  annual: SECFiling[];      // 10-K filings
  quarterly: SECFiling[];   // 10-Q filings
  current: SECFiling[];     // 8-K filings
  other: SECFiling[];
} {
  const result = {
    annual: [] as SECFiling[],
    quarterly: [] as SECFiling[],
    current: [] as SECFiling[],
    other: [] as SECFiling[],
  };
  
  for (const filing of filings) {
    const type = filing.type.toUpperCase();
    
    if (type.includes("10-K") || type === "10K") {
      result.annual.push(filing);
    } else if (type.includes("10-Q") || type === "10Q") {
      result.quarterly.push(filing);
    } else if (type.includes("8-K") || type === "8K") {
      result.current.push(filing);
    } else {
      result.other.push(filing);
    }
  }
  
  return result;
}

/**
 * Calculate risk score based on stock insights and filing patterns
 */
export function calculateRiskScore(
  insights: StockInsights | null,
  filings: SECFilingsResponse | null
): RiskAssessment {
  const riskFactors: string[] = [];
  let financialRisk = 50;
  let qualityRisk = 50;
  let operationalRisk = 50;
  let geopoliticalRisk = 30; // Default lower for US companies
  
  if (insights) {
    // Analyze technical outlook
    const techEvents = insights.instrumentInfo?.technicalEvents;
    if (techEvents) {
      // Short-term outlook affects operational risk
      if (techEvents.shortTermOutlook) {
        const shortScore = techEvents.shortTermOutlook.score || 0;
        if (shortScore < 0) {
          operationalRisk += Math.abs(shortScore) * 5;
          riskFactors.push(`Negative short-term technical outlook: ${techEvents.shortTermOutlook.stateDescription}`);
        } else if (shortScore > 0) {
          operationalRisk -= shortScore * 3;
        }
      }
      
      // Long-term outlook affects financial risk
      if (techEvents.longTermOutlook) {
        const longScore = techEvents.longTermOutlook.score || 0;
        if (longScore < 0) {
          financialRisk += Math.abs(longScore) * 5;
          riskFactors.push(`Negative long-term technical outlook: ${techEvents.longTermOutlook.stateDescription}`);
        } else if (longScore > 0) {
          financialRisk -= longScore * 3;
        }
      }
    }
    
    // Analyze valuation
    const valuation = insights.instrumentInfo?.valuation;
    if (valuation) {
      if (valuation.relativeValue === "Overvalued") {
        financialRisk += 10;
        riskFactors.push("Stock appears overvalued relative to sector");
      } else if (valuation.relativeValue === "Undervalued") {
        financialRisk -= 5;
      }
    }
    
    // Analyze company metrics
    const company = insights.companySnapshot?.company;
    if (company) {
      // Hiring trends indicate operational health
      if (company.hiring < 0.3) {
        operationalRisk += 10;
        riskFactors.push("Low hiring activity may indicate operational challenges");
      }
      
      // Sustainability affects long-term quality
      if (company.sustainability < 0.3) {
        qualityRisk += 8;
        riskFactors.push("Low sustainability score");
      }
      
      // Insider sentiment is a key indicator
      if (company.insiderSentiments < 0.3) {
        financialRisk += 12;
        riskFactors.push("Negative insider sentiment detected");
      } else if (company.insiderSentiments > 0.7) {
        financialRisk -= 5;
      }
      
      // Earnings reports quality
      if (company.earningsReports < 0.3) {
        financialRisk += 10;
        riskFactors.push("Earnings reports below expectations");
      }
    }
    
    // Analyze significant developments
    if (insights.sigDevs && insights.sigDevs.length > 0) {
      // Check for negative headlines
      const negativeKeywords = ["lawsuit", "investigation", "recall", "decline", "loss", "layoff", "fraud", "breach"];
      for (const dev of insights.sigDevs.slice(0, 5)) {
        const headline = dev.headline.toLowerCase();
        for (const keyword of negativeKeywords) {
          if (headline.includes(keyword)) {
            operationalRisk += 5;
            riskFactors.push(`Recent development: ${dev.headline.substring(0, 100)}`);
            break;
          }
        }
      }
    }
  }
  
  // Analyze filing patterns
  if (filings && filings.filings) {
    const categorized = categorizeFilings(filings.filings);
    
    // Check for recent 8-K filings (may indicate material events)
    const recentCurrentFilings = categorized.current.filter(f => {
      const filingDate = new Date(f.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return filingDate > thirtyDaysAgo;
    });
    
    if (recentCurrentFilings.length > 3) {
      operationalRisk += 8;
      riskFactors.push(`${recentCurrentFilings.length} material event filings (8-K) in the last 30 days`);
    }
    
    // Check filing regularity
    if (categorized.quarterly.length < 4) {
      qualityRisk += 10;
      riskFactors.push("Incomplete quarterly filing history");
    }
    
    if (categorized.annual.length === 0) {
      financialRisk += 15;
      riskFactors.push("No annual reports (10-K) found");
    }
  } else {
    // No SEC data available - higher uncertainty
    financialRisk += 20;
    qualityRisk += 15;
    riskFactors.push("Unable to retrieve SEC filing data");
  }
  
  // Normalize scores to 0-100 range
  financialRisk = Math.max(0, Math.min(100, financialRisk));
  qualityRisk = Math.max(0, Math.min(100, qualityRisk));
  operationalRisk = Math.max(0, Math.min(100, operationalRisk));
  geopoliticalRisk = Math.max(0, Math.min(100, geopoliticalRisk));
  
  // Calculate overall risk as weighted average
  const overallRiskScore = Math.round(
    financialRisk * 0.35 +
    qualityRisk * 0.25 +
    operationalRisk * 0.25 +
    geopoliticalRisk * 0.15
  );
  
  return {
    overallRiskScore,
    financialRiskScore: Math.round(financialRisk),
    qualityRiskScore: Math.round(qualityRisk),
    geopoliticalRiskScore: Math.round(geopoliticalRisk),
    operationalRiskScore: Math.round(operationalRisk),
    riskFactors: riskFactors.slice(0, 10), // Limit to top 10 factors
    lastUpdated: new Date(),
  };
}

/**
 * Get comprehensive SEC data for a supplier
 */
export async function getSupplierSECData(ticker: string): Promise<{
  filings: SECFilingsResponse | null;
  insights: StockInsights | null;
  riskAssessment: RiskAssessment;
  categorizedFilings: ReturnType<typeof categorizeFilings> | null;
}> {
  // Fetch data in parallel
  const [filings, insights] = await Promise.all([
    fetchSECFilings(ticker),
    fetchStockInsights(ticker),
  ]);
  
  // Calculate risk based on all available data
  const riskAssessment = calculateRiskScore(insights, filings);
  
  // Categorize filings if available
  const categorizedFilings = filings?.filings ? categorizeFilings(filings.filings) : null;
  
  return {
    filings,
    insights,
    riskAssessment,
    categorizedFilings,
  };
}

/**
 * Extract key financial events from 8-K filings
 */
export function extractKeyEvents(filings: SECFiling[]): Array<{
  date: string;
  type: string;
  title: string;
  url: string;
  importance: "high" | "medium" | "low";
}> {
  const events: Array<{
    date: string;
    type: string;
    title: string;
    url: string;
    importance: "high" | "medium" | "low";
  }> = [];
  
  const highImportanceKeywords = [
    "bankruptcy", "merger", "acquisition", "ceo", "cfo", "resignation",
    "restatement", "investigation", "delisting", "default"
  ];
  
  const mediumImportanceKeywords = [
    "earnings", "dividend", "buyback", "restructuring", "layoff",
    "contract", "partnership", "settlement"
  ];
  
  for (const filing of filings) {
    const titleLower = filing.title.toLowerCase();
    let importance: "high" | "medium" | "low" = "low";
    
    if (highImportanceKeywords.some(k => titleLower.includes(k))) {
      importance = "high";
    } else if (mediumImportanceKeywords.some(k => titleLower.includes(k))) {
      importance = "medium";
    }
    
    events.push({
      date: filing.date,
      type: filing.type,
      title: filing.title,
      url: filing.edgarUrl,
      importance,
    });
  }
  
  // Sort by date (most recent first) and importance
  return events.sort((a, b) => {
    const importanceOrder = { high: 0, medium: 1, low: 2 };
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return importanceOrder[a.importance] - importanceOrder[b.importance];
  });
}
