import { getDb } from "./db";
import { suppliers, alerts, leads, supplierCertifications, supplierNews, supplierRelationships } from "../drizzle/schema";

const supplierSeedData = [
  {
    name: "TechCorp Industries",
    ticker: "TECH",
    industry: "Electronics",
    country: "United States",
    region: "North America",
    website: "https://techcorp.example.com",
    description: "Leading manufacturer of electronic components and semiconductors",
    annualRevenue: "2500000000",
    employeeCount: 15000,
    foundedYear: 1985,
    publicCompany: true,
    overallRiskScore: 28,
    financialRiskScore: 22,
    qualityRiskScore: 30,
    geopoliticalRiskScore: 25,
    operationalRiskScore: 35,
    status: "active" as const,
    tier: "strategic" as const,
  },
  {
    name: "Global Manufacturing Co.",
    ticker: "GMC",
    industry: "Manufacturing",
    country: "Germany",
    region: "Europe",
    website: "https://globalmanufacturing.example.com",
    description: "Precision manufacturing and industrial automation solutions",
    annualRevenue: "1800000000",
    employeeCount: 12000,
    foundedYear: 1972,
    publicCompany: true,
    overallRiskScore: 45,
    financialRiskScore: 40,
    qualityRiskScore: 35,
    geopoliticalRiskScore: 55,
    operationalRiskScore: 50,
    status: "monitoring" as const,
    tier: "preferred" as const,
  },
  {
    name: "Pacific Components Ltd.",
    ticker: "PCL",
    industry: "Components",
    country: "Japan",
    region: "Asia Pacific",
    website: "https://pacificcomponents.example.com",
    description: "High-quality electronic components and assemblies",
    annualRevenue: "950000000",
    employeeCount: 5500,
    foundedYear: 1990,
    publicCompany: true,
    overallRiskScore: 32,
    financialRiskScore: 28,
    qualityRiskScore: 25,
    geopoliticalRiskScore: 40,
    operationalRiskScore: 35,
    status: "active" as const,
    tier: "strategic" as const,
  },
  {
    name: "Eastern Electronics",
    ticker: null,
    industry: "Electronics",
    country: "China",
    region: "Asia Pacific",
    website: "https://easternelectronics.example.com",
    description: "Consumer electronics and PCB manufacturing",
    annualRevenue: "720000000",
    employeeCount: 8000,
    foundedYear: 2001,
    publicCompany: false,
    overallRiskScore: 68,
    financialRiskScore: 55,
    qualityRiskScore: 72,
    geopoliticalRiskScore: 78,
    operationalRiskScore: 65,
    status: "at_risk" as const,
    tier: "approved" as const,
  },
  {
    name: "Northern Metals Inc.",
    ticker: "NMI",
    industry: "Raw Materials",
    country: "Canada",
    region: "North America",
    website: "https://northernmetals.example.com",
    description: "Specialty metals and alloys supplier",
    annualRevenue: "450000000",
    employeeCount: 2200,
    foundedYear: 1968,
    publicCompany: true,
    overallRiskScore: 35,
    financialRiskScore: 30,
    qualityRiskScore: 32,
    geopoliticalRiskScore: 28,
    operationalRiskScore: 50,
    status: "active" as const,
    tier: "preferred" as const,
  },
  {
    name: "Southern Logistics",
    ticker: null,
    industry: "Logistics",
    country: "Mexico",
    region: "North America",
    website: "https://southernlogistics.example.com",
    description: "Supply chain and logistics solutions provider",
    annualRevenue: "280000000",
    employeeCount: 3500,
    foundedYear: 2005,
    publicCompany: false,
    overallRiskScore: 55,
    financialRiskScore: 60,
    qualityRiskScore: 45,
    geopoliticalRiskScore: 52,
    operationalRiskScore: 62,
    status: "monitoring" as const,
    tier: "approved" as const,
  },
  {
    name: "European Precision GmbH",
    ticker: "EPG",
    industry: "Manufacturing",
    country: "Germany",
    region: "Europe",
    website: "https://europeanprecision.example.com",
    description: "High-precision machining and tooling",
    annualRevenue: "620000000",
    employeeCount: 4000,
    foundedYear: 1955,
    publicCompany: true,
    overallRiskScore: 22,
    financialRiskScore: 18,
    qualityRiskScore: 15,
    geopoliticalRiskScore: 30,
    operationalRiskScore: 25,
    status: "active" as const,
    tier: "strategic" as const,
  },
  {
    name: "Asian Semiconductors",
    ticker: "ASEM",
    industry: "Semiconductors",
    country: "Taiwan",
    region: "Asia Pacific",
    website: "https://asiansemiconductors.example.com",
    description: "Advanced semiconductor manufacturing",
    annualRevenue: "3200000000",
    employeeCount: 25000,
    foundedYear: 1988,
    publicCompany: true,
    overallRiskScore: 78,
    financialRiskScore: 35,
    qualityRiskScore: 28,
    geopoliticalRiskScore: 95,
    operationalRiskScore: 55,
    status: "critical" as const,
    tier: "strategic" as const,
  },
];

