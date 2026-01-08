import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Filter,
  Globe,
  Mail,
  Search,
  Settings,
  Shield,
  Slack,
  Trash2,
  TrendingDown,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Mock alerts data
const alertsData = [
  {
    id: 1,
    title: "Financial Risk Score Increased",
    message: "TechCorp Industries financial risk score increased from 22 to 35 due to declining profit margins in Q4 report.",
    supplier: "TechCorp Industries",
    supplierId: 1,
    type: "financial_risk",
    severity: "high",
    status: "unread",
    triggeredAt: "2024-01-20T14:30:00Z",
    emailSent: true,
    slackSent: true,
  },
  {
    id: 2,
    title: "ISO Certification Expiring",
    message: "IATF 16949 certification for Global Manufacturing Co. will expire in 30 days. Immediate action required.",
    supplier: "Global Manufacturing Co.",
    supplierId: 2,
    type: "certification_expiry",
    severity: "critical",
    status: "unread",
    triggeredAt: "2024-01-20T10:15:00Z",
    emailSent: true,
    slackSent: false,
  },
  {
    id: 3,
    title: "Merger Announcement Detected",
    message: "Pacific Components Ltd. announced merger discussions with Eastern Electronics. Potential supply chain impact.",
    supplier: "Pacific Components Ltd.",
    supplierId: 3,
    type: "news_alert",
    severity: "medium",
    status: "read",
    triggeredAt: "2024-01-19T16:45:00Z",
    emailSent: true,
    slackSent: true,
  },
  {
    id: 4,
    title: "Quality Score Declined",
    message: "Eastern Electronics quality risk score increased to 65 following customer complaints about defect rates.",
    supplier: "Eastern Electronics",
    supplierId: 4,
    type: "quality_issue",
    severity: "high",
    status: "acknowledged",
    triggeredAt: "2024-01-19T09:20:00Z",
    emailSent: true,
    slackSent: true,
  },
  {
    id: 5,
    title: "Geopolitical Risk Alert",
    message: "New trade regulations affecting Asian Semiconductors operations in Taiwan. Risk score updated.",
    supplier: "Asian Semiconductors",
    supplierId: 8,
    type: "geopolitical",
    severity: "critical",
    status: "unread",
    triggeredAt: "2024-01-18T22:00:00Z",
    emailSent: true,
    slackSent: true,
  },
  {
    id: 6,
    title: "Competitor Supplier Switch",
    message: "Competitor XYZ Corp has switched from Northern Metals to a new supplier. Potential market opportunity.",
    supplier: "Northern Metals Inc.",
    supplierId: 5,
    type: "competitor_activity",
    severity: "info",
    status: "resolved",
    triggeredAt: "2024-01-18T14:30:00Z",
    emailSent: false,
    slackSent: false,
  },
];

function getSeverityConfig(severity: string) {
  switch (severity) {
    case "critical":
      return { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle, label: "Critical" };
    case "high":
      return { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: AlertTriangle, label: "High" };
    case "medium":
      return { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Bell, label: "Medium" };
    case "low":
      return { color: "bg-green-500/20 text-green-400 border-green-500/30", icon: Bell, label: "Low" };
    default:
      return { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Bell, label: "Info" };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "financial_risk":
      return DollarSign;
    case "certification_expiry":
      return FileText;
    case "news_alert":
      return Globe;
    case "quality_issue":
      return Shield;
    case "geopolitical":
      return Globe;
    case "competitor_activity":
      return TrendingDown;
    default:
      return Bell;
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
}

function AlertCard({ alert, index }: { alert: typeof alertsData[0]; index: number }) {
  const severityConfig = getSeverityConfig(alert.severity);
  const TypeIcon = getTypeIcon(alert.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={`glass-card border-border/50 hover:border-cyber/30 transition-all duration-300 ${alert.status === "unread" ? "border-l-4 border-l-cyber" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg border ${severityConfig.color}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <Link href={`/suppliers/${alert.supplierId}`}>
                    <p className="text-sm text-cyber hover:underline">{alert.supplier}</p>
                  </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={severityConfig.color}>
                    {severityConfig.label}
                  </Badge>
                  {alert.status === "unread" && (
                    <div className="w-2 h-2 rounded-full bg-cyber animate-pulse" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{alert.message}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(alert.triggeredAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    {alert.emailSent && <Mail className="w-3 h-3 text-green-400" />}
                    {alert.slackSent && <Slack className="w-3 h-3 text-green-400" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alert.status !== "resolved" && (
                    <>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Check className="w-4 h-4 mr-1" />
                        Acknowledge
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAlerts = alertsData.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const unreadCount = alertsData.filter((a) => a.status === "unread").length;
  const criticalCount = alertsData.filter((a) => a.severity === "critical").length;

  return (
    <DashboardLayout title="Alerts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Real-time notifications and alerts for your suppliers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Alert Settings
              </Button>
            </Link>
            <Button variant="outline">
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold">{alertsData.length}</p>
                </div>
                <Bell className="w-8 h-8 text-cyber" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-cyber">{unreadCount}</p>
                </div>
                <div className="relative">
                  <Bell className="w-8 h-8 text-cyber" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyber text-xs flex items-center justify-center text-primary-foreground">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-2xl font-bold text-green-400">
                    {alertsData.filter((a) => a.status === "resolved").length}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert, index) => (
              <AlertCard key={alert.id} alert={alert} index={index} />
            ))
          ) : (
            <Card className="glass-card border-border/50">
              <CardContent className="p-12 text-center">
                <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  No alerts match your current filters. Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
