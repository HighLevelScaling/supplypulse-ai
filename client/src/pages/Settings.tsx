import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  Bell,
  Building2,
  Check,
  ChevronRight,
  Cloud,
  CreditCard,
  Database,
  Globe,
  Key,
  Lock,
  Mail,
  MessageSquare,
  Palette,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Slack,
  Sparkles,
  User,
  Users,
  Webhook,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Get alerts in your Slack channels",
    icon: Slack,
    connected: true,
    category: "communication",
  },
  {
    id: "email",
    name: "Email",
    description: "Email notifications and digests",
    icon: Mail,
    connected: true,
    category: "communication",
  },
  {
    id: "webhook",
    name: "Webhooks",
    description: "Custom webhook integrations",
    icon: Webhook,
    connected: false,
    category: "developer",
  },
  {
    id: "api",
    name: "API Access",
    description: "REST API for custom integrations",
    icon: Key,
    connected: true,
    category: "developer",
  },
];

const teamMembers = [
  { id: 1, name: "John Smith", email: "john@company.com", role: "admin", avatar: "JS" },
  { id: 2, name: "Sarah Johnson", email: "sarah@company.com", role: "editor", avatar: "SJ" },
  { id: 3, name: "Michael Chen", email: "michael@company.com", role: "viewer", avatar: "MC" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    weeklyDigest: true,
    supplierUpdates: true,
    marketNews: false,
    productUpdates: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/30 p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-background">
              <SettingsIcon className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-background">
              <Zap className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-background">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-background">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyber" />
                    Organization Settings
                  </CardTitle>
                  <CardDescription>Manage your organization profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" defaultValue="Acme Corporation" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select defaultValue="manufacturing">
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="america_new_york">
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america_new_york">America/New York (EST)</SelectItem>
                          <SelectItem value="america_los_angeles">America/Los Angeles (PST)</SelectItem>
                          <SelectItem value="europe_london">Europe/London (GMT)</SelectItem>
                          <SelectItem value="asia_tokyo">Asia/Tokyo (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="w-5 h-5 text-plasma" />
                    Display Preferences
                  </CardTitle>
                  <CardDescription>Customize your dashboard appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme for the dashboard</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact View</Label>
                      <p className="text-sm text-muted-foreground">Show more data in less space</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable UI animations and transitions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-end">
              <Button className="bg-gradient-cyber hover:opacity-90" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyber" />
                    Alert Preferences
                  </CardTitle>
                  <CardDescription>Configure when and how you receive alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Critical Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Immediate notifications for high-risk events
                      </p>
                    </div>
                    <Switch
                      checked={notifications.criticalAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, criticalAlerts: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Summary of supplier activities every Monday
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, weeklyDigest: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Supplier Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications when supplier data changes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.supplierUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, supplierUpdates: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Market News</Label>
                      <p className="text-sm text-muted-foreground">
                        Industry news and market updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketNews}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, marketNews: checked })
                      }
                    />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New features and platform updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.productUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, productUpdates: checked })
                      }
                    />
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-plasma" />
                    Delivery Channels
                  </CardTitle>
                  <CardDescription>Choose how to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-cyber/30 bg-cyber/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-cyber" />
                        <span className="font-medium">Email</span>
                        <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">john@company.com</p>
                    </div>
                    <div className="p-4 rounded-lg border border-plasma/30 bg-plasma/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Slack className="w-5 h-5 text-plasma" />
                        <span className="font-medium">Slack</span>
                        <Badge variant="outline" className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">#supply-chain-alerts</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Push</span>
                        <Badge variant="outline" className="ml-auto">
                          Disabled
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Browser notifications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-end">
              <Button className="bg-gradient-cyber hover:opacity-90" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyber" />
                    Connected Services
                  </CardTitle>
                  <CardDescription>Manage your third-party integrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-gradient-cyber">
                            <integration.icon className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{integration.name}</h4>
                              <Badge
                                variant="outline"
                                className={
                                  integration.connected
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : ""
                                }
                              >
                                {integration.connected ? "Connected" : "Not Connected"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            {integration.connected ? "Configure" : "Connect"}
                          </Button>
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
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="w-5 h-5 text-quantum" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Manage your API access tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">Production API Key</p>
                          <p className="text-sm text-muted-foreground">Created Jan 15, 2024</p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value="sk_live_••••••••••••••••••••••••"
                          readOnly
                          className="bg-background/50 font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          Reveal
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Key className="w-4 h-4 mr-2" />
                      Generate New Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="team" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyber" />
                        Team Members
                      </CardTitle>
                      <CardDescription>Manage who has access to your organization</CardDescription>
                    </div>
                    <Button className="bg-gradient-cyber hover:opacity-90">
                      <User className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-cyber flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-foreground">
                              {member.avatar}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select defaultValue={member.role}>
                            <SelectTrigger className="w-[120px] bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyber" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Protect your account and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[150px] bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>IP Allowlist</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
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
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-plasma" />
                    Password
                  </CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="bg-background/50" />
                  </div>
                  <Button className="bg-gradient-cyber hover:opacity-90">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
