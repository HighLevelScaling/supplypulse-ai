import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Network,
  RefreshCw,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for dashboard
const overviewStats = [
  {
    title: "Total Suppliers",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Building2,
    color: "cyber",
  },
  {
    title: "Active Alerts",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: Bell,
    color: "quantum",
  },
  {
    title: "Risk Score",
    value: "72",
    change: "+3%",
    trend: "up",
    icon: Shield,
    color: "plasma",
  },
  {
    title: "Predictions",
    value: "156",
    change: "+24%",
    trend: "up",
    icon: Brain,
    color: "cyber",
  },
];

const riskTrendData = [
  { month: "Jan", financial: 65, quality: 72, geopolitical: 45 },
  { month: "Feb", financial: 68, quality: 70, geopolitical: 48 },
  { month: "Mar", financial: 62, quality: 75, geopolitical: 52 },
  { month: "Apr", financial: 70, quality: 68, geopolitical: 55 },
  { month: "May", financial: 75, quality: 72, geopolitical: 50 },
  { month: "Jun", financial: 72, quality: 78, geopolitical: 48 },
];

const supplierDistribution = [
  { name: "Strategic", value: 45, color: "oklch(0.75 0.15 195)" },
  { name: "Preferred", value: 120, color: "oklch(0.55 0.25 290)" },
  { name: "Approved", value: 280, color: "oklch(0.80 0.16 85)" },
  { name: "Conditional", value: 55, color: "oklch(0.65 0.20 25)" },
];

const alertsData = [
  { day: "Mon", alerts: 12 },
  { day: "Tue", alerts: 8 },
  { day: "Wed", alerts: 15 },
  { day: "Thu", alerts: 6 },
  { day: "Fri", alerts: 10 },
  { day: "Sat", alerts: 4 },
  { day: "Sun", alerts: 3 },
];

const recentAlerts = [
  {
    id: 1,
    title: "Financial Risk Increase",
    supplier: "TechCorp Industries",
    severity: "high",
    time: "2 hours ago",
    type: "financial_risk",
  },
  {
    id: 2,
    title: "Certification Expiring",
    supplier: "Global Manufacturing Co.",
    severity: "medium",
    time: "4 hours ago",
    type: "certification_expiry",
  },
  {
    id: 3,
    title: "News Alert: Merger Announced",
    supplier: "Pacific Components Ltd.",
    severity: "info",
    time: "6 hours ago",
    type: "news_alert",
  },
  {
    id: 4,
    title: "Quality Score Declined",
    supplier: "Eastern Electronics",
    severity: "high",
    time: "8 hours ago",
    type: "quality_issue",
  },
];

const topSuppliers = [
  { name: "TechCorp Industries", score: 92, trend: "up", change: 3 },
  { name: "Global Manufacturing", score: 88, trend: "down", change: -2 },
  { name: "Pacific Components", score: 85, trend: "up", change: 5 },
  { name: "Eastern Electronics", score: 82, trend: "stable", change: 0 },
  { name: "Northern Metals", score: 79, trend: "up", change: 1 },
];

const predictionsData = [
  {
    supplier: "TechCorp Industries",
    prediction: "Supply Disruption",
    probability: 23,
    timeframe: "Next 3 months",
    confidence: 87,
  },
  {
    supplier: "Global Manufacturing",
    prediction: "Price Increase",
    probability: 67,
    timeframe: "Next 6 months",
    confidence: 92,
  },
  {
    supplier: "Pacific Components",
    prediction: "Quality Decline",
    probability: 15,
    timeframe: "Next 3 months",
    confidence: 78,
  },
];

