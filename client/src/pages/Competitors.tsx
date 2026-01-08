import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Building2,
  ChevronRight,
  Eye,
  Globe,
  LineChart,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock competitor data
const competitorsData = [
  {
    id: 1,
    name: "Acme Corporation",
    industry: "Manufacturing",
    marketShare: 18,
    supplierOverlap: 45,
    recentChanges: 3,
    trend: "up",
    riskProfile: "aggressive",
  },
  {
    id: 2,
    name: "GlobalTech Inc.",
    industry: "Electronics",
    marketShare: 15,
    supplierOverlap: 62,
    recentChanges: 7,
    trend: "up",
    riskProfile: "moderate",
  },
  {
    id: 3,
    name: "Nexus Industries",
    industry: "Components",
    marketShare: 12,
    supplierOverlap: 38,
    recentChanges: 2,
    trend: "stable",
    riskProfile: "conservative",
  },
  {
    id: 4,
    name: "Pinnacle Systems",
    industry: "Technology",
    marketShare: 10,
    supplierOverlap: 55,
    recentChanges: 5,
    trend: "down",
    riskProfile: "aggressive",
  },
  {
    id: 5,
    name: "Vertex Solutions",
    industry: "Manufacturing",
    marketShare: 8,
    supplierOverlap: 28,
    recentChanges: 1,
    trend: "up",
    riskProfile: "moderate",
  },
];

const supplierSwitchesData = [
  {
    id: 1,
    competitor: "GlobalTech Inc.",
    action: "switched_from",
    supplier: "Eastern Electronics",
    newSupplier: "Pacific Components",
    date: "2024-01-18",
    impact: "high",
    reason: "Quality concerns",
  },
  {
    id: 2,
    competitor: "Acme Corporation",
    action: "added",
    supplier: "Northern Metals Inc.",
    newSupplier: null,
    date: "2024-01-15",
    impact: "medium",
    reason: "Capacity expansion",
  },
  {
    id: 3,
    competitor: "Pinnacle Systems",
    action: "dropped",
    supplier: "Southern Logistics",
    newSupplier: null,
    date: "2024-01-12",
    impact: "low",
    reason: "Cost optimization",
  },
  {
    id: 4,
    competitor: "Nexus Industries",
    action: "switched_from",
    supplier: "TechCorp Industries",
    newSupplier: "European Precision",
    date: "2024-01-10",
    impact: "high",
    reason: "Strategic partnership",
  },
];

const marketTrendData = [
  { month: "Aug", you: 22, competitor1: 18, competitor2: 15 },
  { month: "Sep", you: 23, competitor1: 18, competitor2: 16 },
  { month: "Oct", you: 24, competitor1: 19, competitor2: 15 },
  { month: "Nov", you: 25, competitor1: 18, competitor2: 16 },
  { month: "Dec", you: 26, competitor1: 19, competitor2: 17 },
  { month: "Jan", you: 27, competitor1: 18, competitor2: 15 },
];

const supplierComparisonData = [
  { category: "Electronics", you: 12, competitors: 8 },
  { category: "Manufacturing", you: 8, competitors: 15 },
  { category: "Logistics", you: 6, competitors: 4 },
  { category: "Raw Materials", you: 10, competitors: 12 },
  { category: "Components", you: 14, competitors: 11 },
];

function getActionBadge(action: string) {
  switch (action) {
    case "switched_from":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "added":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "dropped":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
  }
}

function getImpactBadge(impact: string) {
  switch (impact) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-green-500/20 text-green-400 border-green-500/30";
  }
}

