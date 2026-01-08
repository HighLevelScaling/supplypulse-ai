import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Brain,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: { title: string; type: string }[];
}

const suggestedQueries = [
  "What are the top 5 highest risk suppliers?",
  "Show me suppliers with expiring certifications",
  "Analyze geopolitical risks in Asia Pacific",
  "Compare TechCorp vs Global Manufacturing",
  "What's the average risk score by industry?",
  "Identify single points of failure in my supply chain",
];

const conversationHistory = [
  { id: "1", title: "Risk Analysis Q1 2024", date: "Today" },
  { id: "2", title: "Supplier Comparison", date: "Yesterday" },
  { id: "3", title: "Certification Review", date: "Jan 18" },
  { id: "4", title: "Geopolitical Assessment", date: "Jan 15" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your AI-powered supplier intelligence assistant. I can help you with:

- **Risk Analysis**: Analyze supplier risk scores and trends
- **Supplier Insights**: Get detailed information about any supplier
- **Predictions**: Understand AI forecasts and their implications
- **Comparisons**: Compare suppliers across various metrics
- **Recommendations**: Get actionable suggestions for your supply chain

How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, { content: string; sources?: { title: string; type: string }[] }> = {
        risk: {
          content: `Based on my analysis of your supplier portfolio, here are the **top 5 highest risk suppliers**:

| Rank | Supplier | Risk Score | Primary Concern |
|------|----------|------------|-----------------|
| 1 | Asian Semiconductors | 78 | Geopolitical tensions |
| 2 | Eastern Electronics | 68 | Quality issues |
| 3 | Southern Logistics | 55 | Financial instability |
| 4 | Global Manufacturing | 45 | Certification expiry |
| 5 | Northern Metals | 35 | Capacity constraints |

**Key Insights:**
- 2 suppliers have critical risk levels (>70)
- Geopolitical factors are the primary driver for the highest-risk supplier
- I recommend immediate review of Asian Semiconductors' contingency plans

Would you like me to provide detailed analysis for any of these suppliers?`,
          sources: [
            { title: "Risk Assessment Report", type: "report" },
            { title: "Supplier Database", type: "database" },
          ],
        },
        certification: {
          content: `I found **3 suppliers with certifications expiring in the next 90 days**:

1. **Global Manufacturing Co.** - IATF 16949
   - Expiry: February 28, 2024 (38 days)
   - Status: Renewal in progress
   - Action: Follow up with supplier

2. **Pacific Components Ltd.** - ISO 14001:2015
   - Expiry: March 15, 2024 (54 days)
   - Status: Audit scheduled
   - Action: Monitor progress

3. **Eastern Electronics** - ISO 9001:2015
   - Expiry: April 1, 2024 (71 days)
   - Status: Not started
   - Action: **Urgent** - Request renewal timeline

**Recommendation:** I suggest setting up automated alerts for certification renewals 120 days before expiry to ensure adequate time for the renewal process.`,
          sources: [
            { title: "Certification Tracker", type: "system" },
          ],
        },
        default: {
          content: `I've analyzed your query and here's what I found:

Based on your supplier portfolio data, I can provide insights across multiple dimensions including:

- **Financial Health**: Revenue trends, profit margins, debt ratios
- **Quality Metrics**: Defect rates, certification status, audit results
- **Geopolitical Factors**: Regional stability, trade regulations, sanctions
- **Operational Performance**: Delivery times, capacity utilization

For more specific analysis, try asking about:
- Specific suppliers by name
- Risk categories (financial, quality, geopolitical)
- Comparisons between suppliers
- Predictions and forecasts

What specific aspect would you like me to focus on?`,
        },
      };

      const query = inputValue.toLowerCase();
      let response = responses.default;
      
      if (query.includes("risk") || query.includes("highest")) {
        response = responses.risk;
      } else if (query.includes("certif") || query.includes("expir")) {
        response = responses.certification;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuery = (query: string) => {
    setInputValue(query);
    inputRef.current?.focus();
  };

  return (
    <DashboardLayout title="AI Assistant">
      <div className="h-[calc(100vh-10rem)] flex gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex w-64 flex-col"
        >
          <Card className="glass-card border-border/50 flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Conversations</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full px-4 pb-4">
                <div className="space-y-2">
                  {conversationHistory.map((conv) => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{conv.title}</p>
                          <p className="text-xs text-muted-foreground">{conv.date}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <Card className="glass-card border-border/50 flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-cyber flex items-center justify-center glow-cyber">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">SupplyPulse AI</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Online and ready to help
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-cyber/20 text-cyber border-cyber/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-6 max-w-3xl mx-auto">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] ${
                          message.role === "user"
                            ? "bg-gradient-cyber text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3"
                            : "bg-muted/30 rounded-2xl rounded-tl-sm px-4 py-3"
                        }`}
                      >
                        {message.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/30">
                            <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.sources.map((source, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {source.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.role === "assistant" && index > 0 && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Not helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted/30 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-cyber" />
                        <span className="text-sm text-muted-foreground">Analyzing your query...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Suggested Queries */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                  >
                    <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQueries.map((query, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs hover:border-cyber/50"
                          onClick={() => handleSuggestedQuery(query)}
                        >
                          {query}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      placeholder="Ask me anything about your suppliers..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="pr-12 bg-background/50"
                      disabled={isLoading}
                    />
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-gradient-cyber hover:opacity-90"
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  AI responses are based on your supplier data. Always verify critical decisions.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
