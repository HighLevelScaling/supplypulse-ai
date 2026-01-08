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
  ArrowDown,
  ArrowUp,
  BarChart3,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Globe,
  LineChart,
  PieChart,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

// Mock analytics data
const portfolioHealthData = [
  { name: "Jan", score: 72 },
  { name: "Feb", score: 74 },
  { name: "Mar", score: 71 },
  { name: "Apr", score: 76 },
  { name: "May", score: 78 },
  { name: "Jun", score: 75 },
  { name: "Jul", score: 79 },
  { name: "Aug", score: 82 },
  { name: "Sep", score: 80 },
  { name: "Oct", score: 83 },
  { name: "Nov", score: 81 },
  { name: "Dec", score: 85 },
];

const riskDistributionData = [
  { name: "Low Risk", value: 145, color: "oklch(0.75 0.18 150)" },
  { name: "Medium Risk", value: 89, color: "oklch(0.80 0.16 85)" },
  { name: "High Risk", value: 42, color: "oklch(0.65 0.20 25)" },
  { name: "Critical", value: 12, color: "oklch(0.60 0.25 25)" },
];

const industryRiskData = [
  { industry: "Electronics", financial: 35, quality: 42, geopolitical: 28 },
  { industry: "Manufacturing", financial: 45, quality: 38, geopolitical: 52 },
  { industry: "Logistics", financial: 28, quality: 55, geopolitical: 35 },
  { industry: "Raw Materials", financial: 52, quality: 32, geopolitical: 48 },
  { industry: "Components", financial: 38, quality: 45, geopolitical: 42 },
];

const predictionsData = [
  {
    id: 1,
    supplier: "TechCorp Industries",
    prediction: "Supply Chain Disruption",
    probability: 23,
    impact: "medium",
    timeframe: "Q2 2024",
    confidence: 87,
    factors: ["Labor disputes", "Raw material shortage"],
  },
  {
    id: 2,
    supplier: "Asian Semiconductors",
    prediction: "Geopolitical Impact",
    probability: 78,
    impact: "critical",
    timeframe: "Q1 2024",
    confidence: 92,
    factors: ["Trade regulations", "Regional tensions"],
  },
  {
    id: 3,
    supplier: "Global Manufacturing",
    prediction: "Price Increase",
    probability: 67,
    impact: "high",
    timeframe: "Q2 2024",
    confidence: 85,
    factors: ["Inflation", "Energy costs"],
  },
  {
    id: 4,
    supplier: "Eastern Electronics",
    prediction: "Quality Decline",
    probability: 45,
    impact: "medium",
    timeframe: "Q3 2024",
    confidence: 78,
    factors: ["Workforce changes", "Equipment aging"],
  },
  {
    id: 5,
    supplier: "Northern Metals",
    prediction: "Capacity Constraints",
    probability: 34,
    impact: "low",
    timeframe: "Q4 2024",
    confidence: 72,
    factors: ["Demand surge", "Expansion delays"],
  },
];

const scenarioData = [
  { scenario: "Base Case", impact: 0, probability: 60 },
  { scenario: "Optimistic", impact: 15, probability: 20 },
  { scenario: "Moderate Disruption", impact: -12, probability: 15 },
  { scenario: "Severe Disruption", impact: -35, probability: 5 },
];

const supplierScatterData = [
  { x: 25, y: 85, z: 150, name: "TechCorp" },
  { x: 45, y: 72, z: 120, name: "Global Mfg" },
  { x: 32, y: 78, z: 90, name: "Pacific" },
  { x: 68, y: 55, z: 80, name: "Eastern" },
  { x: 22, y: 88, z: 200, name: "European" },
  { x: 78, y: 42, z: 60, name: "Asian Semi" },
  { x: 35, y: 79, z: 110, name: "Northern" },
  { x: 55, y: 65, z: 70, name: "Southern" },
];

