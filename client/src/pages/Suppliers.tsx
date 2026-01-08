import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpDown,
  Building2,
  ChevronRight,
  ExternalLink,
  Filter,
  Globe,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";

// Mock supplier data
const suppliersData = [
  {
    id: 1,
    name: "TechCorp Industries",
    ticker: "TECH",
    industry: "Electronics",
    country: "United States",
    status: "active",
    tier: "strategic",
    overallRisk: 28,
    financialRisk: 22,
    qualityRisk: 35,
    geopoliticalRisk: 25,
    trend: "up",
    lastAssessment: "2024-01-15",
  },
  {
    id: 2,
    name: "Global Manufacturing Co.",
    ticker: "GMC",
    industry: "Manufacturing",
    country: "Germany",
    status: "monitoring",
    tier: "preferred",
    overallRisk: 45,
    financialRisk: 52,
    qualityRisk: 38,
    geopoliticalRisk: 42,
    trend: "down",
    lastAssessment: "2024-01-12",
  },
  {
    id: 3,
    name: "Pacific Components Ltd.",
    ticker: "PCL",
    industry: "Components",
    country: "Japan",
    status: "active",
    tier: "strategic",
    overallRisk: 32,
    financialRisk: 28,
    qualityRisk: 40,
    geopoliticalRisk: 30,
    trend: "stable",
    lastAssessment: "2024-01-10",
  },
  {
    id: 4,
    name: "Eastern Electronics",
    ticker: "EE",
    industry: "Electronics",
    country: "South Korea",
    status: "at_risk",
    tier: "approved",
    overallRisk: 68,
    financialRisk: 72,
    qualityRisk: 65,
    geopoliticalRisk: 58,
    trend: "down",
    lastAssessment: "2024-01-08",
  },
  {
    id: 5,
    name: "Northern Metals Inc.",
    ticker: "NMI",
    industry: "Raw Materials",
    country: "Canada",
    status: "active",
    tier: "preferred",
    overallRisk: 35,
    financialRisk: 30,
    qualityRisk: 42,
    geopoliticalRisk: 28,
    trend: "up",
    lastAssessment: "2024-01-05",
  },
  {
    id: 6,
    name: "Southern Logistics",
    ticker: "SL",
    industry: "Logistics",
    country: "Mexico",
    status: "monitoring",
    tier: "conditional",
    overallRisk: 55,
    financialRisk: 48,
    qualityRisk: 62,
    geopoliticalRisk: 55,
    trend: "stable",
    lastAssessment: "2024-01-03",
  },
  {
    id: 7,
    name: "European Precision Parts",
    ticker: "EPP",
    industry: "Precision Engineering",
    country: "Switzerland",
    status: "active",
    tier: "strategic",
    overallRisk: 22,
    financialRisk: 18,
    qualityRisk: 25,
    geopoliticalRisk: 20,
    trend: "up",
    lastAssessment: "2024-01-01",
  },
  {
    id: 8,
    name: "Asian Semiconductors",
    ticker: "ASC",
    industry: "Semiconductors",
    country: "Taiwan",
    status: "critical",
    tier: "approved",
    overallRisk: 78,
    financialRisk: 65,
    qualityRisk: 70,
    geopoliticalRisk: 92,
    trend: "down",
    lastAssessment: "2023-12-28",
  },
];

function getRiskColor(risk: number) {
  if (risk < 30) return "text-green-400";
  if (risk < 50) return "text-yellow-400";
  if (risk < 70) return "text-orange-400";
  return "text-red-400";
}

function getRiskBadge(risk: number) {
  if (risk < 30) return "risk-low";
  if (risk < 50) return "risk-medium";
  if (risk < 70) return "risk-high";
  return "risk-critical";
}

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "monitoring":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "at_risk":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getTierBadge(tier: string) {
  switch (tier) {
    case "strategic":
      return "bg-cyber/20 text-cyber border-cyber/30";
    case "preferred":
      return "bg-plasma/20 text-plasma border-plasma/30";
    case "approved":
      return "bg-quantum/20 text-quantum border-quantum/30";
    case "conditional":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const syncAllMutation = trpc.sec.syncAll.useMutation({
    onSuccess: (data) => {
      toast.success(`Synced ${data.successful} suppliers successfully`);
      if (data.failed > 0) {
        toast.warning(`${data.failed} suppliers failed to sync`);
      }
    },
    onError: (error) => {
      toast.error(`Sync failed: ${error.message}`);
    },
    onSettled: () => {
      setIsSyncing(false);
    },
  });

  const handleSyncAll = () => {
    setIsSyncing(true);
    syncAllMutation.mutate();
  };

  const filteredSuppliers = suppliersData.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    const matchesTier = tierFilter === "all" || supplier.tier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  return (
    <DashboardLayout title="Suppliers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Monitor and manage your supplier portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="hover:border-cyber/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing SEC Data..." : "Sync All SEC Data"}
            </Button>
            <Button className="bg-gradient-cyber hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Suppliers</p>
                    <p className="text-2xl font-bold">{suppliersData.length}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-400">
                      {suppliersData.filter((s) => s.status === "active").length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">At Risk</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {suppliersData.filter((s) => s.status === "at_risk" || s.status === "critical").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                    <p className="text-2xl font-bold text-quantum">
                      {Math.round(suppliersData.reduce((acc, s) => acc + s.overallRisk, 0) / suppliersData.length)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-quantum" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="preferred">Preferred</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="conditional">Conditional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="glass-card border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Supplier</TableHead>
                      <TableHead className="text-muted-foreground">Industry</TableHead>
                      <TableHead className="text-muted-foreground">Country</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Tier</TableHead>
                      <TableHead className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          Risk Score
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-muted-foreground">Trend</TableHead>
                      <TableHead className="text-muted-foreground w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow
                        key={supplier.id}
                        className="border-border/50 hover:bg-muted/30 cursor-pointer"
                      >
                        <TableCell>
                          <Link href={`/suppliers/${supplier.id}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
                                <span className="text-sm font-bold text-primary-foreground">
                                  {supplier.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium hover:text-cyber transition-colors">
                                  {supplier.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{supplier.ticker}</p>
                              </div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{supplier.industry}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{supplier.country}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(supplier.status)}>
                            {supplier.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTierBadge(supplier.tier)}>
                            {supplier.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <Progress
                                value={100 - supplier.overallRisk}
                                className="h-2"
                              />
                            </div>
                            <span className={`text-sm font-medium ${getRiskColor(supplier.overallRisk)}`}>
                              {supplier.overallRisk}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {supplier.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : supplier.trend === "down" ? (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          ) : (
                            <div className="w-4 h-0.5 bg-muted-foreground rounded" />
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Link href={`/suppliers/${supplier.id}`} className="flex items-center w-full">
                                  View Details
                                  <ChevronRight className="w-4 h-4 ml-auto" />
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Website
                              </DropdownMenuItem>
                              <DropdownMenuItem>Run Assessment</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
