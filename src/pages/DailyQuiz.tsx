import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    question: "How many hours did you sleep last night?",
    options: ["Less than 5", "5-6 hours", "7-8 hours", "More than 8"],
    scores: [1, 2, 4, 3],
  },
  {
    question: "Did you exercise today?",
    options: ["No exercise", "Light (10-20 min)", "Moderate (30-45 min)", "Intense (60+ min)"],
    scores: [1, 2, 3, 4],
  },
  {
    question: "How would you rate your stress level today?",
    options: ["Very High", "High", "Moderate", "Low"],
    scores: [1, 2, 3, 4],
  },
  {
    question: "How many meals did you eat today?",
    options: ["1 meal", "2 meals", "3 meals", "4+ meals"],
    scores: [2, 3, 4, 3],
  },
  {
    question: "Did you drink enough water today? (8+ glasses)",
    options: ["No water", "1-3 glasses", "4-7 glasses", "8+ glasses"],
    scores: [1, 2, 3, 4],
  },
  {
    question: "How is your mood today?",
    options: ["Poor", "Fair", "Good", "Excellent"],
    scores: [1, 2, 3, 4],
  },
  {
    question: "Did you take your prescribed medications?",
    options: ["No medications", "Missed some", "Took some", "Took all"],
    scores: [4, 1, 2, 4],
  },
  {
    question: "How much screen time did you have today?",
    options: ["8+ hours", "5-7 hours", "3-4 hours", "Less than 3"],
    scores: [1, 2, 3, 4],
  },
];

const DailyQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, questions[currentQuestion].scores[optionIndex]];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      const maxScore = questions.length * 4;
      const percentage = Math.round((totalScore / maxScore) * 100);
      
      localStorage.setItem("dailyQuizScore", percentage.toString());
      localStorage.setItem("lastQuizDate", new Date().toDateString());
      
      setTimeout(() => {
        setCompleted(true);
        toast.success("Quiz completed!", {
          description: `Your daily health score: ${percentage}/100`,
        });
      }, 300);
    }
  };

  if (completed) {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 4;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-elevated animate-scale-in">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-card mb-4 animate-pulse-soft">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl mb-4">Quiz Completed!</CardTitle>
            <p className="text-2xl font-bold text-primary">
              Your Score: {percentage}/100
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Recommendations:</h3>
              <ul className="space-y-2 text-base">
                {percentage < 50 && (
                  <>
                    <li>• Prioritize getting 7-8 hours of sleep</li>
                    <li>• Increase daily water intake</li>
                    <li>• Add 30 minutes of exercise to your routine</li>
                    <li>• Consider stress management techniques</li>
                  </>
                )}
                {percentage >= 50 && percentage < 75 && (
                  <>
                    <li>• Maintain your current healthy habits</li>
                    <li>• Try to improve sleep consistency</li>
                    <li>• Increase exercise duration slightly</li>
                    <li>• Keep hydration levels up</li>
                  </>
                )}
                {percentage >= 75 && (
                  <>
                    <li>• Excellent work! Keep up the great habits</li>
                    <li>• Continue your exercise routine</li>
                    <li>• Maintain your healthy sleep schedule</li>
                    <li>• You're a health champion!</li>
                  </>
                )}
              </ul>
            </div>
            
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full h-14 text-lg font-semibold"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-elevated animate-fade-in">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Daily Health Quiz</CardTitle>
                <span className="text-lg font-semibold text-muted-foreground">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="animate-fade-in" key={currentQuestion}>
              <h3 className="text-2xl font-semibold mb-6">
                {questions[currentQuestion].question}
              </h3>
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnswer(index)}
                    className="h-auto py-6 px-6 text-lg text-left justify-start hover:bg-primary/10 hover:border-primary transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyQuiz;
