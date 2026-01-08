import { describe, expect, it } from "vitest";
import { 
  categorizeFilings, 
  calculateRiskScore, 
  extractKeyEvents,
  type SECFiling,
  type SECFilingsResponse,
  type StockInsights
} from "./secEdgar";

describe("SEC EDGAR Integration", () => {
  describe("categorizeFilings", () => {
    it("correctly categorizes 10-K filings as annual", () => {
      const filings: SECFiling[] = [
        { type: "10-K", title: "Annual Report", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "10K", title: "Annual Report 2", date: "2024-01-10", edgarUrl: "https://sec.gov/2" },
      ];
      
      const result = categorizeFilings(filings);
      
      expect(result.annual).toHaveLength(2);
      expect(result.quarterly).toHaveLength(0);
      expect(result.current).toHaveLength(0);
    });

    it("correctly categorizes 10-Q filings as quarterly", () => {
      const filings: SECFiling[] = [
        { type: "10-Q", title: "Q1 Report", date: "2024-03-15", edgarUrl: "https://sec.gov/1" },
        { type: "10Q", title: "Q2 Report", date: "2024-06-15", edgarUrl: "https://sec.gov/2" },
        { type: "10-Q/A", title: "Amended Q3", date: "2024-09-15", edgarUrl: "https://sec.gov/3" },
      ];
      
      const result = categorizeFilings(filings);
      
      expect(result.quarterly).toHaveLength(3);
      expect(result.annual).toHaveLength(0);
    });

    it("correctly categorizes 8-K filings as current", () => {
      const filings: SECFiling[] = [
        { type: "8-K", title: "Material Event", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "8K", title: "Another Event", date: "2024-01-10", edgarUrl: "https://sec.gov/2" },
      ];
      
      const result = categorizeFilings(filings);
      
      expect(result.current).toHaveLength(2);
    });

    it("puts unknown filing types in other category", () => {
      const filings: SECFiling[] = [
        { type: "DEF 14A", title: "Proxy Statement", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "S-1", title: "Registration", date: "2024-01-10", edgarUrl: "https://sec.gov/2" },
      ];
      
      const result = categorizeFilings(filings);
      
      expect(result.other).toHaveLength(2);
      expect(result.annual).toHaveLength(0);
      expect(result.quarterly).toHaveLength(0);
      expect(result.current).toHaveLength(0);
    });

    it("handles mixed filing types correctly", () => {
      const filings: SECFiling[] = [
        { type: "10-K", title: "Annual", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "10-Q", title: "Quarterly", date: "2024-03-15", edgarUrl: "https://sec.gov/2" },
        { type: "8-K", title: "Current", date: "2024-02-15", edgarUrl: "https://sec.gov/3" },
        { type: "DEF 14A", title: "Proxy", date: "2024-04-15", edgarUrl: "https://sec.gov/4" },
      ];
      
      const result = categorizeFilings(filings);
      
      expect(result.annual).toHaveLength(1);
      expect(result.quarterly).toHaveLength(1);
      expect(result.current).toHaveLength(1);
      expect(result.other).toHaveLength(1);
    });
  });

  describe("calculateRiskScore", () => {
    it("returns default risk scores when no data available", () => {
      const result = calculateRiskScore(null, null);
      
      expect(result.overallRiskScore).toBeGreaterThan(0);
      expect(result.financialRiskScore).toBeGreaterThan(0);
      expect(result.riskFactors).toContain("Unable to retrieve SEC filing data");
    });

    it("increases risk for missing annual reports", () => {
      const filings: SECFilingsResponse = {
        symbol: "TEST",
        filings: [
          { type: "10-Q", title: "Q1", date: "2024-03-15", edgarUrl: "https://sec.gov/1" },
        ],
      };
      
      const result = calculateRiskScore(null, filings);
      
      expect(result.riskFactors).toContain("No annual reports (10-K) found");
    });

    it("increases risk for negative insider sentiment", () => {
      const insights: StockInsights = {
        symbol: "TEST",
        companySnapshot: {
          company: {
            innovativeness: 0.5,
            hiring: 0.5,
            sustainability: 0.5,
            insiderSentiments: 0.2, // Low insider sentiment
            earningsReports: 0.5,
            dividends: 0.5,
          },
        },
      };
      
      const result = calculateRiskScore(insights, null);
      
      expect(result.riskFactors.some(f => f.includes("insider sentiment"))).toBe(true);
    });

    it("normalizes all risk scores to 0-100 range", () => {
      const result = calculateRiskScore(null, null);
      
      expect(result.overallRiskScore).toBeGreaterThanOrEqual(0);
      expect(result.overallRiskScore).toBeLessThanOrEqual(100);
      expect(result.financialRiskScore).toBeGreaterThanOrEqual(0);
      expect(result.financialRiskScore).toBeLessThanOrEqual(100);
      expect(result.qualityRiskScore).toBeGreaterThanOrEqual(0);
      expect(result.qualityRiskScore).toBeLessThanOrEqual(100);
      expect(result.operationalRiskScore).toBeGreaterThanOrEqual(0);
      expect(result.operationalRiskScore).toBeLessThanOrEqual(100);
      expect(result.geopoliticalRiskScore).toBeGreaterThanOrEqual(0);
      expect(result.geopoliticalRiskScore).toBeLessThanOrEqual(100);
    });

    it("includes lastUpdated timestamp", () => {
      const result = calculateRiskScore(null, null);
      
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe("extractKeyEvents", () => {
    it("marks high importance events correctly", () => {
      const filings: SECFiling[] = [
        { type: "8-K", title: "CEO Resignation Announcement", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "8-K", title: "Merger Agreement", date: "2024-01-10", edgarUrl: "https://sec.gov/2" },
        { type: "8-K", title: "Bankruptcy Filing", date: "2024-01-05", edgarUrl: "https://sec.gov/3" },
      ];
      
      const events = extractKeyEvents(filings);
      
      expect(events.every(e => e.importance === "high")).toBe(true);
    });

    it("marks medium importance events correctly", () => {
      const filings: SECFiling[] = [
        { type: "8-K", title: "Quarterly Earnings Report", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "8-K", title: "Dividend Declaration", date: "2024-01-10", edgarUrl: "https://sec.gov/2" },
      ];
      
      const events = extractKeyEvents(filings);
      
      expect(events.every(e => e.importance === "medium")).toBe(true);
    });

    it("marks low importance events for generic titles", () => {
      const filings: SECFiling[] = [
        { type: "8-K", title: "Form 8-K Filing", date: "2024-01-15", edgarUrl: "https://sec.gov/1" },
        { type: "8-K", title: "Current Report", date: "2024-01-10", edgarUrl: "https://sec.gov/2" },
      ];
      
      const events = extractKeyEvents(filings);
      
      expect(events.every(e => e.importance === "low")).toBe(true);
    });

    it("sorts events by date (most recent first)", () => {
      const filings: SECFiling[] = [
        { type: "8-K", title: "Event 1", date: "2024-01-05", edgarUrl: "https://sec.gov/1" },
        { type: "8-K", title: "Event 2", date: "2024-01-15", edgarUrl: "https://sec.gov/2" },
        { type: "8-K", title: "Event 3", date: "2024-01-10", edgarUrl: "https://sec.gov/3" },
      ];
      
      const events = extractKeyEvents(filings);
      
      expect(events[0].date).toBe("2024-01-15");
      expect(events[1].date).toBe("2024-01-10");
      expect(events[2].date).toBe("2024-01-05");
    });

    it("returns empty array for empty input", () => {
      const events = extractKeyEvents([]);
      
      expect(events).toHaveLength(0);
    });
  });
});
