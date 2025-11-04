import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

type Update = {
  type: "improvement" | "warning" | "achievement";
  title: string;
  message: string;
  icon: any;
};

const MedicalUpdatesPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(0);

  const updates: Update[] = [
    {
      type: "improvement",
      title: "Health Score Improved!",
      message: "Your health score increased by 4 points this week. Keep up the great work!",
      icon: TrendingUp,
    },
    {
      type: "achievement",
      title: "Milestone Reached",
      message: "You've completed 7 days of daily health quizzes in a row!",
      icon: CheckCircle,
    },
    {
      type: "warning",
      title: "Checkup Reminder",
      message: "It's been 6 months since your last physical. Consider scheduling an appointment.",
      icon: AlertCircle,
    },
  ];

  useEffect(() => {
    // Show popup 2 seconds after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible && currentUpdate < updates.length - 1) {
      // Auto-rotate through updates every 5 seconds
      const timer = setTimeout(() => {
        setCurrentUpdate((prev) => prev + 1);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, currentUpdate, updates.length]);

  if (!isVisible) return null;

  const update = updates[currentUpdate];
  const Icon = update.icon;

  const getColor = () => {
    switch (update.type) {
      case "improvement":
        return "text-secondary";
      case "achievement":
        return "text-primary";
      case "warning":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  const getBgColor = () => {
    switch (update.type) {
      case "improvement":
        return "bg-secondary/10";
      case "achievement":
        return "bg-primary/10";
      case "warning":
        return "bg-warning/10";
      default:
        return "bg-primary/10";
    }
  };

  return (
    <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
      <Card className="w-96 shadow-elevated">
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${getColor()}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{update.title}</CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 -mt-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground mb-4">{update.message}</p>
          <div className="flex gap-2 justify-center">
            {updates.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentUpdate ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalUpdatesPopup;
