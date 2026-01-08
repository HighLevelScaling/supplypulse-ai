import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Building2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  GitBranch,
  Globe,
  Layers,
  Link2,
  Maximize2,
  Network as NetworkIcon,
  RefreshCw,
  Search,
  Settings,
  Share2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Mock network data
const networkStats = {
  totalNodes: 288,
  totalConnections: 1247,
  avgDependencies: 4.3,
  criticalPaths: 12,
  clusters: 8,
};

const supplierNodes = [
  { id: 1, name: "TechCorp Industries", tier: 1, risk: 28, connections: 15, x: 400, y: 300 },
  { id: 2, name: "Global Manufacturing", tier: 1, risk: 45, connections: 12, x: 600, y: 200 },
  { id: 3, name: "Pacific Components", tier: 1, risk: 32, connections: 18, x: 300, y: 150 },
  { id: 4, name: "Eastern Electronics", tier: 2, risk: 68, connections: 8, x: 500, y: 400 },
  { id: 5, name: "Northern Metals", tier: 2, risk: 35, connections: 10, x: 200, y: 350 },
  { id: 6, name: "Southern Logistics", tier: 2, risk: 55, connections: 6, x: 700, y: 350 },
  { id: 7, name: "European Precision", tier: 1, risk: 22, connections: 20, x: 450, y: 100 },
  { id: 8, name: "Asian Semiconductors", tier: 1, risk: 78, connections: 25, x: 550, y: 250 },
];

const connections = [
  { from: 1, to: 4, strength: 0.8 },
  { from: 1, to: 5, strength: 0.6 },
  { from: 2, to: 4, strength: 0.7 },
  { from: 2, to: 6, strength: 0.5 },
  { from: 3, to: 5, strength: 0.9 },
  { from: 3, to: 7, strength: 0.4 },
  { from: 7, to: 8, strength: 0.8 },
  { from: 8, to: 4, strength: 0.6 },
  { from: 8, to: 6, strength: 0.7 },
  { from: 1, to: 8, strength: 0.5 },
  { from: 2, to: 7, strength: 0.6 },
  { from: 3, to: 8, strength: 0.4 },
];

function getRiskColor(risk: number) {
  if (risk < 30) return "oklch(0.75 0.18 150)";
  if (risk < 50) return "oklch(0.80 0.16 85)";
  if (risk < 70) return "oklch(0.65 0.20 25)";
  return "oklch(0.60 0.25 25)";
}

function getTierColor(tier: number) {
  switch (tier) {
    case 1:
      return "oklch(0.75 0.15 195)";
    case 2:
      return "oklch(0.55 0.25 290)";
    case 3:
      return "oklch(0.80 0.16 85)";
    default:
      return "oklch(0.65 0.02 280)";
  }
}

