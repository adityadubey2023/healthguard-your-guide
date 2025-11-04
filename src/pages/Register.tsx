import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Mail, Lock, Phone, Calendar, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    // Medical assessment
    bloodPressure: "",
    cholesterol: "",
    diabetes: "no",
    smoking: "no",
    exercise: "",
    diet: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Name must be at least 2 characters";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (currentStep === 2) {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        newErrors.phone = "Please enter a valid 10-digit phone number";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required";
      }
    }

    if (currentStep === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (currentStep === 4) {
      if (!formData.bloodPressure) {
        newErrors.bloodPressure = "Blood pressure is required";
      }
      if (!formData.cholesterol) {
        newErrors.cholesterol = "Cholesterol level is required";
      }
      if (!formData.exercise) {
        newErrors.exercise = "Exercise frequency is required";
      }
      if (!formData.diet) {
        newErrors.diet = "Diet quality is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    setIsLoading(true);

    // Calculate initial health score based on assessment
    const calculateHealthScore = () => {
      let score = 100;
      
      // Blood pressure impact
      const bp = formData.bloodPressure.toLowerCase();
      if (bp === "high") score -= 15;
      else if (bp === "prehypertension") score -= 8;
      
      // Cholesterol impact
      const chol = formData.cholesterol.toLowerCase();
      if (chol === "high") score -= 15;
      else if (chol === "borderline") score -= 8;
      
      // Diabetes impact
      if (formData.diabetes === "yes") score -= 10;
      
      // Smoking impact
      if (formData.smoking === "yes") score -= 20;
      
      // Exercise impact
      const ex = formData.exercise.toLowerCase();
      if (ex === "rarely") score -= 15;
      else if (ex === "sometimes") score -= 8;
      
      // Diet impact
      const diet = formData.diet.toLowerCase();
      if (diet === "poor") score -= 15;
      else if (diet === "average") score -= 8;
      
      return Math.max(0, score);
    };

    const healthScore = calculateHealthScore();
    localStorage.setItem("userHealthScore", healthScore.toString());
    localStorage.setItem("userName", formData.fullName);

    // Simulate API call
    setTimeout(() => {
      toast.success("Account created successfully!", {
        description: `Welcome to HealthGuard! Your initial health score is ${healthScore}/100`,
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1500);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-elevated animate-scale-in">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-card">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription className="text-base">
            Step {step} of 4 - {step === 1 ? "Basic Information" : step === 2 ? "Contact Details" : step === 3 ? "Security" : "Medical Assessment"}
          </CardDescription>
          <div className="flex gap-2 justify-center pt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-secondary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  {errors.fullName && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-base font-medium">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.dateOfBirth}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure" className="text-base font-medium">
                    Blood Pressure Status
                  </Label>
                  <select
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => updateFormData("bloodPressure", e.target.value)}
                    className="w-full h-12 text-base px-4 rounded-md border border-input bg-background"
                  >
                    <option value="">Select status</option>
                    <option value="normal">Normal (120/80 or below)</option>
                    <option value="prehypertension">Prehypertension (120-139/80-89)</option>
                    <option value="high">High (140/90 or above)</option>
                  </select>
                  {errors.bloodPressure && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.bloodPressure}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cholesterol" className="text-base font-medium">
                    Cholesterol Level
                  </Label>
                  <select
                    id="cholesterol"
                    value={formData.cholesterol}
                    onChange={(e) => updateFormData("cholesterol", e.target.value)}
                    className="w-full h-12 text-base px-4 rounded-md border border-input bg-background"
                  >
                    <option value="">Select level</option>
                    <option value="normal">Normal (Below 200 mg/dL)</option>
                    <option value="borderline">Borderline (200-239 mg/dL)</option>
                    <option value="high">High (240+ mg/dL)</option>
                  </select>
                  {errors.cholesterol && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.cholesterol}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Do you have diabetes?</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diabetes"
                        value="no"
                        checked={formData.diabetes === "no"}
                        onChange={(e) => updateFormData("diabetes", e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="text-base">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="diabetes"
                        value="yes"
                        checked={formData.diabetes === "yes"}
                        onChange={(e) => updateFormData("diabetes", e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="text-base">Yes</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Do you smoke?</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        value="no"
                        checked={formData.smoking === "no"}
                        onChange={(e) => updateFormData("smoking", e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="text-base">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="smoking"
                        value="yes"
                        checked={formData.smoking === "yes"}
                        onChange={(e) => updateFormData("smoking", e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="text-base">Yes</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exercise" className="text-base font-medium">
                    Exercise Frequency
                  </Label>
                  <select
                    id="exercise"
                    value={formData.exercise}
                    onChange={(e) => updateFormData("exercise", e.target.value)}
                    className="w-full h-12 text-base px-4 rounded-md border border-input bg-background"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily (5-7 days/week)</option>
                    <option value="regular">Regular (3-4 days/week)</option>
                    <option value="sometimes">Sometimes (1-2 days/week)</option>
                    <option value="rarely">Rarely (Less than once/week)</option>
                  </select>
                  {errors.exercise && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.exercise}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet" className="text-base font-medium">
                    Diet Quality
                  </Label>
                  <select
                    id="diet"
                    value={formData.diet}
                    onChange={(e) => updateFormData("diet", e.target.value)}
                    className="w-full h-12 text-base px-4 rounded-md border border-input bg-background"
                  >
                    <option value="">Select quality</option>
                    <option value="excellent">Excellent (Balanced, nutritious meals)</option>
                    <option value="good">Good (Mostly healthy choices)</option>
                    <option value="average">Average (Some unhealthy foods)</option>
                    <option value="poor">Poor (Mostly processed/fast food)</option>
                  </select>
                  {errors.diet && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.diet}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-14 text-lg font-semibold"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-14 text-lg font-semibold"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-14 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-base text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover font-semibold underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
