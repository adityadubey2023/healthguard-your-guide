import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  previousScore?: number;
}

const HealthScoreCard = ({ score, previousScore }: HealthScoreCardProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayScore(Math.min(Math.round(increment * currentStep), score));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-score-excellent";
    if (s >= 60) return "text-score-good";
    if (s >= 40) return "text-score-moderate";
    if (s >= 20) return "text-score-poor";
    return "text-score-critical";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Moderate";
    if (s >= 20) return "Needs Attention";
    return "Critical";
  };

  const getScoreBgColor = (s: number) => {
    if (s >= 80) return "from-score-excellent/20 to-score-excellent/5";
    if (s >= 60) return "from-score-good/20 to-score-good/5";
    if (s >= 40) return "from-score-moderate/20 to-score-moderate/5";
    if (s >= 20) return "from-score-poor/20 to-score-poor/5";
    return "from-score-critical/20 to-score-critical/5";
  };

  const getStrokeColor = (s: number) => {
    if (s >= 80) return "#2daa5d";
    if (s >= 60) return "#7ac143";
    if (s >= 40) return "#f5c842";
    if (s >= 20) return "#f59e42";
    return "#e74c3c";
  };

  const getTrend = () => {
    if (!previousScore) return null;
    const diff = score - previousScore;
    if (diff > 0) return <TrendingUp className="w-5 h-5 text-secondary" />;
    if (diff < 0) return <TrendingDown className="w-5 h-5 text-destructive" />;
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  };

  const circumference = 2 * Math.PI * 85;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <Card className={`shadow-card border-2 bg-gradient-to-br ${getScoreBgColor(score)}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-2xl">
          <span className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Health Hazard Score
          </span>
          {getTrend()}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-8">
        <div className="relative w-56 h-56">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              opacity="0.3"
            />
            {/* Animated progress circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke={getStrokeColor(score)}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {displayScore}
            </span>
            <span className="text-lg text-muted-foreground mt-1">out of 100</span>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className={`text-2xl font-semibold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </div>
          <p className="text-base text-muted-foreground mt-2 max-w-sm">
            {score >= 80 && "Great job! Your health metrics are looking excellent."}
            {score >= 60 && score < 80 && "You're doing well! Keep up with healthy habits."}
            {score >= 40 && score < 60 && "There's room for improvement. Consider the recommendations below."}
            {score >= 20 && score < 40 && "Your health needs attention. Please review the action items."}
            {score < 20 && "Immediate attention needed. Please consult with a healthcare provider."}
          </p>
        </div>

        {previousScore && (
          <div className="mt-4 text-sm text-muted-foreground">
            Previous score: {previousScore} ({score - previousScore > 0 ? "+" : ""}{score - previousScore} points)
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;
