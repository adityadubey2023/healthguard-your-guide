import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HealthScoreCard from "@/components/HealthScoreCard";
import Chatbot from "@/components/Chatbot";
import MedicalUpdatesPopup from "@/components/MedicalUpdatesPopup";
import { 
  Heart, 
  FileText, 
  MapPin, 
  Shield, 
  RefreshCw, 
  Bell, 
  Settings, 
  LogOut,
  Activity,
  Stethoscope,
  Pill
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("John");
  const [healthScore, setHealthScore] = useState(72);
  const previousScore = 68;

  useEffect(() => {
    const storedScore = localStorage.getItem("userHealthScore");
    const storedName = localStorage.getItem("userName");
    if (storedScore) setHealthScore(parseInt(storedScore));
    if (storedName) setUserName(storedName.split(" ")[0]);
  }, []);

  const quickStats = [
    {
      label: "BMI Status",
      value: "Normal",
      icon: Activity,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Blood Pressure",
      value: "120/80",
      icon: Heart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Last Checkup",
      value: "2 weeks ago",
      icon: Stethoscope,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Active Medications",
      value: "3",
      icon: Pill,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const primaryConcerns = [
    "High cholesterol levels detected",
    "Blood pressure trending upward",
    "Overdue for annual physical",
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleRefresh = () => {
    toast.info("Refreshing health data...");
    // Simulate refresh
    setTimeout(() => {
      toast.success("Health data updated");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-card">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">HealthGuard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Health Score Section */}
          <div className="animate-slide-up">
            <HealthScoreCard score={healthScore} previousScore={previousScore} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {quickStats.map((stat, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Primary Concerns */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-2xl">Primary Health Concerns</CardTitle>
              <CardDescription className="text-base">
                Items that need your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {primaryConcerns.map((concern, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <span className="text-base">{concern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate("/health-tracking")}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors group-hover:scale-110">
                    <Activity className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Health Tracking</h3>
                    <p className="text-muted-foreground">Track vitals and symptoms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate("/daily-quiz")}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:scale-110">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Daily Health Quiz</h3>
                    <p className="text-muted-foreground">Take today's health assessment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate("/find-doctors")}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors group-hover:scale-110">
                    <MapPin className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Find Doctors</h3>
                    <p className="text-muted-foreground">Locate nearby healthcare providers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer group"
              onClick={() => navigate("/insurance")}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors group-hover:scale-110">
                    <Shield className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Insurance Assistant</h3>
                    <p className="text-muted-foreground">Manage claims and expenses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refresh Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleRefresh}
              size="lg"
              className="h-14 px-8 text-lg font-semibold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Health Data
            </Button>
          </div>
        </div>
      </main>

      <Chatbot />
      <MedicalUpdatesPopup />
    </div>
  );
};

export default Dashboard;
