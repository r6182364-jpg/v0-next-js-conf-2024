"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileCheck, 
  AlertTriangle, 
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import type { DesignReview } from "@/lib/types";

interface DashboardProps {
  onStartReview: () => void;
  recentReviews: DesignReview[];
}

const stats = [
  {
    title: "Reviews Completed",
    value: "24",
    change: "+12%",
    icon: FileCheck,
    trend: "up",
  },
  {
    title: "Compliance Rate",
    value: "94%",
    change: "+3%",
    icon: Shield,
    trend: "up",
  },
  {
    title: "Issues Identified",
    value: "156",
    change: "-8%",
    icon: AlertTriangle,
    trend: "down",
  },
  {
    title: "Time Saved",
    value: "72h",
    change: "+24%",
    icon: TrendingUp,
    trend: "up",
  },
];

const checkCategories = [
  { name: "String Sizing & MPPT", description: "Verify string voltage, current limits, and MPPT compatibility" },
  { name: "Cable Sizing", description: "Check current-carrying capacity and voltage drop calculations" },
  { name: "Grounding & Protection", description: "Validate grounding system and protection device logic" },
  { name: "Material Verification", description: "Cross-reference BoQ/BoM with design specifications" },
  { name: "Standards Compliance", description: "Check against IEC, SBC, SEC, MOMRA, WERA requirements" },
];

export function Dashboard({ onStartReview, recentReviews }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to Smart Guardian - Your AI-assisted PV design verification system
          </p>
        </div>
        <Button onClick={onStartReview} className="gap-2">
          Start New Review
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Verification Capabilities</CardTitle>
            <CardDescription>
              Comprehensive rule-based checks enhanced with AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkCategories.map((category) => (
                <div key={category.name} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[hsl(var(--success))]" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Reviews</CardTitle>
            <CardDescription>
              Latest design verification activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
                <h4 className="text-sm font-medium text-foreground">No reviews yet</h4>
                <p className="text-sm text-muted-foreground">
                  Start your first design review to see activity here
                </p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={onStartReview}>
                  Start Review
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        review.status === "completed" ? "bg-[hsl(var(--success))]" :
                        review.status === "in-progress" ? "bg-[hsl(var(--warning))]" :
                        "bg-muted-foreground"
                      }`} />
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{review.projectName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {review.reviewDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {review.summary.complianceScore}% Compliance
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.summary.totalIssues} issues found
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/50 bg-gradient-to-r from-primary/10 to-transparent">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Ready to Review Your Design?</h3>
              <p className="text-sm text-muted-foreground">
                Upload your PV system design package for comprehensive AI-assisted verification
              </p>
            </div>
          </div>
          <Button onClick={onStartReview} size="lg" className="gap-2">
            Start New Review
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