function StatCard({ stat, index }: { stat: typeof overviewStats[0]; index: number }) {
  const colorClasses = {
    cyber: "text-cyber bg-cyber/10 border-cyber/30",
    quantum: "text-quantum bg-quantum/10 border-quantum/30",
    plasma: "text-plasma bg-plasma/10 border-plasma/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="glass-card border-border/50 hover:border-cyber/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {stat.trend === "up" ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground text-sm">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
}

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <StatCard key={stat.title} stat={stat} index={index} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Risk Score Trends</CardTitle>
                    <CardDescription>Financial, Quality, and Geopolitical risk over time</CardDescription>
                  </div>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={riskTrendData}>
                      <defs>
                        <linearGradient id="colorFinancial" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.55 0.25 290)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.55 0.25 290)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGeopolitical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.80 0.16 85)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.80 0.16 85)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                      <XAxis dataKey="month" stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <YAxis stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.14 0.025 280)",
                          border: "1px solid oklch(0.30 0.04 280)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="financial"
                        stroke="oklch(0.75 0.15 195)"
                        fillOpacity={1}
                        fill="url(#colorFinancial)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="quality"
                        stroke="oklch(0.55 0.25 290)"
                        fillOpacity={1}
                        fill="url(#colorQuality)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="geopolitical"
                        stroke="oklch(0.80 0.16 85)"
                        fillOpacity={1}
                        fill="url(#colorGeopolitical)"
                        strokeWidth={2}
                      />
                    </AreaChart>
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

          {/* Supplier Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Supplier Tiers</CardTitle>
                <CardDescription>Distribution by classification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={supplierDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {supplierDistribution.map((entry, index) => (
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {supplierDistribution.map((item) => (
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

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Alerts</CardTitle>
                    <CardDescription>Latest supplier notifications</CardDescription>
                  </div>
                  <Link href="/alerts">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{alert.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{alert.supplier}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Suppliers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Top Suppliers</CardTitle>
                    <CardDescription>By overall risk score</CardDescription>
                  </div>
                  <Link href="/suppliers">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSuppliers.map((supplier, index) => (
                    <div key={supplier.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{supplier.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={supplier.score} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium w-8">{supplier.score}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {supplier.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : supplier.trend === "down" ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <Activity className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span
                          className={`text-xs ${
                            supplier.change > 0
                              ? "text-green-500"
                              : supplier.change < 0
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {supplier.change > 0 ? "+" : ""}
                          {supplier.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Predictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-cyber" />
                      AI Predictions
                    </CardTitle>
                    <CardDescription>Upcoming risk forecasts</CardDescription>
                  </div>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictionsData.map((prediction, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{prediction.supplier}</p>
                        <Badge
                          variant="outline"
                          className={
                            prediction.probability > 50
                              ? "border-red-500/30 text-red-400"
                              : prediction.probability > 25
                              ? "border-yellow-500/30 text-yellow-400"
                              : "border-green-500/30 text-green-400"
                          }
                        >
                          {prediction.probability}% likely
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{prediction.prediction}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {prediction.timeframe}
                        </span>
                        <span>{prediction.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Alerts Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Alert Activity</CardTitle>
                  <CardDescription>Alerts triggered over the past week</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={alertsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                    <XAxis dataKey="day" stroke="oklch(0.65 0.02 280)" fontSize={12} />
                    <YAxis stroke="oklch(0.65 0.02 280)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.14 0.025 280)",
                        border: "1px solid oklch(0.30 0.04 280)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="alerts" fill="oklch(0.75 0.15 195)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/suppliers">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-cyber/50">
                    <Building2 className="w-6 h-6 text-cyber" />
                    <span>Add Supplier</span>
                  </Button>
                </Link>
                <Link href="/reports">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-plasma/50">
                    <FileText className="w-6 h-6 text-plasma" />
                    <span>Generate Report</span>
                  </Button>
                </Link>
                <Link href="/network">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-quantum/50">
                    <Network className="w-6 h-6 text-quantum" />
                    <span>View Network</span>
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 hover:border-cyber/50">
                    <Brain className="w-6 h-6 text-cyber" />
                    <span>Ask AI</span>
                  </Button>
                </Link>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-cyber/10 to-plasma/10 border border-cyber/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyber/20">
                      <RefreshCw className="w-5 h-5 text-cyber" />
                    </div>
                    <div>
                      <p className="font-medium">SEC EDGAR Integration</p>
                      <p className="text-sm text-muted-foreground">Sync real-time financial data for all suppliers</p>
                    </div>
                  </div>
                  <Link href="/suppliers">
                    <Button className="bg-gradient-cyber hover:opacity-90">
                      Sync All Suppliers
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