function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<typeof supplierNodes[0] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      connections.forEach((conn) => {
        const fromNode = supplierNodes.find((n) => n.id === conn.from);
        const toNode = supplierNodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return;

        ctx.beginPath();
        ctx.moveTo(fromNode.x * zoom, fromNode.y * zoom);
        ctx.lineTo(toNode.x * zoom, toNode.y * zoom);
        ctx.strokeStyle = `rgba(0, 212, 255, ${conn.strength * 0.5})`;
        ctx.lineWidth = conn.strength * 3;
        ctx.stroke();
      });

      // Draw nodes
      supplierNodes.forEach((node) => {
        const x = node.x * zoom;
        const y = node.y * zoom;
        const radius = 20 + node.connections;
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Glow effect
        if (isHovered || isSelected) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
          gradient.addColorStop(0, "rgba(0, 212, 255, 0.3)");
          gradient.addColorStop(1, "rgba(0, 212, 255, 0)");
          ctx.beginPath();
          ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = getRiskColor(node.risk);
        ctx.fill();

        // Border
        ctx.strokeStyle = isSelected ? "oklch(0.75 0.15 195)" : "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();

        // Tier indicator
        ctx.beginPath();
        ctx.arc(x + radius * 0.7, y - radius * 0.7, 8, 0, Math.PI * 2);
        ctx.fillStyle = getTierColor(node.tier);
        ctx.fill();

        // Label
        ctx.font = "12px Inter, sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(node.name.split(" ")[0], x, y + radius + 16);
      });
    };

    draw();
  }, [zoom, hoveredNode, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = supplierNodes.find((node) => {
      const nodeX = node.x * zoom;
      const nodeY = node.y * zoom;
      const radius = 20 + node.connections;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      return distance <= radius;
    });

    setSelectedNode(clickedNode || null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredNodeFound = supplierNodes.find((node) => {
      const nodeX = node.x * zoom;
      const nodeY = node.y * zoom;
      const radius = 20 + node.connections;
      const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      return distance <= radius;
    });

    setHoveredNode(hoveredNodeFound?.id || null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-[500px] bg-background/50 rounded-lg cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg p-2">
        <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 w-64 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold">{selectedNode.name}</h4>
              <Badge variant="outline" className="mt-1">
                Tier {selectedNode.tier}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Score</span>
              <span className={selectedNode.risk < 50 ? "text-green-400" : "text-red-400"}>
                {selectedNode.risk}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections</span>
              <span>{selectedNode.connections}</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-gradient-cyber hover:opacity-90" size="sm">
            View Details
          </Button>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
        <p className="text-xs text-muted-foreground mb-2">Risk Level</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.75 0.18 150)" }} />
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.80 0.16 85)" }} />
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.20 25)" }} />
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.60 0.25 25)" }} />
            <span className="text-xs">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Network() {
  const [viewMode, setViewMode] = useState("network");
  const [tierFilter, setTierFilter] = useState("all");

  return (
    <DashboardLayout title="Supplier Network">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">
              Interactive visualization of your supplier relationships and dependencies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Nodes</p>
                  <p className="text-2xl font-bold">{networkStats.totalNodes}</p>
                </div>
                <Building2 className="w-6 h-6 text-cyber" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Connections</p>
                  <p className="text-2xl font-bold">{networkStats.totalConnections}</p>
                </div>
                <Link2 className="w-6 h-6 text-plasma" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Dependencies</p>
                  <p className="text-2xl font-bold">{networkStats.avgDependencies}</p>
                </div>
                <GitBranch className="w-6 h-6 text-quantum" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Critical Paths</p>
                  <p className="text-2xl font-bold text-red-400">{networkStats.criticalPaths}</p>
                </div>
                <Share2 className="w-6 h-6 text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Clusters</p>
                  <p className="text-2xl font-bold">{networkStats.clusters}</p>
                </div>
                <Layers className="w-6 h-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "network" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("network")}
                  className={viewMode === "network" ? "bg-gradient-cyber" : ""}
                >
                  <NetworkIcon className="w-4 h-4 mr-2" />
                  Network
                </Button>
                <Button
                  variant={viewMode === "hierarchy" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("hierarchy")}
                  className={viewMode === "hierarchy" ? "bg-gradient-cyber" : ""}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Hierarchy
                </Button>
                <Button
                  variant={viewMode === "geo" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("geo")}
                  className={viewMode === "geo" ? "bg-gradient-cyber" : ""}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Geographic
                </Button>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[150px] bg-background/50">
                    <SelectValue placeholder="Filter by tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="tier1">Tier 1</SelectItem>
                    <SelectItem value="tier2">Tier 2</SelectItem>
                    <SelectItem value="tier3">Tier 3</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Supplier Network Graph</CardTitle>
                  <CardDescription>Click on nodes to view supplier details</CardDescription>
                </div>
                <Badge variant="outline" className="bg-cyber/20 text-cyber border-cyber/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Live View
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <NetworkVisualization />
            </CardContent>
          </Card>
        </motion.div>

        {/* Dependency Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Critical Dependencies</CardTitle>
                <CardDescription>Suppliers with high dependency risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierNodes
                    .filter((n) => n.connections > 10)
                    .sort((a, b) => b.connections - a.connections)
                    .map((node, index) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getRiskColor(node.risk) }}
                          >
                            <span className="text-sm font-bold text-white">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-muted-foreground">Tier {node.tier}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{node.connections}</p>
                          <p className="text-xs text-muted-foreground">connections</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="glass-card border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Single Points of Failure</CardTitle>
                <CardDescription>Suppliers that could disrupt your supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierNodes
                    .filter((n) => n.risk > 50)
                    .sort((a, b) => b.risk - a.risk)
                    .map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getRiskColor(node.risk) }}
                          >
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {node.connections} dependent suppliers
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-400">{node.risk}</p>
                          <p className="text-xs text-muted-foreground">risk score</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
