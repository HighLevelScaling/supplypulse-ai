import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Building2,
  Calendar,
  ChevronRight,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useParams } from "wouter";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock supplier detail data
const supplierData = {
  id: 1,
  name: "TechCorp Industries",
  ticker: "TECH",
  industry: "Electronics",
  country: "United States",
  region: "North America",
  website: "https://techcorp.example.com",
  description: "TechCorp Industries is a leading manufacturer of electronic components and systems, serving customers worldwide in automotive, aerospace, and consumer electronics sectors.",
  logoUrl: null,
  annualRevenue: 2500000000,
  employeeCount: 15000,
  foundedYear: 1985,
  publicCompany: true,
  status: "active",
  tier: "strategic",
  overallRiskScore: 28,
  financialRiskScore: 22,
  qualityRiskScore: 35,
  geopoliticalRiskScore: 25,
  operationalRiskScore: 30,
  lastAssessmentDate: "2024-01-15",
  nextReviewDate: "2024-04-15",
  contacts: [
    { name: "John Smith", title: "VP of Sales", email: "john.smith@techcorp.com", phone: "+1 555-0123", isPrimary: true },
    { name: "Sarah Johnson", title: "Account Manager", email: "sarah.j@techcorp.com", phone: "+1 555-0124", isPrimary: false },
  ],
  certifications: [
    { name: "ISO 9001:2015", status: "valid", expiryDate: "2025-06-30" },
    { name: "ISO 14001:2015", status: "valid", expiryDate: "2025-03-15" },
    { name: "IATF 16949", status: "expiring_soon", expiryDate: "2024-02-28" },
  ],
  recentNews: [
    { title: "TechCorp Announces Q4 Earnings Beat", date: "2024-01-20", sentiment: "positive" },
    { title: "New Manufacturing Facility in Texas", date: "2024-01-15", sentiment: "positive" },
    { title: "Supply Chain Optimization Initiative", date: "2024-01-10", sentiment: "neutral" },
  ],
};

const riskHistoryData = [
  { month: "Aug", overall: 35, financial: 30, quality: 40, geopolitical: 32 },
  { month: "Sep", overall: 32, financial: 28, quality: 38, geopolitical: 30 },
  { month: "Oct", overall: 30, financial: 25, quality: 36, geopolitical: 28 },
  { month: "Nov", overall: 28, financial: 22, quality: 35, geopolitical: 26 },
  { month: "Dec", overall: 29, financial: 24, quality: 34, geopolitical: 27 },
  { month: "Jan", overall: 28, financial: 22, quality: 35, geopolitical: 25 },
];

const financialData = [
  { year: "2020", revenue: 1800, profit: 180 },
  { year: "2021", revenue: 2100, profit: 220 },
  { year: "2022", revenue: 2300, profit: 250 },
  { year: "2023", revenue: 2500, profit: 280 },
];

