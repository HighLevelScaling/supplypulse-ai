import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import SupplierDetail from "./pages/SupplierDetail";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Network from "./pages/Network";
import Competitors from "./pages/Competitors";
import Reports from "./pages/Reports";
import Chat from "./pages/Chat";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={Home} />
      
      {/* Dashboard pages (protected) */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/suppliers/:id" component={SupplierDetail} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/network" component={Network} />
      <Route path="/competitors" component={Competitors} />
      <Route path="/reports" component={Reports} />
      <Route path="/chat" component={Chat} />
      <Route path="/leads" component={Leads} />
      <Route path="/settings" component={Settings} />
      
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
