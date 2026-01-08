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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  Globe,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock leads data
const leadsData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@acmecorp.com",
    company: "Acme Corporation",
    title: "VP of Procurement",
    source: "website",
    status: "qualified",
    score: 85,
    createdAt: "2024-01-20T10:30:00Z",
    lastActivity: "2024-01-20T14:00:00Z",
    notes: "Interested in enterprise plan",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "s.johnson@globaltechind.com",
    company: "GlobalTech Industries",
    title: "Supply Chain Director",
    source: "demo_request",
    status: "contacted",
    score: 72,
    createdAt: "2024-01-19T09:15:00Z",
    lastActivity: "2024-01-20T11:30:00Z",
    notes: "Scheduled demo for next week",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@nexussystems.io",
    company: "Nexus Systems",
    title: "Chief Operations Officer",
    source: "referral",
    status: "new",
    score: 90,
    createdAt: "2024-01-20T08:00:00Z",
    lastActivity: "2024-01-20T08:00:00Z",
    notes: "Referred by existing customer",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@pinnaclemfg.com",
    company: "Pinnacle Manufacturing",
    title: "Procurement Manager",
    source: "website",
    status: "nurturing",
    score: 58,
    createdAt: "2024-01-18T15:45:00Z",
    lastActivity: "2024-01-19T10:00:00Z",
    notes: "Downloaded whitepaper",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "r.wilson@vertexsol.com",
    company: "Vertex Solutions",
    title: "Head of Supply Chain",
    source: "webinar",
    status: "qualified",
    score: 78,
    createdAt: "2024-01-17T11:00:00Z",
    lastActivity: "2024-01-20T09:30:00Z",
    notes: "Attended product webinar",
  },
];

const leadsBySource = [
  { name: "Website", value: 45, color: "oklch(0.75 0.15 195)" },
  { name: "Demo Request", value: 25, color: "oklch(0.55 0.25 290)" },
  { name: "Referral", value: 15, color: "oklch(0.80 0.16 85)" },
  { name: "Webinar", value: 10, color: "oklch(0.70 0.18 150)" },
  { name: "Other", value: 5, color: "oklch(0.65 0.02 280)" },
];

const leadsTrendData = [
  { month: "Aug", leads: 42 },
  { month: "Sep", leads: 58 },
  { month: "Oct", leads: 65 },
  { month: "Nov", leads: 72 },
  { month: "Dec", leads: 85 },
  { month: "Jan", leads: 98 },
];

const funnelData = [
  { name: "Visitors", value: 5000, fill: "oklch(0.75 0.15 195)" },
  { name: "Leads", value: 450, fill: "oklch(0.65 0.18 195)" },
  { name: "Qualified", value: 180, fill: "oklch(0.55 0.25 290)" },
  { name: "Proposals", value: 75, fill: "oklch(0.80 0.16 85)" },
  { name: "Closed", value: 28, fill: "oklch(0.70 0.18 150)" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "new":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "contacted":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "qualified":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "nurturing":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "converted":
      return "bg-cyber/20 text-cyber border-cyber/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

function getSourceIcon(source: string) {
  switch (source) {
    case "website":
      return Globe;
    case "demo_request":
      return Calendar;
    case "referral":
      return Users;
    case "webinar":
      return Target;
    default:
      return Star;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredLeads = leadsData.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <DashboardLayout title="Lead Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Track and manage leads from your landing page and marketing campaigns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-cyber hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold">{leadsData.length}</p>
                    <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +15% this month
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Qualified</p>
                    <p className="text-2xl font-bold text-green-400">
                      {leadsData.filter((l) => l.status === "qualified").length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-2xl font-bold text-cyber">
                      {Math.round(leadsData.reduce((a, l) => a + l.score, 0) / leadsData.length)}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-cyber" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold text-plasma">6.2%</p>
                  </div>
                  <ArrowRight className="w-8 h-8 text-plasma" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Lead Generation Trend</CardTitle>
                <CardDescription>Monthly lead acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={leadsTrendData}>
                      <defs>
                        <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="leads"
                        stroke="oklch(0.75 0.15 195)"
                        fillOpacity={1}
                        fill="url(#leadGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lead Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Lead Sources</CardTitle>
                <CardDescription>Distribution by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadsBySource}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {leadsBySource.map((entry, index) => (
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
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {leadsBySource.slice(0, 4).map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                      <span className="text-xs font-medium ml-auto">{item.value}%</span>
                    </div>
                  ))}
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
                  placeholder="Search leads..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="nurturing">Nurturing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="demo_request">Demo Request</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Leads</CardTitle>
              <CardDescription>Manage and track your leads</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Contact</TableHead>
                    <TableHead className="text-muted-foreground">Company</TableHead>
                    <TableHead className="text-muted-foreground">Source</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Score</TableHead>
                    <TableHead className="text-muted-foreground">Last Activity</TableHead>
                    <TableHead className="text-muted-foreground w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => {
                    const SourceIcon = getSourceIcon(lead.source);
                    return (
                      <TableRow key={lead.id} className="border-border/50 hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center">
                              <span className="text-sm font-bold text-primary-foreground">
                                {lead.name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{lead.company}</p>
                            <p className="text-xs text-muted-foreground">{lead.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <SourceIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm capitalize">{lead.source.replace("_", " ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={lead.score} className="h-2 w-12" />
                            <span className="text-sm font-medium">{lead.score}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="text-sm">{formatDate(lead.lastActivity)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                                <DropdownMenuItem>Add Note</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
