"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  ImageIcon,
  X,
  CheckCircle2,
  Loader2,
  Zap,
  AlertCircle,
} from "lucide-react";
import type { UploadedFile, DesignReview } from "@/lib/types";

interface FileUploadProps {
  uploadedFiles: UploadedFile[];
  onFilesUploaded: (files: UploadedFile[]) => void;
  onAnalysisComplete: (review: DesignReview) => void;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
}

const fileCategories = [
  { value: "single-line-diagram", label: "Single-Line Diagram" },
  { value: "layout", label: "Layout Drawing" },
  { value: "calculations", label: "Calculations" },
  { value: "boq-bom", label: "BoQ/BoM" },
  { value: "other", label: "Other" },
];

const getFileIcon = (type: string) => {
  if (type.includes("image")) return ImageIcon;
  if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return FileSpreadsheet;
  return FileText;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function FileUpload({
  uploadedFiles,
  onFilesUploaded,
  onAnalysisComplete,
  onStartAnalysis,
  isAnalyzing,
}: FileUploadProps) {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        category: "other" as const,
        uploadedAt: new Date(),
      }));
      onFilesUploaded([...uploadedFiles, ...newFiles]);
    },
    [uploadedFiles, onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".dwg", ".dxf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
  });

  const updateFileCategory = (fileId: string, category: UploadedFile["category"]) => {
    const updated = uploadedFiles.map((f) =>
      f.id === fileId ? { ...f, category } : f
    );
    onFilesUploaded(updated);
  };

  const removeFile = (fileId: string) => {
    onFilesUploaded(uploadedFiles.filter((f) => f.id !== fileId));
  };

  const startAnalysis = async () => {
    onStartAnalysis();
    
    const stages = [
      { stage: "Parsing design documents...", progress: 15 },
      { stage: "Extracting technical parameters...", progress: 30 },
      { stage: "Validating string sizing and MPPT limits...", progress: 45 },
      { stage: "Checking cable sizing and voltage drop...", progress: 60 },
      { stage: "Verifying grounding and protection logic...", progress: 75 },
      { stage: "Cross-referencing standards compliance...", progress: 85 },
      { stage: "Generating recommendations...", progress: 95 },
      { stage: "Finalizing report...", progress: 100 },
    ];

    for (const { stage, progress } of stages) {
      setAnalysisStage(stage);
      setAnalysisProgress(progress);
      await new Promise((r) => setTimeout(r, 800));
    }

    const mockReview: DesignReview = {
      id: crypto.randomUUID(),
      projectName: uploadedFiles[0]?.name.split(".")[0] || "PV System Design",
      reviewDate: new Date(),
      status: "completed",
      summary: {
        totalIssues: 8,
        criticalIssues: 1,
        highIssues: 2,
        mediumIssues: 3,
        lowIssues: 2,
        complianceScore: 87,
      },
      issues: [
        {
          id: "1",
          category: "string-sizing",
          title: "String Voltage Exceeds MPPT Maximum",
          description: "String #3 calculated Voc at -10°C (548V) exceeds the inverter MPPT maximum voltage of 520V.",
          riskLevel: "critical",
          codeReference: "IEC 62548:2016 Section 5.2",
          recommendation: "Reduce the number of modules per string from 14 to 13 to ensure Voc remains within MPPT operating range.",
          location: "Array Zone B, String 3",
        },
        {
          id: "2",
          category: "cable-sizing",
          title: "DC Cable Undersized for Current Load",
          description: "4mm² DC cable specified for string current of 11.2A exceeds 80% of cable ampacity at 45°C ambient.",
          riskLevel: "high",
          codeReference: "SBC 401 Section 6.3.2",
          recommendation: "Upgrade DC string cables from 4mm² to 6mm² to maintain adequate safety margin.",
          location: "DC Main Distribution",
        },
        {
          id: "3",
          category: "voltage-drop",
          title: "AC Cable Voltage Drop Above Threshold",
          description: "Calculated voltage drop of 3.8% on AC feeder cable exceeds the 3% recommended limit.",
          riskLevel: "high",
          codeReference: "SEC Technical Standards 2.4.1",
          recommendation: "Increase AC cable cross-section from 35mm² to 50mm² or reduce cable run length.",
          location: "Inverter to Distribution Panel",
        },
        {
          id: "4",
          category: "grounding",
          title: "Missing Equipment Grounding Conductor",
          description: "Module mounting structure grounding path not clearly indicated in layout drawing.",
          riskLevel: "medium",
          codeReference: "IEC 62548:2016 Section 7.4",
          recommendation: "Add explicit grounding conductor routing from mounting structures to main grounding bus.",
          location: "Module Mounting System",
        },
        {
          id: "5",
          category: "protection",
          title: "String Fuse Rating Review Required",
          description: "15A string fuses specified may not coordinate properly with module Isc of 11.2A.",
          riskLevel: "medium",
          codeReference: "IEC 62548:2016 Section 6.2.3",
          recommendation: "Verify fuse rating per 1.56 × Isc rule; consider 20A fuses for proper coordination.",
          location: "String Combiner Box",
        },
        {
          id: "6",
          category: "material",
          title: "BoM Quantity Discrepancy",
          description: "Layout shows 280 modules but BoM specifies 270 modules.",
          riskLevel: "medium",
          codeReference: "Project Documentation Standards",
          recommendation: "Reconcile module count between layout drawing and bill of materials.",
          location: "BoM Document",
        },
        {
          id: "7",
          category: "compliance",
          title: "Missing MOMRA Permit Reference",
          description: "Design package does not include reference to MOMRA building permit requirements.",
          riskLevel: "low",
          codeReference: "MOMRA Regulation 2.1",
          recommendation: "Add MOMRA permit application reference and structural load calculations to documentation.",
          location: "Documentation Package",
        },
        {
          id: "8",
          category: "layout",
          title: "Maintenance Access Path Below Standard",
          description: "Inter-row spacing of 0.8m may restrict maintenance access for cleaning equipment.",
          riskLevel: "low",
          codeReference: "Best Practice Guidelines",
          recommendation: "Consider increasing inter-row spacing to 1.0m minimum for improved maintenance access.",
          location: "Array Layout",
        },
      ],
      optimizations: [
        {
          id: "opt1",
          category: "Performance",
          title: "Optimize Tilt Angle",
          description: "Current 25° tilt could be adjusted to 23° for this latitude to increase annual yield by approximately 1.5%.",
          potentialSavings: "~2,400 kWh/year",
          impact: "medium",
        },
        {
          id: "opt2",
          category: "Cost",
          title: "Cable Route Optimization",
          description: "Relocating combiner box 15m closer to inverter could reduce DC cable requirements by 30%.",
          potentialSavings: "~$2,500 material cost",
          impact: "high",
        },
        {
          id: "opt3",
          category: "Sustainability",
          title: "Consider Bifacial Modules",
          description: "Site conditions with light-colored ground cover could benefit from bifacial modules with 5-10% additional yield.",
          potentialSavings: "5-10% energy gain",
          impact: "high",
        },
      ],
      compliance: [
        { standard: "IEC 62548:2016", status: "warning", details: "Minor issues in string sizing and grounding sections" },
        { standard: "SBC 401", status: "warning", details: "Cable sizing requires revision for full compliance" },
        { standard: "SEC Technical Standards", status: "fail", details: "Voltage drop exceeds specified limits" },
        { standard: "MOMRA Regulations", status: "warning", details: "Documentation reference missing" },
        { standard: "WERA Guidelines", status: "pass", details: "Water efficiency measures not applicable for this installation" },
      ],
      aiNotes: "This design demonstrates generally sound engineering practices but requires attention to several critical and high-priority items before implementation. The string voltage calculation error (Issue #1) is the most urgent concern and must be addressed to prevent potential equipment damage. Cable sizing issues should be resolved to ensure long-term reliability and code compliance. The optimization suggestions could provide significant cost and performance benefits worth considering during the revision phase.",
    };

    onAnalysisComplete(mockReview);
  };

  const canStartAnalysis = uploadedFiles.length > 0 && !isAnalyzing;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Upload Design Package</h2>
        <p className="text-muted-foreground">
          Upload your PV system design documents for AI-assisted review
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Design Documents</CardTitle>
              <CardDescription>
                Supported formats: PDF, DWG, DXF, PNG, JPG, XLSX, CSV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer
                  ${isDragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className={`h-12 w-12 mb-4 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="text-lg font-medium text-foreground mb-1">
                  {isDragActive ? "Drop files here" : "Drag & drop files"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse your computer
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Single-Line Diagrams", "Layouts", "Calculations", "BoQ/BoM"].map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {uploadedFiles.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Uploaded Files ({uploadedFiles.length})</CardTitle>
                <CardDescription>
                  Categorize your files for better analysis accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-background p-4"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                        <Select
                          value={file.category}
                          onValueChange={(value) => updateFileCategory(file.id, value as UploadedFile["category"])}
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fileCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Analysis Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAnalyzing ? (
                <>
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    <span className="text-sm font-medium text-foreground">Analyzing...</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">{analysisStage}</p>
                </>
              ) : uploadedFiles.length === 0 ? (
                <div className="flex flex-col items-center py-4 text-center">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Upload at least one design document to start analysis
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <CheckCircle2 className="h-10 w-10 text-[hsl(var(--success))] mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    {uploadedFiles.length} file(s) ready
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click below to start AI analysis
                  </p>
                </div>
              )}
              
              <Button
                onClick={startAnalysis}
                disabled={!canStartAnalysis}
                className="w-full gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">What We Check</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {[
                  "String sizing & MPPT limits",
                  "Cable sizing & voltage drop",
                  "Grounding & protection logic",
                  "IEC/SBC/SEC compliance",
                  "BoQ/BoM consistency",
                  "Material specifications",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
