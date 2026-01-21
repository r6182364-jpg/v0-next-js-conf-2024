export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  category: "single-line-diagram" | "layout" | "calculations" | "boq-bom" | "other";
  uploadedAt: Date;
  content?: string;
}

export type RiskLevel = "critical" | "high" | "medium" | "low";
export type IssueCategory = 
  | "string-sizing" 
  | "cable-sizing" 
  | "voltage-drop" 
  | "grounding" 
  | "protection" 
  | "material" 
  | "compliance" 
  | "layout";

export interface ReviewIssue {
  id: string;
  category: IssueCategory;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  codeReference: string;
  recommendation: string;
  location?: string;
}

export interface OptimizationSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  potentialSavings?: string;
  impact: "high" | "medium" | "low";
}

export interface ComplianceCheck {
  standard: string;
  status: "pass" | "fail" | "warning" | "not-applicable";
  details: string;
}

export interface DesignReview {
  id: string;
  projectName: string;
  reviewDate: Date;
  status: "pending" | "in-progress" | "completed";
  summary: {
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    complianceScore: number;
  };
  issues: ReviewIssue[];
  optimizations: OptimizationSuggestion[];
  compliance: ComplianceCheck[];
  aiNotes: string;
}
