import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// Mock reports data
const reportsData = [
  {
    id: 1,
    name: "Weekly Supplier Risk Summary",
    type: "automated",
    frequency: "weekly",
    lastGenerated: "2024-01-20T08:00:00Z",
    nextScheduled: "2024-01-27T08:00:00Z",
    status: "completed",
    recipients: 5,
    pages: 12,
  },
  {
    id: 2,
    name: "Monthly Portfolio Analysis",
    type: "automated",
    frequency: "monthly",
    lastGenerated: "2024-01-01T08:00:00Z",
    nextScheduled: "2024-02-01T08:00:00Z",
    status: "completed",
    recipients: 8,
    pages: 28,
  },
  {
    id: 3,
    name: "Q4 2023 Executive Summary",
    type: "on_demand",
    frequency: "quarterly",
    lastGenerated: "2024-01-05T14:30:00Z",
    nextScheduled: null,
    status: "completed",
    recipients: 12,
    pages: 45,
  },
  {
    id: 4,
    name: "Critical Supplier Deep Dive",
    type: "on_demand",
    frequency: "one_time",
    lastGenerated: "2024-01-18T11:00:00Z",
    nextScheduled: null,
    status: "completed",
    recipients: 3,
    pages: 18,
  },
  {
    id: 5,
    name: "Geopolitical Risk Assessment",
    type: "automated",
    frequency: "weekly",
    lastGenerated: null,
    nextScheduled: "2024-01-21T08:00:00Z",
    status: "scheduled",
    recipients: 6,
    pages: 0,
  },
];

const reportTemplates = [
  {
    id: 1,
    name: "Executive Summary",
    description: "High-level overview for leadership",
    icon: TrendingUp,
    sections: ["Risk Overview", "Key Metrics", "Recommendations"],
  },
  {
    id: 2,
    name: "Supplier Deep Dive",
    description: "Detailed analysis of specific suppliers",
    icon: FileText,
    sections: ["Financial Health", "Quality Metrics", "Risk Factors"],
  },
  {
    id: 3,
    name: "Risk Assessment",
    description: "Comprehensive risk analysis",
    icon: BarChart3,
    sections: ["Risk Distribution", "Trends", "Mitigation Plans"],
  },
  {
    id: 4,
    name: "Competitive Intelligence",
    description: "Competitor supplier analysis",
    icon: PieChart,
    sections: ["Market Position", "Supplier Overlap", "Opportunities"],
  },
];

const scheduledDigests = [
  { day: "Monday", time: "8:00 AM", type: "Weekly Summary", enabled: true },
  { day: "1st of Month", time: "9:00 AM", type: "Monthly Analysis", enabled: true },
  { day: "Friday", time: "5:00 PM", type: "Critical Alerts Digest", enabled: true },
  { day: "Quarterly", time: "10:00 AM", type: "Executive Report", enabled: false },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "scheduled":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "generating":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "failed":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredReports = reportsData.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Generate and schedule automated reports and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-gradient-cyber hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Report
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
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold">{reportsData.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Automated</p>
                    <p className="text-2xl font-bold text-cyber">
                      {reportsData.filter((r) => r.type === "automated").length}
                    </p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Recipients</p>
                    <p className="text-2xl font-bold text-plasma">
                      {reportsData.reduce((a, r) => a + r.recipients, 0)}
                    </p>
                  </div>
                  <Mail className="w-8 h-8 text-plasma" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pages Generated</p>
                    <p className="text-2xl font-bold text-quantum">
                      {reportsData.reduce((a, r) => a + r.pages, 0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-quantum" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Report Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyber" />
                    Quick Generate
                  </CardTitle>
                  <CardDescription>Generate reports from templates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gradient-cyber">
                        <template.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium group-hover:text-cyber transition-colors">
                          {template.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.sections.map((section, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Generate
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="on_demand">On Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Generated Reports</CardTitle>
              <CardDescription>View and download your reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Report Name</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Last Generated</TableHead>
                    <TableHead className="text-muted-foreground">Next Scheduled</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Recipients</TableHead>
                    <TableHead className="text-muted-foreground w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-cyber">
                            <FileText className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <p className="text-xs text-muted-foreground">{report.pages} pages</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(report.lastGenerated)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(report.nextScheduled)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{report.recipients}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scheduled Digests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Scheduled Digests</CardTitle>
                  <CardDescription>Automated report delivery schedule</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {scheduledDigests.map((digest, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      digest.enabled
                        ? "bg-muted/30 border-border/50"
                        : "bg-muted/10 border-border/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="outline"
                        className={digest.enabled ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                      >
                        {digest.enabled ? "Active" : "Disabled"}
                      </Badge>
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium">{digest.type}</h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{digest.day}</span>
                      <span>•</span>
                      <span>{digest.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
