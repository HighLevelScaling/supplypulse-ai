import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  BarChart3, 
  Bell, 
  Bot, 
  Brain, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Globe, 
  LineChart, 
  Lock, 
  MessageSquare, 
  Network, 
  Search, 
  Shield, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Zap 
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

// SEO Meta Component
function SEOHead() {
  useEffect(() => {
    document.title = "SupplyPulse AI - Real-Time Supplier Intelligence Platform";
    
    // Meta descriptions
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Transform your supply chain with AI-powered supplier intelligence. Real-time monitoring, predictive analytics, risk scoring, and competitive insights. Start your free trial today.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Transform your supply chain with AI-powered supplier intelligence. Real-time monitoring, predictive analytics, risk scoring, and competitive insights. Start your free trial today.";
      document.head.appendChild(meta);
    }
    
    // Open Graph tags
    const ogTags = [
      { property: "og:title", content: "SupplyPulse AI - Real-Time Supplier Intelligence" },
      { property: "og:description", content: "AI-powered supplier monitoring, risk scoring, and predictive analytics for enterprise procurement teams." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
    ];
    
    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });
  }, []);
  
  return null;
}

// Animated background particles
function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-grid opacity-30" />
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyber"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [null, Math.random() * -500],
            opacity: [null, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Stats counter animation
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="glass-card border-border/50 hover:border-cyber/50 transition-all duration-300 group h-full">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-gradient-cyber flex items-center justify-center mb-4 group-hover:glow-cyber transition-all duration-300">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Pricing card component
function PricingCard({ 
  tier, 
  price, 
  description, 
  features, 
  highlighted = false,
  delay 
}: { 
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className={`h-full ${highlighted ? 'border-gradient-animated glow-cyber' : 'glass-card border-border/50'}`}>
        <CardHeader className="text-center pb-2">
          {highlighted && (
            <div className="text-xs font-semibold text-cyber uppercase tracking-wider mb-2">Most Popular</div>
          )}
          <CardTitle className="text-2xl">{tier}</CardTitle>
          <div className="mt-4">
            <span className="text-4xl font-bold text-gradient-cyber">{price}</span>
            {price !== "Custom" && <span className="text-muted-foreground">/year</span>}
          </div>
          <CardDescription className="mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyber shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className={`w-full mt-8 ${highlighted ? 'bg-gradient-cyber hover:opacity-90' : ''}`}
            variant={highlighted ? "default" : "outline"}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Testimonial card
function TestimonialCard({ quote, author, role, company, delay }: {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="glass-card border-border/50 h-full">
        <CardContent className="pt-6">
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Sparkles key={i} className="w-4 h-4 text-quantum" />
            ))}
          </div>
          <p className="text-foreground/80 italic mb-6">"{quote}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">{author[0]}</span>
            </div>
            <div>
              <div className="font-semibold text-sm">{author}</div>
              <div className="text-xs text-muted-foreground">{role}, {company}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Lead capture form
function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    companySize: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Thank you! We'll be in touch shortly.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        jobTitle: "",
        companySize: "",
        message: "",
      });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitLead.mutateAsync({
        ...formData,
        source: "demo_request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="bg-background/50"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
          className="bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          className="bg-background/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companySize">Company Size</Label>
        <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
          <SelectTrigger className="bg-background/50">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-50">1-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201-500">201-500 employees</SelectItem>
            <SelectItem value="501-1000">501-1000 employees</SelectItem>
            <SelectItem value="1000+">1000+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your supplier intelligence needs..."
          className="bg-background/50 min-h-[100px]"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-gradient-cyber hover:opacity-90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Request Demo"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our Privacy Policy and Terms of Service.
      </p>
    </form>
  );
}

