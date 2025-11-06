import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Wind, 
  Droplets,
  Weight,
  Ruler,
  Brain,
  Eye,
  Ear,
  Smartphone,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const HealthTracking = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [vitals, setVitals] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    temperature: "",
    oxygenLevel: "",
    weight: "",
    height: "",
    glucose: "",
  });

  const [signs, setSigns] = useState({
    fatigue: false,
    headache: false,
    dizziness: false,
    chestPain: false,
    shortnessOfBreath: false,
    nausea: false,
    insomnia: false,
    jointPain: false,
  });

  const [mentalHealth, setMentalHealth] = useState({
    mood: "neutral",
    stressLevel: 5,
    anxietyLevel: 3,
    sleepHours: "",
  });

  const [analysis, setAnalysis] = useState<any>(null);

  const vitalMetrics = [
    { 
      key: "bloodPressure", 
      label: "Blood Pressure", 
      icon: Heart, 
      unit: "mmHg",
      normal: "120/80",
      hasTwoValues: true,
    },
    { 
      key: "heartRate", 
      label: "Heart Rate", 
      icon: Activity, 
      unit: "bpm",
      normal: "60-100",
    },
    { 
      key: "temperature", 
      label: "Temperature", 
      icon: Thermometer, 
      unit: "°F",
      normal: "98.6",
    },
    { 
      key: "oxygenLevel", 
      label: "Oxygen Level", 
      icon: Wind, 
      unit: "%",
      normal: "95-100",
    },
    { 
      key: "glucose", 
      label: "Blood Glucose", 
      icon: Droplets, 
      unit: "mg/dL",
      normal: "70-100",
    },
    { 
      key: "weight", 
      label: "Weight", 
      icon: Weight, 
      unit: "lbs",
      normal: "Varies",
    },
  ];

  const symptomsChecklist = [
    { key: "fatigue", label: "Fatigue/Tiredness", icon: Brain },
    { key: "headache", label: "Headache", icon: Brain },
    { key: "dizziness", label: "Dizziness", icon: Eye },
    { key: "chestPain", label: "Chest Pain", icon: Heart },
    { key: "shortnessOfBreath", label: "Shortness of Breath", icon: Wind },
    { key: "nausea", label: "Nausea", icon: Activity },
    { key: "insomnia", label: "Sleep Problems", icon: Brain },
    { key: "jointPain", label: "Joint Pain", icon: Activity },
  ];

  const analyzeHealth = () => {
    // Calculate health score based on vitals and symptoms
    let score = 100;
    const concerns = [];
    const recommendations = [];

    // Analyze blood pressure
    const systolic = parseInt(vitals.bloodPressureSystolic);
    const diastolic = parseInt(vitals.bloodPressureDiastolic);
    if (systolic > 130 || diastolic > 85) {
      score -= 15;
      concerns.push("Elevated blood pressure detected");
      recommendations.push("Monitor blood pressure regularly and consult your doctor");
    }

    // Analyze heart rate
    const heartRate = parseInt(vitals.heartRate);
    if (heartRate > 100 || heartRate < 60) {
      score -= 10;
      concerns.push(heartRate > 100 ? "Elevated heart rate" : "Low heart rate");
      recommendations.push("Consider cardiovascular evaluation");
    }

    // Analyze oxygen level
    const oxygen = parseInt(vitals.oxygenLevel);
    if (oxygen < 95) {
      score -= 20;
      concerns.push("Low oxygen saturation");
      recommendations.push("Seek immediate medical attention if below 90%");
    }

    // Analyze temperature
    const temp = parseFloat(vitals.temperature);
    if (temp > 99.5) {
      score -= 10;
      concerns.push("Elevated body temperature");
      recommendations.push("Monitor for fever and stay hydrated");
    }

    // Analyze glucose
    const glucose = parseInt(vitals.glucose);
    if (glucose > 100 || glucose < 70) {
      score -= 15;
      concerns.push(glucose > 100 ? "Elevated blood glucose" : "Low blood glucose");
      recommendations.push("Check with your doctor about diabetes screening");
    }

    // Analyze symptoms
    const activeSymptoms = Object.entries(signs).filter(([_, value]) => value).length;
    score -= activeSymptoms * 5;
    if (activeSymptoms > 0) {
      concerns.push(`${activeSymptoms} active symptoms reported`);
      recommendations.push("Track symptoms and consult healthcare provider if they persist");
    }

    // Analyze mental health
    if (mentalHealth.stressLevel > 7) {
      score -= 10;
      concerns.push("High stress levels");
      recommendations.push("Practice stress management techniques like meditation or exercise");
    }

    if (mentalHealth.anxietyLevel > 7) {
      score -= 10;
      concerns.push("Elevated anxiety");
      recommendations.push("Consider speaking with a mental health professional");
    }

    const sleepHours = parseFloat(mentalHealth.sleepHours);
    if (sleepHours < 6) {
      score -= 8;
      concerns.push("Insufficient sleep");
      recommendations.push("Aim for 7-9 hours of sleep per night");
    }

    score = Math.max(0, Math.min(100, score));

    setAnalysis({
      score,
      concerns,
      recommendations,
      timestamp: new Date().toISOString(),
    });

    // Save to localStorage
    localStorage.setItem("userHealthScore", score.toString());
    localStorage.setItem("lastHealthCheck", new Date().toISOString());

    toast.success("Health analysis completed!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-primary";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Attention";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Health Tracking</h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Vital Signs */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Vital Signs
            </CardTitle>
            <CardDescription>Record your current vital measurements</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Blood Pressure (Systolic)
              </Label>
              <Input
                type="number"
                placeholder="120"
                value={vitals.bloodPressureSystolic}
                onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Blood Pressure (Diastolic)
              </Label>
              <Input
                type="number"
                placeholder="80"
                value={vitals.bloodPressureDiastolic}
                onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Heart Rate (bpm)
              </Label>
              <Input
                type="number"
                placeholder="72"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temperature (°F)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="98.6"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Oxygen Level (%)
              </Label>
              <Input
                type="number"
                placeholder="98"
                value={vitals.oxygenLevel}
                onChange={(e) => setVitals({ ...vitals, oxygenLevel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Blood Glucose (mg/dL)
              </Label>
              <Input
                type="number"
                placeholder="90"
                value={vitals.glucose}
                onChange={(e) => setVitals({ ...vitals, glucose: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Weight (lbs)
              </Label>
              <Input
                type="number"
                placeholder="150"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Symptoms Checklist */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-warning" />
              Symptoms & Signs
            </CardTitle>
            <CardDescription>Check any symptoms you're currently experiencing</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {symptomsChecklist.map((symptom) => (
              <div
                key={symptom.key}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  signs[symptom.key as keyof typeof signs]
                    ? "border-warning bg-warning/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSigns({ ...signs, [symptom.key]: !signs[symptom.key as keyof typeof signs] })}
              >
                <div className="flex items-center gap-3">
                  <symptom.icon className="w-5 h-5" />
                  <span className="font-medium">{symptom.label}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="text-2xl">Additional Symptoms or Notes</CardTitle>
            <CardDescription>Describe any other symptoms or concerns</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe any symptoms, pain levels, or health concerns..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Mental Health */}
        <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Brain className="w-6 h-6 text-accent" />
              Mental Wellness
            </CardTitle>
            <CardDescription>Track your mental and emotional health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Current Mood</Label>
              <select
                className="w-full p-3 rounded-lg border border-border bg-background"
                value={mentalHealth.mood}
                onChange={(e) => setMentalHealth({ ...mentalHealth, mood: e.target.value })}
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="neutral">Neutral</option>
                <option value="low">Low</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Stress Level (1-10): {mentalHealth.stressLevel}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={mentalHealth.stressLevel}
                onChange={(e) => setMentalHealth({ ...mentalHealth, stressLevel: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Anxiety Level (1-10): {mentalHealth.anxietyLevel}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={mentalHealth.anxietyLevel}
                onChange={(e) => setMentalHealth({ ...mentalHealth, anxietyLevel: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Hours of Sleep (last night)</Label>
              <Input
                type="number"
                step="0.5"
                placeholder="7.5"
                value={mentalHealth.sleepHours}
                onChange={(e) => setMentalHealth({ ...mentalHealth, sleepHours: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            onClick={analyzeHealth}
            size="lg"
            className="h-14 px-12 text-lg font-semibold"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Analyze My Health
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <Card className="shadow-elevated animate-scale-in border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center justify-between">
                <span>Health Analysis</span>
                <span className={`${getScoreColor(analysis.score)} text-5xl font-bold`}>
                  {analysis.score}
                </span>
              </CardTitle>
              <CardDescription className="text-lg">
                Status: <span className={`font-bold ${getScoreColor(analysis.score)}`}>{getScoreLabel(analysis.score)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.concerns.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Health Concerns
                  </h3>
                  <ul className="space-y-2">
                    {analysis.concerns.map((concern: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-success/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default HealthTracking;
