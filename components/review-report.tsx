"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
  Printer,
  Lightbulb,
  Shield,
  TrendingUp,
  FileText,
  Zap,
  Cable,
  CircuitBoard,
  Layers,
  Package,
  BookOpen,
} from "lucide-react";
import type { DesignReview, ReviewIssue, RiskLevel, IssueCategory } from "@/lib/types";

interface ReviewReportProps {
  review: DesignReview;
}

const riskLevelConfig: Record<RiskLevel, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  high: { icon: AlertTriangle, color: "text-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning))]/10" },
  medium: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
  low: { icon: Info, color: "text-muted-foreground", bg: "bg-muted" },
};

const categoryConfig: Record<IssueCategory, { icon: typeof Zap; label: string }> = {
  "string-sizing": { icon: Zap, label: "String Sizing" },
  "cable-sizing": { icon: Cable, label: "Cable Sizing" },
  "voltage-drop": { icon: TrendingUp, label: "Voltage Drop" },
  "grounding": { icon: CircuitBoard, label: "Grounding" },
  "protection": { icon: Shield, label: "Protection" },
  "material": { icon: Package, label: "Material" },
  "compliance": { icon: BookOpen, label: "Compliance" },
  "layout": { icon: Layers, label: "Layout" },
};

function IssueCard({ issue }: { issue: ReviewIssue }) {
  const risk = riskLevelConfig[issue.riskLevel];
  const category = categoryConfig[issue.category];
  const RiskIcon = risk.icon;
  const CategoryIcon = category.icon;

  return (
    <AccordionItem value={issue.id} className="border border-border rounded-lg mb-3 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
        <div className="flex items-center gap-4 text-left w-full">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${risk.bg}`}>
            <RiskIcon className={`h-5 w-5 ${risk.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs gap-1">
                <CategoryIcon className="h-3 w-3" />
                {category.label}
              </Badge>
              <Badge
                variant="secondary"
                className={`text-xs capitalize ${
                  issue.riskLevel === "critical" ? "bg-destructive/20 text-destructive" :
                  issue.riskLevel === "high" ? "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]" :
                  issue.riskLevel === "medium" ? "bg-primary/20 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}
              >
                {issue.riskLevel}
              </Badge>
            </div>
            <h4 className="text-sm font-medium text-foreground">{issue.title}</h4>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-4 pt-2">
          <div>
            <h5 className="text-xs font-medium uppercase text-muted-foreground mb-1">Description</h5>
            <p className="text-sm text-foreground">{issue.description}</p>
          </div>
          
          {issue.location && (
            <div>
              <h5 className="text-xs font-medium uppercase text-muted-foreground mb-1">Location</h5>
              <p className="text-sm text-foreground">{issue.location}</p>
            </div>
          )}
          
          <div>
            <h5 className="text-xs font-medium uppercase text-muted-foreground mb-1">Code Reference</h5>
            <Badge variant="outline" className="font-mono text-xs">
              {issue.codeReference}
            </Badge>
          </div>
          
          <div className="rounded-lg bg-[hsl(var(--success))]/10 p-4">
            <h5 className="flex items-center gap-2 text-xs font-medium uppercase text-[hsl(var(--success))] mb-2">
              <Lightbulb className="h-4 w-4" />
              Recommendation
            </h5>
            <p className="text-sm text-foreground">{issue.recommendation}</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ReviewReport({ review }: ReviewReportProps) {
  const [activeTab, setActiveTab] = useState<string>("issues");

  const criticalAndHighIssues = review.issues.filter(
    (i) => i.riskLevel === "critical" || i.riskLevel === "high"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Design Review Report</h2>
          <p className="text-muted-foreground">
            {review.projectName} - {review.reviewDate.toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-foreground">{review.summary.complianceScore}%</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                review.summary.complianceScore >= 90 ? "bg-[hsl(var(--success))]/20" :
                review.summary.complianceScore >= 70 ? "bg-[hsl(var(--warning))]/20" :
                "bg-destructive/20"
              }`}>
                <Shield className={`h-6 w-6 ${
                  review.summary.complianceScore >= 90 ? "text-[hsl(var(--success))]" :
                  review.summary.complianceScore >= 70 ? "text-[hsl(var(--warning))]" :
                  "text-destructive"
                }`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-destructive">{review.summary.criticalIssues}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-[hsl(var(--warning))]">{review.summary.highIssues}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-[hsl(var(--warning))]/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Medium Priority</p>
                <p className="text-2xl font-bold text-primary">{review.summary.mediumIssues}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Low Priority</p>
                <p className="text-2xl font-bold text-muted-foreground">{review.summary.lowIssues}</p>
              </div>
              <Info className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      {criticalAndHighIssues.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Immediate Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-4">
              This design has {criticalAndHighIssues.length} critical or high-priority issue(s) that must be addressed before implementation:
            </p>
            <ul className="space-y-2">
              {criticalAndHighIssues.map((issue) => (
                <li key={issue.id} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    issue.riskLevel === "critical" ? "bg-destructive" : "bg-[hsl(var(--warning))]"
                  }`} />
                  <span className="text-foreground">{issue.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{review.aiNotes}</p>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="issues" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Issues ({review.issues.length})
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Optimizations ({review.optimizations.length})
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <Shield className="h-4 w-4" />
            Compliance ({review.compliance.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Identified Issues</CardTitle>
              <CardDescription>
                Click on each issue for detailed information and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {review.issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Optimization Suggestions</CardTitle>
              <CardDescription>
                Recommendations for cost reduction, performance improvement, and sustainability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {review.optimizations.map((opt) => (
                  <div
                    key={opt.id}
                    className="rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {opt.category}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs capitalize ${
                                opt.impact === "high" ? "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]" :
                                opt.impact === "medium" ? "bg-primary/20 text-primary" :
                                "bg-muted text-muted-foreground"
                              }`}
                            >
                              {opt.impact} impact
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium text-foreground">{opt.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                        </div>
                      </div>
                      {opt.potentialSavings && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-muted-foreground">Potential Savings</p>
                          <p className="text-sm font-medium text-[hsl(var(--success))]">{opt.potentialSavings}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Standards Compliance</CardTitle>
              <CardDescription>
                Verification status against applicable codes and standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {review.compliance.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3">
                      {check.status === "pass" ? (
                        <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                      ) : check.status === "fail" ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : check.status === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                      ) : (
                        <Info className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{check.standard}</h4>
                        <p className="text-sm text-muted-foreground">{check.details}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`capitalize ${
                        check.status === "pass" ? "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]" :
                        check.status === "fail" ? "bg-destructive/20 text-destructive" :
                        check.status === "warning" ? "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {check.status === "not-applicable" ? "N/A" : check.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