const aiInsights = [
  {
    id: 1,
    title: "Emerging Risk Pattern Detected",
    description: "AI has identified a correlation between recent semiconductor shortages and 3 of your tier-1 suppliers. Consider diversification.",
    priority: "high",
    actionable: true,
  },
  {
    id: 2,
    title: "Cost Optimization Opportunity",
    description: "Based on market analysis, renegotiating contracts with 5 suppliers could yield 12% cost savings.",
    priority: "medium",
    actionable: true,
  },
  {
    id: 3,
    title: "Compliance Alert",
    description: "New ESG regulations in Q2 2024 will affect 8 suppliers. Proactive assessment recommended.",
    priority: "high",
    actionable: true,
  },
];

function getImpactColor(impact: string) {
  switch (impact) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-green-500/20 text-green-400 border-green-500/30";
  }
}

export default function Analytics() {
  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              AI-powered analytics and predictive insights for your supply chain
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Portfolio Health</p>
                    <p className="text-3xl font-bold text-green-400">85%</p>
                    <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +4% from last month
                    </p>
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
                    <p className="text-sm text-muted-foreground">AI Predictions</p>
                    <p className="text-3xl font-bold text-cyber">156</p>
                    <p className="text-xs text-muted-foreground mt-1">Active forecasts</p>
                  </div>
                  <Brain className="w-10 h-10 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Alerts</p>
                    <p className="text-3xl font-bold text-quantum">23</p>
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <ArrowUp className="w-3 h-3" /> 5 critical
                    </p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-quantum" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Model Accuracy</p>
                    <p className="text-3xl font-bold text-plasma">94%</p>
                    <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
                  </div>
                  <Target className="w-10 h-10 text-plasma" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Health Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Health Trend</CardTitle>
                <CardDescription>12-month supplier portfolio health score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioHealthData}>
                      <defs>
                        <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                      <XAxis dataKey="name" stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <YAxis stroke="oklch(0.65 0.02 280)" fontSize={12} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.14 0.025 280)",
                          border: "1px solid oklch(0.30 0.04 280)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="oklch(0.75 0.15 195)"
                        fillOpacity={1}
                        fill="url(#healthGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Risk Distribution</CardTitle>
                <CardDescription>Suppliers by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.14 0.025 280)",
                          border: "1px solid oklch(0.30 0.04 280)",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {riskDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyber" />
                    AI Predictions
                  </CardTitle>
                  <CardDescription>Machine learning-powered risk forecasts</CardDescription>
                </div>
                <Badge variant="outline" className="bg-cyber/20 text-cyber border-cyber/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictionsData.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{prediction.supplier}</h4>
                          <Badge variant="outline" className={getImpactColor(prediction.impact)}>
                            {prediction.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{prediction.prediction}</p>
                        <div className="flex flex-wrap gap-2">
                          {prediction.factors.map((factor, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-cyber">{prediction.probability}%</div>
                        <p className="text-xs text-muted-foreground">probability</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {prediction.timeframe}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {prediction.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Probability</span>
                        <span>{prediction.probability}%</span>
                      </div>
                      <Progress value={prediction.probability} className="h-1.5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Industry Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Industry Risk Analysis</CardTitle>
              <CardDescription>Risk scores by industry and category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryRiskData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                    <XAxis type="number" stroke="oklch(0.65 0.02 280)" fontSize={12} domain={[0, 100]} />
                    <YAxis type="category" dataKey="industry" stroke="oklch(0.65 0.02 280)" fontSize={12} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0.025 280)",
                        border: "1px solid oklch(0.30 0.04 280)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="financial" fill="oklch(0.75 0.15 195)" name="Financial" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="quality" fill="oklch(0.55 0.25 290)" name="Quality" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="geopolitical" fill="oklch(0.80 0.16 85)" name="Geopolitical" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyber" />
                  <span className="text-sm text-muted-foreground">Financial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-plasma" />
                  <span className="text-sm text-muted-foreground">Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-quantum" />
                  <span className="text-sm text-muted-foreground">Geopolitical</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-quantum" />
                AI Insights
              </CardTitle>
              <CardDescription>Actionable recommendations from AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={
                          insight.priority === "high"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {insight.priority}
                      </Badge>
                      {insight.actionable && (
                        <Zap className="w-4 h-4 text-cyber" />
                      )}
                    </div>
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <Button variant="ghost" size="sm" className="mt-3 w-full">
                      Take Action
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
