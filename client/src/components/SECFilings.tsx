import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SECFilingsProps {
  ticker: string;
  supplierId?: number;
  onRiskUpdate?: (riskScore: number) => void;
}

function RiskScoreCard({ label, score, description }: { label: string; score: number; description?: string }) {
  const getColor = (s: number) => {
    if (s < 30) return "text-green-400 bg-green-500/20 border-green-500/30";
    if (s < 50) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    if (s < 70) return "text-orange-400 bg-orange-500/20 border-orange-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };

  const getLevel = (s: number) => {
    if (s < 30) return "Low";
    if (s < 50) return "Medium";
    if (s < 70) return "High";
    return "Critical";
  };

  return (
    <div className={`p-4 rounded-lg border ${getColor(score)}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant="outline" className={getColor(score)}>
          {getLevel(score)}
        </Badge>
      </div>
      <p className="text-3xl font-bold">{score}</p>
      {description && <p className="text-xs mt-1 opacity-80">{description}</p>}
    </div>
  );
}

export default function SECFilings({ ticker, supplierId, onRiskUpdate }: SECFilingsProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch SEC full analysis
  const { data: analysisData, isLoading: analysisLoading, refetch: refetchAnalysis } = trpc.sec.getFullAnalysis.useQuery(
    { ticker },
    { enabled: !!ticker }
  );

  // Fetch SEC filings
  const { data: filingsData, isLoading: filingsLoading } = trpc.sec.getFilings.useQuery(
    { ticker },
    { enabled: !!ticker }
  );

  // Fetch stock insights
  const { data: insightsData, isLoading: insightsLoading } = trpc.sec.getInsights.useQuery(
    { ticker },
    { enabled: !!ticker }
  );

  // Sync mutation
  const syncMutation = trpc.sec.syncSupplier.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetchAnalysis();
      if (onRiskUpdate && data.riskAssessment) {
        onRiskUpdate(data.riskAssessment.overallRiskScore);
      }
    },
    onError: (error) => {
      toast.error(`Failed to sync: ${error.message}`);
    },
    onSettled: () => {
      setIsSyncing(false);
    },
  });

  const handleSync = () => {
    if (!supplierId) {
      toast.error("Supplier ID required for sync");
      return;
    }
    setIsSyncing(true);
    syncMutation.mutate({ supplierId, ticker });
  };

  const isLoading = analysisLoading || filingsLoading || insightsLoading;

  if (isLoading) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber" />
            SEC EDGAR Data
          </CardTitle>
          <CardDescription>Loading SEC filings for {ticker}...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!analysisData?.success) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber" />
            SEC EDGAR Data
          </CardTitle>
          <CardDescription>Unable to fetch SEC data for {ticker}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <XCircle className="w-8 h-8 mr-2" />
            <span>No SEC filings available for this ticker</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { riskAssessment, filingsSummary, recentFilings, insights } = analysisData;

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyber" />
              SEC EDGAR Data
              <Badge variant="outline" className="ml-2 bg-cyber/20 text-cyber border-cyber/30">
                LIVE
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time SEC filings and risk analysis for {ticker}
              {insights?.companyName && ` - ${insights.companyName}`}
            </CardDescription>
          </div>
          {supplierId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="hover:border-cyber/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync Risk Scores"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Assessment Grid */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyber" />
            AI-Powered Risk Assessment
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <RiskScoreCard label="Overall" score={riskAssessment.overallRiskScore} />
            <RiskScoreCard label="Financial" score={riskAssessment.financialRiskScore} />
            <RiskScoreCard label="Quality" score={riskAssessment.qualityRiskScore} />
            <RiskScoreCard label="Operational" score={riskAssessment.operationalRiskScore} />
            <RiskScoreCard label="Geopolitical" score={riskAssessment.geopoliticalRiskScore} />
          </div>
        </div>

        {/* Risk Factors */}
        {riskAssessment.riskFactors && riskAssessment.riskFactors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-quantum" />
              Identified Risk Factors
            </h3>
            <div className="space-y-2">
              {riskAssessment.riskFactors.map((factor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/30"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{factor}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs for Filings and Insights */}
        <Tabs defaultValue="filings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/30">
            <TabsTrigger value="filings">SEC Filings</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
            <TabsTrigger value="events">Key Events</TabsTrigger>
          </TabsList>

          <TabsContent value="filings" className="mt-4">
            {filingsSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-bold text-cyber">{filingsSummary.annualReports}</p>
                  <p className="text-xs text-muted-foreground">10-K Annual</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-bold text-plasma">{filingsSummary.quarterlyReports}</p>
                  <p className="text-xs text-muted-foreground">10-Q Quarterly</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-bold text-quantum">{filingsSummary.currentReports}</p>
                  <p className="text-xs text-muted-foreground">8-K Current</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <p className="text-2xl font-bold">{filingsSummary.otherFilings}</p>
                  <p className="text-xs text-muted-foreground">Other</p>
                </div>
              </div>
            )}

            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {recentFilings.map((filing, index) => (
                  <motion.a
                    key={index}
                    href={filing.edgarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-cyber" />
                      <div>
                        <p className="text-sm font-medium group-hover:text-cyber transition-colors">
                          {filing.type}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {filing.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{filing.date}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-cyber transition-colors" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            {insights ? (
              <div className="space-y-4">
                {/* Technical Outlook */}
                {insights.technicalOutlook && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyber" />
                      Technical Outlook
                    </h4>
                    <div className="flex items-center gap-2">
                      {insights.technicalOutlook.direction === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : insights.technicalOutlook.direction === "down" ? (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      ) : (
                        <BarChart3 className="w-5 h-5 text-yellow-400" />
                      )}
                      <span className="text-sm">{insights.technicalOutlook.stateDescription}</span>
                      <Badge variant="outline" className="ml-auto">
                        Score: {insights.technicalOutlook.score}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Valuation */}
                {insights.valuation && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Valuation Analysis</h4>
                    <p className="text-sm text-muted-foreground">{insights.valuation.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{insights.valuation.relativeValue}</Badge>
                      {insights.valuation.discount && (
                        <span className="text-xs text-muted-foreground">
                          Discount: {insights.valuation.discount}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                {insights.recommendation && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Analyst Recommendation</h4>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={
                          insights.recommendation.rating?.toLowerCase().includes("buy")
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : insights.recommendation.rating?.toLowerCase().includes("sell")
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {insights.recommendation.rating}
                      </Badge>
                      {insights.recommendation.targetPrice && (
                        <span className="text-sm">
                          Target: ${insights.recommendation.targetPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        via {insights.recommendation.provider}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <span>No market insights available</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            {filingsData?.keyEvents && filingsData.keyEvents.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {filingsData.keyEvents.map((event, index) => (
                    <motion.a
                      key={index}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.importance === "high"
                              ? "bg-red-500"
                              : event.importance === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium group-hover:text-cyber transition-colors">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{event.date}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-cyber transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <span>No key events found</span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Last updated: {new Date(riskAssessment.lastUpdated).toLocaleString()}</span>
          </div>
          <span>Data source: SEC EDGAR via Yahoo Finance</span>
        </div>
      </CardContent>
    </Card>
  );
}