const alertSeedData = [
  {
    title: "Critical Risk Alert: Asian Semiconductors",
    message: "Geopolitical risk score has increased to 95 due to regional tensions. Immediate review recommended.",
    alertType: "geopolitical" as const,
    severity: "critical" as const,
    priority: 95,
    status: "unread" as const,
  },
  {
    title: "Certification Expiring: Global Manufacturing Co.",
    message: "IATF 16949 certification expires in 38 days. Renewal process should be initiated.",
    alertType: "certification_expiry" as const,
    severity: "high" as const,
    priority: 80,
    status: "unread" as const,
  },
  {
    title: "Quality Issue Detected: Eastern Electronics",
    message: "Defect rate increased by 15% in last shipment. Quality audit recommended.",
    alertType: "quality_issue" as const,
    severity: "high" as const,
    priority: 75,
    status: "unread" as const,
  },
  {
    title: "Financial Health Warning: Southern Logistics",
    message: "Q4 financial reports show declining profit margins. Monitor closely.",
    alertType: "financial_risk" as const,
    severity: "medium" as const,
    priority: 60,
    status: "read" as const,
  },
  {
    title: "Competitor Activity: Acme Corp switched supplier",
    message: "Acme Corporation has switched from Eastern Electronics to Pacific Components.",
    alertType: "competitor_activity" as const,
    severity: "info" as const,
    priority: 40,
    status: "read" as const,
  },
];

const leadSeedData = [
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@acmecorp.com",
    company: "Acme Corporation",
    jobTitle: "VP of Procurement",
    companySize: "1000-5000",
    source: "demo_request" as const,
    status: "qualified" as const,
    score: 85,
    message: "Interested in enterprise plan for our supply chain team",
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "s.johnson@globaltechind.com",
    company: "GlobalTech Industries",
    jobTitle: "Supply Chain Director",
    companySize: "500-1000",
    source: "website" as const,
    status: "contacted" as const,
    score: 72,
    message: "Looking for real-time supplier monitoring solution",
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@nexussystems.io",
    company: "Nexus Systems",
    jobTitle: "Chief Operations Officer",
    companySize: "5000+",
    source: "referral" as const,
    status: "new" as const,
    score: 90,
    message: "Referred by existing customer. Need comprehensive supplier intelligence.",
  },
];

export async function seedDatabase(userId: number) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding database...");

  // Insert suppliers
  const supplierIds: number[] = [];
  for (const supplier of supplierSeedData) {
    const result = await db.insert(suppliers).values({
      ...supplier,
      userId,
    });
    supplierIds.push(result[0].insertId);
  }
  console.log(`Inserted ${supplierIds.length} suppliers`);

  // Insert alerts
  for (let i = 0; i < alertSeedData.length; i++) {
    await db.insert(alerts).values({
      ...alertSeedData[i],
      userId,
      supplierId: supplierIds[i % supplierIds.length],
    });
  }
  console.log(`Inserted ${alertSeedData.length} alerts`);

  // Insert leads
  for (const lead of leadSeedData) {
    await db.insert(leads).values(lead);
  }
  console.log(`Inserted ${leadSeedData.length} leads`);

  // Insert some supplier relationships
  const relationships = [
    { sourceSupplierId: supplierIds[0], targetSupplierId: supplierIds[3], relationshipType: "vendor" as const, strength: 80 },
    { sourceSupplierId: supplierIds[0], targetSupplierId: supplierIds[4], relationshipType: "vendor" as const, strength: 60 },
    { sourceSupplierId: supplierIds[1], targetSupplierId: supplierIds[3], relationshipType: "vendor" as const, strength: 70 },
    { sourceSupplierId: supplierIds[6], targetSupplierId: supplierIds[7], relationshipType: "partner" as const, strength: 85 },
    { sourceSupplierId: supplierIds[2], targetSupplierId: supplierIds[7], relationshipType: "competitor" as const, strength: 40 },
  ];

  for (const rel of relationships) {
    await db.insert(supplierRelationships).values(rel);
  }
  console.log(`Inserted ${relationships.length} supplier relationships`);

  // Insert certifications
  const certifications = [
    { supplierId: supplierIds[0], certificationName: "ISO 9001:2015", certificationBody: "TÜV", certificationType: "quality" as const, status: "valid" as const },
    { supplierId: supplierIds[0], certificationName: "ISO 14001:2015", certificationBody: "TÜV", certificationType: "environmental" as const, status: "valid" as const },
    { supplierId: supplierIds[1], certificationName: "IATF 16949", certificationBody: "DQS", certificationType: "quality" as const, status: "expiring_soon" as const },
    { supplierId: supplierIds[2], certificationName: "ISO 9001:2015", certificationBody: "JQA", certificationType: "quality" as const, status: "valid" as const },
    { supplierId: supplierIds[6], certificationName: "AS9100D", certificationBody: "TÜV", certificationType: "industry" as const, status: "valid" as const },
  ];

  for (const cert of certifications) {
    await db.insert(supplierCertifications).values(cert);
  }
  console.log(`Inserted ${certifications.length} certifications`);

  // Insert news
  const newsItems = [
    { supplierId: supplierIds[7], title: "Asian Semiconductors announces $2B expansion", summary: "Major capacity expansion planned for next year", sentiment: "positive" as const, category: "financial" as const },
    { supplierId: supplierIds[3], title: "Eastern Electronics faces quality audit", summary: "Regulatory body initiates quality review", sentiment: "negative" as const, category: "operational" as const },
    { supplierId: supplierIds[0], title: "TechCorp Industries wins innovation award", summary: "Recognized for sustainable manufacturing practices", sentiment: "positive" as const, category: "other" as const },
  ];

  for (const news of newsItems) {
    await db.insert(supplierNews).values(news);
  }
  console.log(`Inserted ${newsItems.length} news items`);

  console.log("Database seeding complete!");
}
