import { Button } from "@/components/ui/button";
import { Heart, Shield, Activity, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: "Health Tracking",
      description: "Monitor your health metrics and get personalized insights",
    },
    {
      icon: Shield,
      title: "Insurance Management",
      description: "Easily manage claims, expenses, and insurance information",
    },
    {
      icon: Users,
      title: "Find Doctors",
      description: "Locate and connect with healthcare providers near you",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-elevated">
              <Heart className="w-12 h-12 text-white" fill="white" />
            </div>
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Your Personal <span className="text-primary">Health</span> & <span className="text-secondary">Insurance</span> Assistant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              HealthGuard helps you manage your health, track vital metrics, and handle insurance seamlessly—all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              onClick={() => navigate("/register")}
              className="h-16 px-10 text-xl font-semibold"
            >
              Get Started
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-16 px-10 text-xl font-semibold"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-lg text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-center text-white shadow-elevated animate-scale-in">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust HealthGuard for their health and insurance needs.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="h-16 px-10 text-xl font-semibold bg-white text-primary hover:bg-white/90"
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