function RiskGauge({ label, value, color }: { label: string; value: number; color: string }) {
  const getRiskLevel = (v: number) => {
    if (v < 30) return "Low";
    if (v < 50) return "Medium";
    if (v < 70) return "High";
    return "Critical";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{getRiskLevel(value)}</span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${100 - value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Score: {value}</span>
        <span>{100 - value}% healthy</span>
      </div>
    </div>
  );
}

export default function SupplierDetail() {
  const params = useParams();
  const supplierId = params.id;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back button and header */}
        <div className="flex items-center gap-4">
          <Link href="/suppliers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-cyber flex items-center justify-center glow-cyber">
                <span className="text-xl font-bold text-primary-foreground">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{supplierData.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{supplierData.ticker}</span>
                  <span>•</span>
                  <span>{supplierData.industry}</span>
                  <span>•</span>
                  <Globe className="w-4 h-4" />
                  <span>{supplierData.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              {supplierData.status}
            </Badge>
            <Badge variant="outline" className="bg-cyber/20 text-cyber border-cyber/30">
              {supplierData.tier}
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Risk</p>
                    <p className="text-3xl font-bold text-green-400">{supplierData.overallRiskScore}</p>
                    <p className="text-xs text-muted-foreground">Low Risk</p>
                  </div>
                  <Shield className="w-10 h-10 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Revenue</p>
                    <p className="text-3xl font-bold">${(supplierData.annualRevenue / 1e9).toFixed(1)}B</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +8.7% YoY
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-quantum" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="text-3xl font-bold">{(supplierData.employeeCount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Global workforce</p>
                  </div>
                  <Users className="w-10 h-10 text-plasma" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Review</p>
                    <p className="text-xl font-bold">Apr 15, 2024</p>
                    <p className="text-xs text-muted-foreground">90 days remaining</p>
                  </div>
                  <Calendar className="w-10 h-10 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Info */}
              <Card className="glass-card border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{supplierData.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Founded</p>
                      <p className="font-medium">{supplierData.foundedYear}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">{supplierData.publicCompany ? "Public Company" : "Private Company"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Region</p>
                      <p className="font-medium">{supplierData.region}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a href={supplierData.website} className="font-medium text-cyber hover:underline flex items-center gap-1">
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Summary */}
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle>Risk Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RiskGauge label="Financial Risk" value={supplierData.financialRiskScore} color="oklch(0.75 0.15 195)" />
                  <RiskGauge label="Quality Risk" value={supplierData.qualityRiskScore} color="oklch(0.55 0.25 290)" />
                  <RiskGauge label="Geopolitical Risk" value={supplierData.geopoliticalRiskScore} color="oklch(0.80 0.16 85)" />
                  <RiskGauge label="Operational Risk" value={supplierData.operationalRiskScore} color="oklch(0.70 0.18 150)" />
                </CardContent>
              </Card>
            </div>

            {/* Risk Trend Chart */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Risk Score Trend</CardTitle>
                <CardDescription>6-month risk score history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                      <XAxis dataKey="month" stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <YAxis stroke="oklch(0.65 0.02 280)" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.14 0.025 280)",
                          border: "1px solid oklch(0.30 0.04 280)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="overall" stroke="oklch(0.75 0.15 195)" strokeWidth={2} dot={{ fill: "oklch(0.75 0.15 195)" }} />
                      <Line type="monotone" dataKey="financial" stroke="oklch(0.55 0.25 290)" strokeWidth={2} dot={{ fill: "oklch(0.55 0.25 290)" }} />
                      <Line type="monotone" dataKey="quality" stroke="oklch(0.80 0.16 85)" strokeWidth={2} dot={{ fill: "oklch(0.80 0.16 85)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Detailed Risk Analysis</CardTitle>
                <CardDescription>AI-powered risk assessment across multiple dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed risk analysis content would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
                <CardDescription>Revenue and profit trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                      <XAxis dataKey="year" stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <YAxis stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.14 0.025 280)",
                          border: "1px solid oklch(0.30 0.04 280)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="oklch(0.75 0.15 195)" radius={[4, 4, 0, 0]} name="Revenue ($M)" />
                      <Bar dataKey="profit" fill="oklch(0.55 0.25 290)" radius={[4, 4, 0, 0]} name="Profit ($M)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Quality and compliance certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyber" />
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">Expires: {cert.expiryDate}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          cert.status === "valid"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {cert.status === "valid" ? "Valid" : "Expiring Soon"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Key Contacts</CardTitle>
                <CardDescription>Primary contacts at this supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplierData.contacts.map((contact, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">{contact.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{contact.name}</p>
                            {contact.isPrimary && (
                              <Badge variant="outline" className="text-xs">Primary</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.title}</p>
                          <div className="mt-2 space-y-1">
                            <a href={`mailto:${contact.email}`} className="text-sm text-cyber hover:underline flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {contact.email}
                            </a>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {contact.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle>Recent News</CardTitle>
                <CardDescription>Latest news and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierData.recentNews.map((news, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div
                        className={`p-2 rounded-lg ${
                          news.sentiment === "positive"
                            ? "bg-green-500/20 text-green-400"
                            : news.sentiment === "negative"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{news.title}</p>
                        <p className="text-sm text-muted-foreground">{news.date}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          news.sentiment === "positive"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : news.sentiment === "negative"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }
                      >
                        {news.sentiment}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