export default function Competitors() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompetitors = competitorsData.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Competitive Intelligence">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Monitor competitor supplier strategies and market movements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-gradient-cyber hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Competitor
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracked Competitors</p>
                    <p className="text-2xl font-bold">{competitorsData.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Supplier Switches</p>
                    <p className="text-2xl font-bold text-quantum">{supplierSwitchesData.length}</p>
                  </div>
                  <ArrowRight className="w-8 h-8 text-quantum" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Overlap</p>
                    <p className="text-2xl font-bold text-plasma">
                      {Math.round(competitorsData.reduce((a, c) => a + c.supplierOverlap, 0) / competitorsData.length)}%
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-plasma" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Market Share</p>
                    <p className="text-2xl font-bold text-green-400">27%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Share Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Market Share Trend</CardTitle>
                <CardDescription>Your position vs top competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketTrendData}>
                      <defs>
                        <linearGradient id="colorYou" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
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
                        dataKey="you"
                        stroke="oklch(0.75 0.15 195)"
                        fillOpacity={1}
                        fill="url(#colorYou)"
                        strokeWidth={2}
                        name="Your Company"
                      />
                      <Area
                        type="monotone"
                        dataKey="competitor1"
                        stroke="oklch(0.55 0.25 290)"
                        fillOpacity={0}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Acme Corp"
                      />
                      <Area
                        type="monotone"
                        dataKey="competitor2"
                        stroke="oklch(0.80 0.16 85)"
                        fillOpacity={0}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="GlobalTech"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Supplier Category Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Supplier Category Comparison</CardTitle>
                <CardDescription>Your suppliers vs competitor average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.04 280)" />
                      <XAxis type="number" stroke="oklch(0.65 0.02 280)" fontSize={12} />
                      <YAxis type="category" dataKey="category" stroke="oklch(0.65 0.02 280)" fontSize={12} width={90} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.14 0.025 280)",
                          border: "1px solid oklch(0.30 0.04 280)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="you" fill="oklch(0.75 0.15 195)" name="Your Company" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="competitors" fill="oklch(0.55 0.25 290)" name="Competitors Avg" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Competitors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Tracked Competitors</CardTitle>
                  <CardDescription>Monitor competitor supplier strategies</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search competitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Competitor</TableHead>
                    <TableHead className="text-muted-foreground">Industry</TableHead>
                    <TableHead className="text-muted-foreground">Market Share</TableHead>
                    <TableHead className="text-muted-foreground">Supplier Overlap</TableHead>
                    <TableHead className="text-muted-foreground">Recent Changes</TableHead>
                    <TableHead className="text-muted-foreground">Trend</TableHead>
                    <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompetitors.map((competitor) => (
                    <TableRow key={competitor.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-plasma flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-foreground">
                              {competitor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{competitor.name}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {competitor.riskProfile}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{competitor.industry}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.marketShare} className="h-2 w-16" />
                          <span className="text-sm font-medium">{competitor.marketShare}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.supplierOverlap} className="h-2 w-16" />
                          <span className="text-sm font-medium">{competitor.supplierOverlap}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted">
                          {competitor.recentChanges} this month
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {competitor.trend === "up" ? (
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        ) : competitor.trend === "down" ? (
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        ) : (
                          <div className="w-5 h-0.5 bg-muted-foreground rounded" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Supplier Switches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyber" />
                    Recent Supplier Switches
                  </CardTitle>
                  <CardDescription>Competitor supplier changes detected by AI</CardDescription>
                </div>
                <Badge variant="outline" className="bg-cyber/20 text-cyber border-cyber/30">
                  AI Monitored
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierSwitchesData.map((switch_, index) => (
                  <motion.div
                    key={switch_.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{switch_.competitor}</p>
                        <Badge variant="outline" className={getActionBadge(switch_.action)}>
                          {switch_.action.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {switch_.action === "switched_from" ? (
                          <>
                            {switch_.supplier} <ArrowRight className="w-3 h-3 inline mx-1" /> {switch_.newSupplier}
                          </>
                        ) : switch_.action === "added" ? (
                          <>Added {switch_.supplier}</>
                        ) : (
                          <>Dropped {switch_.supplier}</>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Reason: {switch_.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="outline" className={getImpactBadge(switch_.impact)}>
                        {switch_.impact} impact
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{switch_.date}</p>
                    </div>
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
