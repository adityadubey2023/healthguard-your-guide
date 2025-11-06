import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  DollarSign, 
  FileText, 
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Claim = {
  id: string;
  date: string;
  provider: string;
  service: string;
  amount: number;
  status: "pending" | "approved" | "denied";
  claimNumber: string;
};

type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  coveredByInsurance: boolean;
};

const InsuranceManagement = () => {
  const navigate = useNavigate();
  
  const [insuranceInfo, setInsuranceInfo] = useState({
    provider: "HealthCare Plus",
    policyNumber: "HCP-2024-789456",
    groupNumber: "GRP-456789",
    memberID: "MEM-123456",
    planType: "PPO Gold",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
  });

  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "1",
      date: "2024-01-15",
      provider: "City Medical Center",
      service: "Annual Physical Exam",
      amount: 250,
      status: "approved",
      claimNumber: "CLM-2024-001",
    },
    {
      id: "2",
      date: "2024-02-03",
      provider: "Downtown Pharmacy",
      service: "Prescription Medication",
      amount: 85,
      status: "approved",
      claimNumber: "CLM-2024-002",
    },
    {
      id: "3",
      date: "2024-03-10",
      provider: "Wellness Lab",
      service: "Blood Work",
      amount: 180,
      status: "pending",
      claimNumber: "CLM-2024-003",
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      date: "2024-01-15",
      category: "Doctor Visit",
      description: "Annual checkup",
      amount: 250,
      coveredByInsurance: true,
    },
    {
      id: "2",
      date: "2024-02-03",
      category: "Medication",
      description: "Blood pressure medication",
      amount: 85,
      coveredByInsurance: true,
    },
    {
      id: "3",
      date: "2024-02-20",
      category: "Supplements",
      description: "Vitamin D",
      amount: 25,
      coveredByInsurance: false,
    },
  ]);

  const [showNewClaimForm, setShowNewClaimForm] = useState(false);
  const [showNewExpenseForm, setShowNewExpenseForm] = useState(false);

  const [newClaim, setNewClaim] = useState({
    provider: "",
    service: "",
    amount: "",
    date: "",
  });

  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    coveredByInsurance: false,
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const coveredExpenses = expenses.filter(e => e.coveredByInsurance).reduce((sum, exp) => sum + exp.amount, 0);
  const outOfPocket = totalExpenses - coveredExpenses;

  const pendingClaims = claims.filter(c => c.status === "pending").length;
  const approvedClaims = claims.filter(c => c.status === "approved").length;

  const handleSubmitClaim = () => {
    if (!newClaim.provider || !newClaim.service || !newClaim.amount || !newClaim.date) {
      toast.error("Please fill in all fields");
      return;
    }

    const claim: Claim = {
      id: (claims.length + 1).toString(),
      date: newClaim.date,
      provider: newClaim.provider,
      service: newClaim.service,
      amount: parseFloat(newClaim.amount),
      status: "pending",
      claimNumber: `CLM-2024-${String(claims.length + 1).padStart(3, '0')}`,
    };

    setClaims([...claims, claim]);
    setNewClaim({ provider: "", service: "", amount: "", date: "" });
    setShowNewClaimForm(false);
    toast.success("Claim submitted successfully!");
  };

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.description || !newExpense.amount || !newExpense.date) {
      toast.error("Please fill in all fields");
      return;
    }

    const expense: Expense = {
      id: (expenses.length + 1).toString(),
      date: newExpense.date,
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      coveredByInsurance: newExpense.coveredByInsurance,
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ category: "", description: "", amount: "", date: "", coveredByInsurance: false });
    setShowNewExpenseForm(false);
    toast.success("Expense added successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-success bg-success/10";
      case "pending":
        return "text-warning bg-warning/10";
      case "denied":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Insurance Management
            </h1>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Insurance Overview */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Your Insurance Plan</CardTitle>
            <CardDescription>Current coverage information</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">Provider</Label>
              <p className="text-lg font-semibold">{insuranceInfo.provider}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Policy Number</Label>
              <p className="text-lg font-semibold">{insuranceInfo.policyNumber}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Member ID</Label>
              <p className="text-lg font-semibold">{insuranceInfo.memberID}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Plan Type</Label>
              <p className="text-lg font-semibold">{insuranceInfo.planType}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Covered by Insurance</p>
                  <p className="text-2xl font-bold">${coveredExpenses.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Out of Pocket</p>
                  <p className="text-2xl font-bold">${outOfPocket.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                  <p className="text-2xl font-bold">{pendingClaims}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Claims and Expenses */}
        <Tabs defaultValue="claims" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="claims" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Insurance Claims</h2>
              <Button onClick={() => setShowNewClaimForm(!showNewClaimForm)}>
                <Plus className="w-4 h-4 mr-2" />
                File New Claim
              </Button>
            </div>

            {showNewClaimForm && (
              <Card className="shadow-card animate-scale-in">
                <CardHeader>
                  <CardTitle>New Claim</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newClaim.date}
                        onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Input
                        placeholder="Healthcare provider name"
                        value={newClaim.provider}
                        onChange={(e) => setNewClaim({ ...newClaim, provider: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Input
                        placeholder="Type of service"
                        value={newClaim.service}
                        onChange={(e) => setNewClaim({ ...newClaim, service: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newClaim.amount}
                        onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowNewClaimForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitClaim}>Submit Claim</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {claims.map((claim) => (
                <Card key={claim.id} className="shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-lg">{claim.service}</span>
                        </div>
                        <p className="text-muted-foreground">{claim.provider}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(claim.date).toLocaleDateString()}
                          </span>
                          <span>Claim #{claim.claimNumber}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-2xl font-bold">${claim.amount.toFixed(2)}</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Healthcare Expenses</h2>
              <Button onClick={() => setShowNewExpenseForm(!showNewExpenseForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>

            {showNewExpenseForm && (
              <Card className="shadow-card animate-scale-in">
                <CardHeader>
                  <CardTitle>New Expense</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        className="w-full p-3 rounded-lg border border-border bg-background"
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        <option value="Doctor Visit">Doctor Visit</option>
                        <option value="Medication">Medication</option>
                        <option value="Lab Tests">Lab Tests</option>
                        <option value="Supplements">Supplements</option>
                        <option value="Therapy">Therapy</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Brief description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="covered"
                      checked={newExpense.coveredByInsurance}
                      onChange={(e) => setNewExpense({ ...newExpense, coveredByInsurance: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="covered">Covered by insurance</Label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowNewExpenseForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddExpense}>Add Expense</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {expenses.map((expense) => (
                <Card key={expense.id} className="shadow-card hover:shadow-elevated transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-lg">{expense.category}</span>
                        </div>
                        <p className="text-muted-foreground">{expense.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
                        {expense.coveredByInsurance ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium text-success bg-success/10 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Insured
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm font-medium text-muted bg-muted/50">
                            Out of Pocket
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default InsuranceManagement;
