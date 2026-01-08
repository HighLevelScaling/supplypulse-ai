import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal, bigint } from "drizzle-orm/mysql-core";

// ============================================
// USER MANAGEMENT
// ============================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  company: varchar("company", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  avatarUrl: text("avatarUrl"),
  timezone: varchar("timezone", { length: 64 }).default("UTC"),
  notificationPreferences: json("notificationPreferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// SUPPLIERS
// ============================================

export const suppliers = mysqlTable("suppliers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  ticker: varchar("ticker", { length: 20 }),
  industry: varchar("industry", { length: 100 }),
  country: varchar("country", { length: 100 }),
  region: varchar("region", { length: 100 }),
  website: text("website"),
  description: text("description"),
  logoUrl: text("logoUrl"),
  
  // Financial metrics
  annualRevenue: decimal("annualRevenue", { precision: 15, scale: 2 }),
  employeeCount: int("employeeCount"),
  foundedYear: int("foundedYear"),
  publicCompany: boolean("publicCompany").default(false),
  
  // Risk scores (0-100)
  overallRiskScore: int("overallRiskScore").default(50),
  financialRiskScore: int("financialRiskScore").default(50),
  qualityRiskScore: int("qualityRiskScore").default(50),
  geopoliticalRiskScore: int("geopoliticalRiskScore").default(50),
  operationalRiskScore: int("operationalRiskScore").default(50),
  
  // Status
  status: mysqlEnum("status", ["active", "monitoring", "at_risk", "critical", "inactive"]).default("active"),
  tier: mysqlEnum("tier", ["strategic", "preferred", "approved", "conditional"]).default("approved"),
  
  // Relationships
  parentSupplierId: int("parentSupplierId"),
  
  // Metadata
  lastAssessmentDate: timestamp("lastAssessmentDate"),
  nextReviewDate: timestamp("nextReviewDate"),
  tags: json("tags"),
  customFields: json("customFields"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = typeof suppliers.$inferInsert;

// ============================================
// SUPPLIER CONTACTS
// ============================================

export const supplierContacts = mysqlTable("supplierContacts", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  department: varchar("department", { length: 100 }),
  isPrimary: boolean("isPrimary").default(false),
  linkedinUrl: text("linkedinUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupplierContact = typeof supplierContacts.$inferSelect;
export type InsertSupplierContact = typeof supplierContacts.$inferInsert;

// ============================================
// SUPPLIER CERTIFICATIONS
// ============================================

export const supplierCertifications = mysqlTable("supplierCertifications", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  certificationName: varchar("certificationName", { length: 255 }).notNull(),
  certificationBody: varchar("certificationBody", { length: 255 }),
  certificationType: mysqlEnum("certificationType", ["iso", "quality", "environmental", "safety", "industry", "other"]).default("other"),
  certificateNumber: varchar("certificateNumber", { length: 100 }),
  issueDate: timestamp("issueDate"),
  expiryDate: timestamp("expiryDate"),
  status: mysqlEnum("status", ["valid", "expiring_soon", "expired", "revoked"]).default("valid"),
  documentUrl: text("documentUrl"),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupplierCertification = typeof supplierCertifications.$inferSelect;
export type InsertSupplierCertification = typeof supplierCertifications.$inferInsert;

// ============================================
// SUPPLIER FINANCIALS
// ============================================

export const supplierFinancials = mysqlTable("supplierFinancials", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  fiscalYear: int("fiscalYear").notNull(),
  fiscalQuarter: int("fiscalQuarter"),
  
  // Income Statement
  revenue: decimal("revenue", { precision: 15, scale: 2 }),
  grossProfit: decimal("grossProfit", { precision: 15, scale: 2 }),
  operatingIncome: decimal("operatingIncome", { precision: 15, scale: 2 }),
  netIncome: decimal("netIncome", { precision: 15, scale: 2 }),
  
  // Balance Sheet
  totalAssets: decimal("totalAssets", { precision: 15, scale: 2 }),
  totalLiabilities: decimal("totalLiabilities", { precision: 15, scale: 2 }),
  totalEquity: decimal("totalEquity", { precision: 15, scale: 2 }),
  currentAssets: decimal("currentAssets", { precision: 15, scale: 2 }),
  currentLiabilities: decimal("currentLiabilities", { precision: 15, scale: 2 }),
  
  // Ratios
  currentRatio: decimal("currentRatio", { precision: 8, scale: 4 }),
  debtToEquity: decimal("debtToEquity", { precision: 8, scale: 4 }),
  profitMargin: decimal("profitMargin", { precision: 8, scale: 4 }),
  
  // Source
  dataSource: varchar("dataSource", { length: 100 }),
  filingUrl: text("filingUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupplierFinancial = typeof supplierFinancials.$inferSelect;
export type InsertSupplierFinancial = typeof supplierFinancials.$inferInsert;

// ============================================
// SUPPLIER PATENTS
// ============================================

export const supplierPatents = mysqlTable("supplierPatents", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  patentNumber: varchar("patentNumber", { length: 100 }).notNull(),
  title: text("title").notNull(),
  abstract: text("abstract"),
  inventors: json("inventors"),
  filingDate: timestamp("filingDate"),
  grantDate: timestamp("grantDate"),
  expiryDate: timestamp("expiryDate"),
  patentOffice: varchar("patentOffice", { length: 50 }),
  status: mysqlEnum("status", ["pending", "granted", "expired", "abandoned"]).default("granted"),
  classifications: json("classifications"),
  patentUrl: text("patentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupplierPatent = typeof supplierPatents.$inferSelect;
export type InsertSupplierPatent = typeof supplierPatents.$inferInsert;

// ============================================
// SUPPLIER NEWS & EVENTS
// ============================================

export const supplierNews = mysqlTable("supplierNews", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  sourceUrl: text("sourceUrl"),
  sourceName: varchar("sourceName", { length: 255 }),
  publishedAt: timestamp("publishedAt"),
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).default("neutral"),
  sentimentScore: decimal("sentimentScore", { precision: 5, scale: 4 }),
  category: mysqlEnum("category", ["financial", "operational", "legal", "partnership", "product", "leadership", "other"]).default("other"),
  relevanceScore: int("relevanceScore").default(50),
  isAlert: boolean("isAlert").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SupplierNews = typeof supplierNews.$inferSelect;
export type InsertSupplierNews = typeof supplierNews.$inferInsert;

// ============================================
// SUPPLIER RELATIONSHIPS (Network Graph)
// ============================================

export const supplierRelationships = mysqlTable("supplierRelationships", {
  id: int("id").autoincrement().primaryKey(),
  sourceSupplierId: int("sourceSupplierId").notNull(),
  targetSupplierId: int("targetSupplierId").notNull(),
  relationshipType: mysqlEnum("relationshipType", ["subsidiary", "partner", "competitor", "customer", "vendor", "joint_venture"]).notNull(),
  strength: int("strength").default(50),
  description: text("description"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupplierRelationship = typeof supplierRelationships.$inferSelect;
export type InsertSupplierRelationship = typeof supplierRelationships.$inferInsert;

// ============================================
// ALERTS
// ============================================

export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  supplierId: int("supplierId"),
  
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  
  alertType: mysqlEnum("alertType", [
    "financial_risk",
    "quality_issue",
    "certification_expiry",
    "news_alert",
    "price_change",
    "supply_disruption",
    "geopolitical",
    "competitor_activity",
    "system"
  ]).notNull(),
  
  severity: mysqlEnum("severity", ["info", "low", "medium", "high", "critical"]).default("medium"),
  priority: int("priority").default(50),
  
  status: mysqlEnum("status", ["unread", "read", "acknowledged", "resolved", "dismissed"]).default("unread"),
  
  // Delivery status
  emailSent: boolean("emailSent").default(false),
  slackSent: boolean("slackSent").default(false),
  inAppShown: boolean("inAppShown").default(false),
  
  // Related data
  sourceUrl: text("sourceUrl"),
  metadata: json("metadata"),
  
  // Timestamps
  triggeredAt: timestamp("triggeredAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// ============================================
// ALERT RULES
// ============================================

export const alertRules = mysqlTable("alertRules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Rule configuration
  ruleType: mysqlEnum("ruleType", [
    "risk_threshold",
    "certification_expiry",
    "financial_change",
    "news_keyword",
    "competitor_switch",
    "custom"
  ]).notNull(),
  
  conditions: json("conditions").notNull(),
  
  // Actions
  notifyEmail: boolean("notifyEmail").default(true),
  notifySlack: boolean("notifySlack").default(false),
  notifyInApp: boolean("notifyInApp").default(true),
  
  // Scope
  appliesTo: mysqlEnum("appliesTo", ["all_suppliers", "specific_suppliers", "supplier_tier"]).default("all_suppliers"),
  supplierIds: json("supplierIds"),
  supplierTiers: json("supplierTiers"),
  
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AlertRule = typeof alertRules.$inferSelect;
export type InsertAlertRule = typeof alertRules.$inferInsert;

// ============================================
// LEADS (Lead Generation)
// ============================================

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  
  // Contact info
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  companySize: varchar("companySize", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  country: varchar("country", { length: 100 }),
  
  // Lead source & tracking
  source: mysqlEnum("source", ["website", "demo_request", "contact_form", "newsletter", "referral", "linkedin", "event", "other"]).default("website"),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  landingPage: text("landingPage"),
  referrerUrl: text("referrerUrl"),
  
  // Lead qualification
  status: mysqlEnum("status", ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"]).default("new"),
  score: int("score").default(0),
  interestedIn: json("interestedIn"),
  budget: varchar("budget", { length: 50 }),
  timeline: varchar("timeline", { length: 50 }),
  
  // Communication
  message: text("message"),
  notes: text("notes"),
  lastContactedAt: timestamp("lastContactedAt"),
  nextFollowUpAt: timestamp("nextFollowUpAt"),
  
  // Assignment
  assignedTo: int("assignedTo"),
  
  // Consent
  marketingConsent: boolean("marketingConsent").default(false),
  privacyAccepted: boolean("privacyAccepted").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================
// LEAD ACTIVITIES
// ============================================

export const leadActivities = mysqlTable("leadActivities", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  userId: int("userId"),
  
  activityType: mysqlEnum("activityType", [
    "email_sent",
    "email_opened",
    "email_clicked",
    "call_made",
    "meeting_scheduled",
    "meeting_completed",
    "demo_requested",
    "demo_completed",
    "proposal_sent",
    "contract_sent",
    "page_visit",
    "form_submission",
    "note_added",
    "status_changed"
  ]).notNull(),
  
  description: text("description"),
  metadata: json("metadata"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;

// ============================================
// VISITOR TRACKING
// ============================================

export const visitors = mysqlTable("visitors", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull().unique(),
  
  // Identification
  leadId: int("leadId"),
  userId: int("userId"),
  
  // Device info
  userAgent: text("userAgent"),
  deviceType: varchar("deviceType", { length: 50 }),
  browser: varchar("browser", { length: 50 }),
  os: varchar("os", { length: 50 }),
  
  // Location
  ipAddress: varchar("ipAddress", { length: 45 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  // Session data
  totalSessions: int("totalSessions").default(1),
  totalPageViews: int("totalPageViews").default(0),
  totalTimeOnSite: int("totalTimeOnSite").default(0),
  
  firstVisitAt: timestamp("firstVisitAt").defaultNow().notNull(),
  lastVisitAt: timestamp("lastVisitAt").defaultNow().notNull(),
  
  // Attribution
  firstUtmSource: varchar("firstUtmSource", { length: 100 }),
  firstUtmMedium: varchar("firstUtmMedium", { length: 100 }),
  firstUtmCampaign: varchar("firstUtmCampaign", { length: 100 }),
  firstReferrer: text("firstReferrer"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Visitor = typeof visitors.$inferSelect;
export type InsertVisitor = typeof visitors.$inferInsert;

// ============================================
// PAGE VIEWS
// ============================================

export const pageViews = mysqlTable("pageViews", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  sessionId: varchar("sessionId", { length: 64 }),
  
  pageUrl: text("pageUrl").notNull(),
  pageTitle: varchar("pageTitle", { length: 255 }),
  referrerUrl: text("referrerUrl"),
  
  timeOnPage: int("timeOnPage"),
  scrollDepth: int("scrollDepth"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = typeof pageViews.$inferInsert;

// ============================================
// COMPETITIVE INTELLIGENCE
// ============================================

export const competitors = mysqlTable("competitors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  website: text("website"),
  description: text("description"),
  industry: varchar("industry", { length: 100 }),
  logoUrl: text("logoUrl"),
  
  // Tracking
  isActive: boolean("isActive").default(true),
  lastCheckedAt: timestamp("lastCheckedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = typeof competitors.$inferInsert;

export const competitorSuppliers = mysqlTable("competitorSuppliers", {
  id: int("id").autoincrement().primaryKey(),
  competitorId: int("competitorId").notNull(),
  supplierId: int("supplierId").notNull(),
  
  relationshipType: mysqlEnum("relationshipType", ["confirmed", "suspected", "former"]).default("suspected"),
  confidence: int("confidence").default(50),
  sourceUrl: text("sourceUrl"),
  notes: text("notes"),
  
  discoveredAt: timestamp("discoveredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompetitorSupplier = typeof competitorSuppliers.$inferSelect;
export type InsertCompetitorSupplier = typeof competitorSuppliers.$inferInsert;

// ============================================
// REPORTS
// ============================================

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  reportType: mysqlEnum("reportType", [
    "weekly_digest",
    "monthly_summary",
    "supplier_assessment",
    "risk_analysis",
    "competitive_intel",
    "custom"
  ]).notNull(),
  
  // Content
  content: json("content"),
  summary: text("summary"),
  
  // Generation
  status: mysqlEnum("status", ["pending", "generating", "completed", "failed"]).default("pending"),
  generatedAt: timestamp("generatedAt"),
  
  // Delivery
  fileUrl: text("fileUrl"),
  format: mysqlEnum("format", ["pdf", "excel", "html"]).default("pdf"),
  
  // Scheduling
  isScheduled: boolean("isScheduled").default(false),
  scheduleFrequency: mysqlEnum("scheduleFrequency", ["daily", "weekly", "monthly", "quarterly"]),
  nextScheduledAt: timestamp("nextScheduledAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// ============================================
// CHAT MESSAGES (AI Chatbot)
// ============================================

export const chatSessions = mysqlTable("chatSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  title: varchar("title", { length: 255 }),
  context: json("context"),
  
  isActive: boolean("isActive").default(true),
  messageCount: int("messageCount").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  
  // For assistant messages
  tokensUsed: int("tokensUsed"),
  modelUsed: varchar("modelUsed", { length: 100 }),
  
  // Related entities
  relatedSupplierIds: json("relatedSupplierIds"),
  relatedAlertIds: json("relatedAlertIds"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// ============================================
// RISK PREDICTIONS (ML Models)
// ============================================

export const riskPredictions = mysqlTable("riskPredictions", {
  id: int("id").autoincrement().primaryKey(),
  supplierId: int("supplierId").notNull(),
  
  predictionType: mysqlEnum("predictionType", [
    "bankruptcy",
    "quality_decline",
    "delivery_delay",
    "price_increase",
    "supply_disruption"
  ]).notNull(),
  
  probability: decimal("probability", { precision: 5, scale: 4 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  timeframe: varchar("timeframe", { length: 50 }),
  
  // Model info
  modelVersion: varchar("modelVersion", { length: 50 }),
  features: json("features"),
  
  // Outcome tracking
  actualOutcome: boolean("actualOutcome"),
  outcomeDate: timestamp("outcomeDate"),
  
  predictedAt: timestamp("predictedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RiskPrediction = typeof riskPredictions.$inferSelect;
export type InsertRiskPrediction = typeof riskPredictions.$inferInsert;

// ============================================
// AUDIT LOG
// ============================================

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: int("entityId"),
  
  oldValues: json("oldValues"),
  newValues: json("newValues"),
  
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ============================================
// INTEGRATIONS
// ============================================

export const integrations = mysqlTable("integrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  integrationType: mysqlEnum("integrationType", [
    "slack",
    "email",
    "erp",
    "crm",
    "webhook"
  ]).notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  config: json("config"),
  
  isActive: boolean("isActive").default(true),
  lastSyncAt: timestamp("lastSyncAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = typeof integrations.$inferInsert;
