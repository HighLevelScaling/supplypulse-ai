import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { leads, suppliers, alerts, alertRules, supplierNews, supplierCertifications } from "../drizzle/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { seedDatabase } from "./seed";
import { getSupplierSECData, fetchSECFilings, fetchStockInsights, extractKeyEvents, categorizeFilings } from "./secEdgar";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // LEADS ROUTER
  // ============================================
  leads: router({
    create: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        jobTitle: z.string().optional(),
        companySize: z.string().optional(),
        message: z.string().optional(),
        source: z.enum(["website", "demo_request", "contact_form", "newsletter", "referral", "linkedin", "event", "other"]).default("website"),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Calculate lead score based on completeness
        let score = 20;
        if (input.company) score += 20;
        if (input.jobTitle) score += 15;
        if (input.companySize) score += 15;
        if (input.message) score += 10;
        
        // Boost score for certain job titles
        const highValueTitles = ["vp", "director", "head", "chief", "ceo", "coo", "cfo"];
        if (input.jobTitle && highValueTitles.some(t => input.jobTitle!.toLowerCase().includes(t))) {
          score += 20;
        }
        
        await db.insert(leads).values({
          ...input,
          score,
          status: "new",
        });
        
        return { success: true, score };
      }),
    
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        source: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { leads: [], total: 0 };
        
        const conditions = [];
        if (input.status && input.status !== "all") {
          conditions.push(eq(leads.status, input.status as any));
        }
        if (input.source && input.source !== "all") {
          conditions.push(eq(leads.source, input.source as any));
        }
        
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        
        const result = await db.select()
          .from(leads)
          .where(whereClause)
          .orderBy(desc(leads.createdAt))
          .limit(input.limit)
          .offset(input.offset);
        
        const countResult = await db.select({ count: sql<number>`count(*)` })
          .from(leads)
          .where(whereClause);
        
        return {
          leads: result,
          total: countResult[0]?.count || 0,
        };
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.update(leads)
          .set({ status: input.status, updatedAt: new Date() })
          .where(eq(leads.id, input.id));
        
        return { success: true };
      }),
  }),

  // ============================================
  // SUPPLIERS ROUTER
  // ============================================
  suppliers: router({
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        tier: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { suppliers: [], total: 0 };
        
        const conditions = [eq(suppliers.userId, ctx.user.id)];
        
        if (input.status && input.status !== "all") {
          conditions.push(eq(suppliers.status, input.status as any));
        }
        if (input.tier && input.tier !== "all") {
          conditions.push(eq(suppliers.tier, input.tier as any));
        }
        
        const result = await db.select()
          .from(suppliers)
          .where(and(...conditions))
          .orderBy(desc(suppliers.overallRiskScore))
          .limit(input.limit)
          .offset(input.offset);
        
        const countResult = await db.select({ count: sql<number>`count(*)` })
          .from(suppliers)
          .where(and(...conditions));
        
        return {
          suppliers: result,
          total: countResult[0]?.count || 0,
        };
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        
        const result = await db.select()
          .from(suppliers)
          .where(and(eq(suppliers.id, input.id), eq(suppliers.userId, ctx.user.id)))
          .limit(1);
        
        return result[0] || null;
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        ticker: z.string().optional(),
        industry: z.string().optional(),
        country: z.string().optional(),
        region: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
        tier: z.enum(["strategic", "preferred", "approved", "conditional"]).default("approved"),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const result = await db.insert(suppliers).values({
          ...input,
          userId: ctx.user.id,
          status: "active",
          overallRiskScore: 50,
          financialRiskScore: 50,
          qualityRiskScore: 50,
          geopoliticalRiskScore: 50,
          operationalRiskScore: 50,
        });
        
        return { success: true, id: result[0].insertId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        status: z.enum(["active", "monitoring", "at_risk", "critical", "inactive"]).optional(),
        tier: z.enum(["strategic", "preferred", "approved", "conditional"]).optional(),
        overallRiskScore: z.number().min(0).max(100).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { id, ...updateData } = input;
        
        await db.update(suppliers)
          .set({ ...updateData, updatedAt: new Date() })
          .where(and(eq(suppliers.id, id), eq(suppliers.userId, ctx.user.id)));
        
        return { success: true };
      }),
    
    updateTicker: protectedProcedure
      .input(z.object({
        supplierId: z.number(),
        ticker: z.string().min(1).max(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Validate ticker format (uppercase letters only)
        const cleanTicker = input.ticker.toUpperCase().replace(/[^A-Z]/g, "");
        if (cleanTicker.length === 0) {
          throw new Error("Invalid ticker symbol");
        }
        
        await db.update(suppliers)
          .set({ 
            ticker: cleanTicker, 
            publicCompany: true,
            updatedAt: new Date() 
          })
          .where(and(eq(suppliers.id, input.supplierId), eq(suppliers.userId, ctx.user.id)));
        
        return { success: true, ticker: cleanTicker };
      }),
    
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return {
        total: 0,
        byStatus: {},
        byTier: {},
        avgRiskScore: 0,
        criticalCount: 0,
      };
      
      const allSuppliers = await db.select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id));
      
      const byStatus: Record<string, number> = {};
      const byTier: Record<string, number> = {};
      let totalRisk = 0;
      let criticalCount = 0;
      
      allSuppliers.forEach(s => {
        byStatus[s.status || "active"] = (byStatus[s.status || "active"] || 0) + 1;
        byTier[s.tier || "approved"] = (byTier[s.tier || "approved"] || 0) + 1;
        totalRisk += s.overallRiskScore || 0;
        if ((s.overallRiskScore || 0) >= 70) criticalCount++;
      });
      
      return {
        total: allSuppliers.length,
        byStatus,
        byTier,
        avgRiskScore: allSuppliers.length > 0 ? Math.round(totalRisk / allSuppliers.length) : 0,
        criticalCount,
      };
    }),
  }),

  // ============================================
  // ALERTS ROUTER
  // ============================================
  alerts: router({
    list: protectedProcedure
      .input(z.object({
        severity: z.string().optional(),
        status: z.string().optional(),
        limit: z.number().default(50),
      }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        
        const conditions = [eq(alerts.userId, ctx.user.id)];
        
        if (input.severity && input.severity !== "all") {
          conditions.push(eq(alerts.severity, input.severity as any));
        }
        if (input.status && input.status !== "all") {
          conditions.push(eq(alerts.status, input.status as any));
        }
        
        return db.select()
          .from(alerts)
          .where(and(...conditions))
          .orderBy(desc(alerts.createdAt))
          .limit(input.limit);
      }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.update(alerts)
          .set({ status: "read", readAt: new Date() })
          .where(and(eq(alerts.id, input.id), eq(alerts.userId, ctx.user.id)));
        
        return { success: true };
      }),
    
    dismiss: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.update(alerts)
          .set({ status: "dismissed" })
          .where(and(eq(alerts.id, input.id), eq(alerts.userId, ctx.user.id)));
        
        return { success: true };
      }),
    
    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return 0;
      
      const result = await db.select({ count: sql<number>`count(*)` })
        .from(alerts)
        .where(and(eq(alerts.userId, ctx.user.id), eq(alerts.status, "unread")));
      
      return result[0]?.count || 0;
    }),
  }),

  // ============================================
  // AI CHAT ROUTER
  // ============================================
  chat: router({
    query: protectedProcedure
      .input(z.object({
        message: z.string().min(1),
        conversationId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        
        // Get user's supplier data for context
        let supplierContext = "";
        if (db) {
          const userSuppliers = await db.select()
            .from(suppliers)
            .where(eq(suppliers.userId, ctx.user.id))
            .limit(20);
          
          if (userSuppliers.length > 0) {
            supplierContext = `\n\nUser's supplier data:\n${userSuppliers.map(s => 
              `- ${s.name}: Risk Score ${s.overallRiskScore}, Status: ${s.status}, Tier: ${s.tier}`
            ).join('\n')}`;
          }
        }
        
        const systemPrompt = `You are SupplyPulse AI, an intelligent assistant for supplier intelligence and risk management. 
You help users analyze their supplier portfolio, understand risk factors, and make data-driven decisions.
Be concise, professional, and provide actionable insights.
Use markdown formatting for better readability.
When discussing risk scores, explain what they mean and suggest actions.
${supplierContext}`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
          });
          
          return {
            response: response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.",
            conversationId: input.conversationId || Date.now().toString(),
          };
        } catch (error) {
          console.error("LLM Error:", error);
          return {
            response: "I'm having trouble processing your request right now. Please try again in a moment.",
            conversationId: input.conversationId || Date.now().toString(),
          };
        }
      }),
  }),

  // ============================================
  // ANALYTICS ROUTER
  // ============================================
  analytics: router({
    getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return {
        totalSuppliers: 0,
        activeAlerts: 0,
        avgRiskScore: 0,
        criticalSuppliers: 0,
        riskTrend: [],
        suppliersByRegion: [],
        recentActivity: [],
      };
      
      // Get supplier stats
      const supplierList = await db.select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id));
      
      // Get active alerts
      const alertList = await db.select()
        .from(alerts)
        .where(and(eq(alerts.userId, ctx.user.id), eq(alerts.status, "unread")));
      
      // Calculate metrics
      const totalRisk = supplierList.reduce((sum, s) => sum + (s.overallRiskScore || 0), 0);
      const avgRisk = supplierList.length > 0 ? Math.round(totalRisk / supplierList.length) : 0;
      const criticalCount = supplierList.filter(s => (s.overallRiskScore || 0) >= 70).length;
      
      // Group by region
      const regionCounts: Record<string, number> = {};
      supplierList.forEach(s => {
        const region = s.region || "Unknown";
        regionCounts[region] = (regionCounts[region] || 0) + 1;
      });
      
      return {
        totalSuppliers: supplierList.length,
        activeAlerts: alertList.length,
        avgRiskScore: avgRisk,
        criticalSuppliers: criticalCount,
        riskTrend: [
          { month: "Aug", score: 42 },
          { month: "Sep", score: 45 },
          { month: "Oct", score: 43 },
          { month: "Nov", score: 48 },
          { month: "Dec", score: 46 },
          { month: "Jan", score: avgRisk },
        ],
        suppliersByRegion: Object.entries(regionCounts).map(([name, value]) => ({ name, value })),
        recentActivity: alertList.slice(0, 5),
      };
    }),
    
    getRiskDistribution: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      
      const supplierList = await db.select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id));
      
      const distribution = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      };
      
      supplierList.forEach(s => {
        const score = s.overallRiskScore || 0;
        if (score < 30) distribution.low++;
        else if (score < 50) distribution.medium++;
        else if (score < 70) distribution.high++;
        else distribution.critical++;
      });
      
      return [
        { name: "Low Risk", value: distribution.low, color: "oklch(0.75 0.18 150)" },
        { name: "Medium Risk", value: distribution.medium, color: "oklch(0.80 0.16 85)" },
        { name: "High Risk", value: distribution.high, color: "oklch(0.65 0.20 25)" },
        { name: "Critical", value: distribution.critical, color: "oklch(0.60 0.25 25)" },
      ];
    }),
  }),

  // ============================================
  // SEED ROUTER (for demo purposes)
  // ============================================
  seed: router({
    run: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        await seedDatabase(ctx.user.id);
        return { success: true, message: "Database seeded successfully" };
      } catch (error) {
        console.error("Seed error:", error);
        return { success: false, message: "Failed to seed database" };
      }
    }),
  }),

  // ============================================
  // REPORTS ROUTER
  // ============================================
  reports: router({
    generate: protectedProcedure
      .input(z.object({
        type: z.enum(["executive_summary", "risk_assessment", "supplier_deep_dive", "competitive_intelligence"]),
        supplierId: z.number().optional(),
        dateRange: z.object({
          start: z.string(),
          end: z.string(),
        }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // In a real implementation, this would generate a PDF report
        return {
          success: true,
          reportId: Date.now().toString(),
          downloadUrl: `/api/reports/${Date.now()}`,
        };
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      // Return mock data for now
      return [
        {
          id: 1,
          name: "Weekly Supplier Risk Summary",
          type: "automated",
          frequency: "weekly",
          lastGenerated: new Date().toISOString(),
          status: "completed",
          pages: 12,
        },
        {
          id: 2,
          name: "Monthly Portfolio Analysis",
          type: "automated",
          frequency: "monthly",
          lastGenerated: new Date().toISOString(),
          status: "completed",
          pages: 28,
        },
      ];
    }),
  }),

  // ============================================
  // SEC EDGAR ROUTER
  // ============================================
  sec: router({
    // Fetch SEC filings for a supplier by ticker
    getFilings: protectedProcedure
      .input(z.object({
        ticker: z.string().min(1),
      }))
      .query(async ({ input }) => {
        const filings = await fetchSECFilings(input.ticker);
        if (!filings) {
          return { success: false, error: "Unable to fetch SEC filings", filings: null };
        }
        
        const categorized = categorizeFilings(filings.filings || []);
        const keyEvents = extractKeyEvents(filings.filings?.filter(f => f.type.includes("8-K")) || []);
        
        return {
          success: true,
          symbol: filings.symbol,
          totalFilings: filings.filings?.length || 0,
          filings: filings.filings?.slice(0, 20) || [],
          categorized: {
            annual: categorized.annual.slice(0, 5),
            quarterly: categorized.quarterly.slice(0, 8),
            current: categorized.current.slice(0, 10),
          },
          keyEvents: keyEvents.slice(0, 10),
        };
      }),
    
    // Fetch comprehensive stock insights
    getInsights: protectedProcedure
      .input(z.object({
        ticker: z.string().min(1),
      }))
      .query(async ({ input }) => {
        const insights = await fetchStockInsights(input.ticker);
        if (!insights) {
          return { success: false, error: "Unable to fetch stock insights", insights: null };
        }
        
        return {
          success: true,
          symbol: insights.symbol,
          companyName: insights.companyName,
          technicalOutlook: insights.instrumentInfo?.technicalEvents,
          valuation: insights.instrumentInfo?.valuation,
          companyMetrics: insights.companySnapshot?.company,
          sectorMetrics: insights.companySnapshot?.sector,
          recommendation: insights.recommendation,
          significantDevelopments: insights.sigDevs?.slice(0, 10),
          secReports: insights.secReports?.slice(0, 5),
        };
      }),
    
    // Get full SEC data with risk assessment for a supplier
    getFullAnalysis: protectedProcedure
      .input(z.object({
        ticker: z.string().min(1),
      }))
      .query(async ({ input }) => {
        const data = await getSupplierSECData(input.ticker);
        
        return {
          success: true,
          ticker: input.ticker,
          riskAssessment: data.riskAssessment,
          filingsSummary: data.categorizedFilings ? {
            annualReports: data.categorizedFilings.annual.length,
            quarterlyReports: data.categorizedFilings.quarterly.length,
            currentReports: data.categorizedFilings.current.length,
            otherFilings: data.categorizedFilings.other.length,
          } : null,
          recentFilings: data.filings?.filings?.slice(0, 10) || [],
          insights: data.insights ? {
            companyName: data.insights.companyName,
            technicalOutlook: data.insights.instrumentInfo?.technicalEvents?.shortTermOutlook,
            valuation: data.insights.instrumentInfo?.valuation,
            recommendation: data.insights.recommendation,
          } : null,
        };
      }),
    
    // Sync SEC data to a supplier and update risk scores
    syncSupplier: protectedProcedure
      .input(z.object({
        supplierId: z.number(),
        ticker: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Verify supplier belongs to user
        const supplierResult = await db.select()
          .from(suppliers)
          .where(and(eq(suppliers.id, input.supplierId), eq(suppliers.userId, ctx.user.id)))
          .limit(1);
        
        if (supplierResult.length === 0) {
          throw new Error("Supplier not found");
        }
        
        // Fetch SEC data
        const secData = await getSupplierSECData(input.ticker);
        
        // Update supplier with new risk scores
        await db.update(suppliers)
          .set({
            ticker: input.ticker.toUpperCase(),
            overallRiskScore: secData.riskAssessment.overallRiskScore,
            financialRiskScore: secData.riskAssessment.financialRiskScore,
            qualityRiskScore: secData.riskAssessment.qualityRiskScore,
            geopoliticalRiskScore: secData.riskAssessment.geopoliticalRiskScore,
            operationalRiskScore: secData.riskAssessment.operationalRiskScore,
            lastAssessmentDate: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(suppliers.id, input.supplierId));
        
        // Create alert if risk is high
        if (secData.riskAssessment.overallRiskScore >= 70) {
          await db.insert(alerts).values({
            userId: ctx.user.id,
            supplierId: input.supplierId,
            title: `High Risk Alert: ${supplierResult[0].name}`,
            message: `SEC data analysis indicates elevated risk (score: ${secData.riskAssessment.overallRiskScore}). Risk factors: ${secData.riskAssessment.riskFactors.slice(0, 3).join("; ")}`,
            alertType: "financial_risk",
            severity: secData.riskAssessment.overallRiskScore >= 80 ? "critical" : "high",
            priority: secData.riskAssessment.overallRiskScore,
            status: "unread",
          });
        }
        
        return {
          success: true,
          riskAssessment: secData.riskAssessment,
          message: `Successfully synced SEC data for ${input.ticker}`,
        };
      }),
    
    // Bulk sync all suppliers with tickers
    syncAll: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Get all suppliers with tickers
      const suppliersWithTickers = await db.select()
        .from(suppliers)
        .where(and(
          eq(suppliers.userId, ctx.user.id),
          sql`${suppliers.ticker} IS NOT NULL AND ${suppliers.ticker} != ''`
        ));
      
      const results: Array<{ supplierId: number; ticker: string; success: boolean; error?: string }> = [];
      
      // Process each supplier (with rate limiting)
      for (const supplier of suppliersWithTickers) {
        if (!supplier.ticker) continue;
        
        try {
          const secData = await getSupplierSECData(supplier.ticker);
          
          await db.update(suppliers)
            .set({
              overallRiskScore: secData.riskAssessment.overallRiskScore,
              financialRiskScore: secData.riskAssessment.financialRiskScore,
              qualityRiskScore: secData.riskAssessment.qualityRiskScore,
              geopoliticalRiskScore: secData.riskAssessment.geopoliticalRiskScore,
              operationalRiskScore: secData.riskAssessment.operationalRiskScore,
              lastAssessmentDate: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(suppliers.id, supplier.id));
          
          results.push({ supplierId: supplier.id, ticker: supplier.ticker, success: true });
          
          // Rate limiting: wait 500ms between requests
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          results.push({
            supplierId: supplier.id,
            ticker: supplier.ticker,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      
      return {
        success: true,
        totalProcessed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