// Navigation
function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">SupplyPulse AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="outline" className="border-cyber/50 hover:border-cyber">
                  Dashboard
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </a>
                <a href="#demo">
                  <Button className="bg-gradient-cyber hover:opacity-90">
                    Get Started
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Main Home component
export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Live data feeds from SEC filings, USPTO patents, ISO certifications, and global news sources. Never miss a critical supplier event.",
    },
    {
      icon: Brain,
      title: "AI Risk Scoring",
      description: "Advanced machine learning models analyze financial health, quality compliance, and geopolitical factors to predict supplier risks.",
    },
    {
      icon: Network,
      title: "Network Visualization",
      description: "Interactive 3D supplier network maps showing relationships, dependencies, and potential single points of failure.",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Forecast supplier failures, price changes, and supply disruptions before they impact your business.",
    },
    {
      icon: Target,
      title: "Competitive Intelligence",
      description: "Track competitor supplier switches and market movements to stay ahead of industry trends.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Customizable real-time notifications via email, Slack, and in-app for critical supplier events.",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Natural language chatbot for instant supplier queries, powered by advanced LLM with context-aware responses.",
    },
    {
      icon: FileText,
      title: "Automated Reports",
      description: "Generate weekly digests and on-demand analysis reports with AI-powered insights and recommendations.",
    },
  ];

  const testimonials = [
    {
      quote: "SupplyPulse AI helped us identify a critical supplier risk 3 months before it would have disrupted our production line. The ROI was immediate.",
      author: "Sarah Chen",
      role: "VP of Procurement",
      company: "TechCorp Industries",
    },
    {
      quote: "The predictive analytics are incredibly accurate. We've reduced supplier-related disruptions by 67% since implementing the platform.",
      author: "Michael Rodriguez",
      role: "Chief Supply Chain Officer",
      company: "Global Manufacturing Co.",
    },
    {
      quote: "Finally, a supplier intelligence tool that actually delivers on its promises. The AI chatbot alone saves our team hours every week.",
      author: "Jennifer Walsh",
      role: "Director of Strategic Sourcing",
      company: "MedDevice Solutions",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <ParticleBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber/10 border border-cyber/30 text-cyber text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Supply Chain Intelligence</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-gradient-cyber">Transform</span> Your Supply Chain with{" "}
                <span className="text-gradient-gold">Real-Time Intelligence</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Monitor suppliers in real-time, predict risks before they happen, and make data-driven decisions with AI-powered analytics. The Bloomberg Terminal for procurement teams.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <a href="#demo">
                  <Button size="lg" className="bg-gradient-cyber hover:opacity-90 glow-cyber">
                    Request Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="border-cyber/50 hover:border-cyber">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button size="lg" variant="outline" className="border-cyber/50 hover:border-cyber">
                      Sign In
                    </Button>
                  </a>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-gradient-cyber">
                    <AnimatedCounter value={500} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground">Enterprise Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-gold">
                    <AnimatedCounter value={50000} suffix="+" />
                  </div>
                  <div className="text-sm text-muted-foreground">Suppliers Monitored</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-plasma">
                    <AnimatedCounter value={99} suffix="%" />
                  </div>
                  <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                </div>
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Animated rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="absolute w-[80%] h-[80%] rounded-full border border-cyber/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-[60%] h-[60%] rounded-full border border-plasma/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-[40%] h-[40%] rounded-full border border-quantum/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                {/* Central element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-cyber glow-cyber flex items-center justify-center">
                    <Brain className="w-16 h-16 text-primary-foreground" />
                  </div>
                </div>
                
                {/* Floating cards */}
                <motion.div
                  className="absolute top-10 right-10 glass-card rounded-lg p-4 w-48"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-quantum" />
                    <span className="text-xs font-semibold">Risk Alert</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Supplier financial health declined 15%</p>
                </motion.div>
                
                <motion.div
                  className="absolute bottom-20 left-0 glass-card rounded-lg p-4 w-48"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-cyber" />
                    <span className="text-xs font-semibold">Prediction</span>
                  </div>
                  <p className="text-xs text-muted-foreground">87% confidence: No disruption next quarter</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade <span className="text-gradient-cyber">Intelligence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to monitor, analyze, and optimize your supplier relationships in one powerful platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient-gold">SupplyPulse</span> Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From data ingestion to actionable insights in seconds
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Data Collection", desc: "Aggregate data from SEC, USPTO, ISO, news, and 50+ sources" },
              { icon: Brain, title: "AI Processing", desc: "Advanced ML models analyze patterns and detect anomalies" },
              { icon: BarChart3, title: "Risk Scoring", desc: "Generate comprehensive risk scores across multiple dimensions" },
              { icon: Bell, title: "Smart Alerts", desc: "Receive real-time notifications on critical changes" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-cyber flex items-center justify-center glow-cyber">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-[60%] w-[80%] h-px bg-gradient-to-r from-cyber to-transparent" />
                  )}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent <span className="text-gradient-cyber">Pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your supply chain complexity
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              tier="Core"
              price="$50K"
              description="For growing procurement teams"
              features={[
                "Monitor up to 50 suppliers",
                "Financial health tracking",
                "Quality certification monitoring",
                "Basic competitive intelligence",
                "Email alerts",
                "Weekly digest reports",
              ]}
              delay={0}
            />
            <PricingCard
              tier="Enterprise"
              price="$150K"
              description="For large-scale operations"
              features={[
                "Unlimited supplier monitoring",
                "Full competitive analysis",
                "Technology emergence alerts",
                "Custom risk scoring models",
                "Slack & email integration",
                "AI chatbot access",
                "Priority support",
              ]}
              highlighted
              delay={0.1}
            />
            <PricingCard
              tier="Strategic"
              price="Custom"
              description="For mission-critical supply chains"
              features={[
                "Everything in Enterprise",
                "Dedicated analyst support",
                "Custom ERP integrations",
                "Market entry recommendations",
                "On-premise deployment option",
                "SLA guarantees",
                "Executive briefings",
              ]}
              delay={0.2}
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient-gold">Industry Leaders</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what procurement professionals say about SupplyPulse AI
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Demo Request Section */}
      <section id="demo" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to <span className="text-gradient-cyber">Transform</span> Your Supply Chain?
              </h2>
              <p className="text-muted-foreground mb-8">
                Schedule a personalized demo with our team and see how SupplyPulse AI can help you:
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Reduce supplier-related disruptions by up to 70%",
                  "Save 20+ hours per week on supplier research",
                  "Identify risks 3-6 months before they materialize",
                  "Make data-driven procurement decisions",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyber" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>GDPR Ready</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card border-cyber/30">
                <CardHeader>
                  <CardTitle>Request a Demo</CardTitle>
                  <CardDescription>
                    Fill out the form and our team will reach out within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LeadCaptureForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">SupplyPulse AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time supplier intelligence for enterprise procurement teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SupplyPulse AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
