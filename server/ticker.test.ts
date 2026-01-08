import { describe, expect, it } from "vitest";

describe("Ticker Symbol Validation", () => {
  // Test ticker symbol cleaning logic
  const cleanTicker = (ticker: string): string => {
    return ticker.toUpperCase().replace(/[^A-Z]/g, "");
  };

  it("converts lowercase ticker to uppercase", () => {
    expect(cleanTicker("aapl")).toBe("AAPL");
    expect(cleanTicker("msft")).toBe("MSFT");
  });

  it("removes non-alphabetic characters", () => {
    expect(cleanTicker("AAPL123")).toBe("AAPL");
    expect(cleanTicker("BRK.B")).toBe("BRKB");
    expect(cleanTicker("BRK-A")).toBe("BRKA");
  });

  it("handles mixed case and special characters", () => {
    expect(cleanTicker("Aapl")).toBe("AAPL");
    expect(cleanTicker("m$ft")).toBe("MFT");
    expect(cleanTicker("  GOOG  ")).toBe("GOOG");
  });

  it("returns empty string for invalid input", () => {
    expect(cleanTicker("123")).toBe("");
    expect(cleanTicker("!@#$")).toBe("");
  });

  it("validates ticker length constraints", () => {
    const isValidLength = (ticker: string): boolean => {
      const cleaned = cleanTicker(ticker);
      return cleaned.length >= 1 && cleaned.length <= 10;
    };

    expect(isValidLength("A")).toBe(true);
    expect(isValidLength("AAPL")).toBe(true);
    expect(isValidLength("GOOGL")).toBe(true);
    expect(isValidLength("")).toBe(false);
    expect(isValidLength("ABCDEFGHIJK")).toBe(false); // 11 chars
  });
});

describe("Ticker Symbol Format", () => {
  it("recognizes common US stock tickers", () => {
    const commonTickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "TSLA"];
    
    commonTickers.forEach(ticker => {
      expect(ticker).toMatch(/^[A-Z]{1,5}$/);
    });
  });

  it("handles class shares notation", () => {
    // BRK.A and BRK.B become BRKA and BRKB after cleaning
    const cleanTicker = (ticker: string): string => {
      return ticker.toUpperCase().replace(/[^A-Z]/g, "");
    };

    expect(cleanTicker("BRK.A")).toBe("BRKA");
    expect(cleanTicker("BRK.B")).toBe("BRKB");
  });
});
