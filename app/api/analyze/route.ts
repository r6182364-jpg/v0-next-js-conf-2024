import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const issueSchema = z.object({
  category: z.enum([
    "string-sizing",
    "cable-sizing",
    "voltage-drop",
    "grounding",
    "protection",
    "material",
    "compliance",
    "layout",
  ]),
  title: z.string(),
  description: z.string(),
  riskLevel: z.enum(["critical", "high", "medium", "low"]),
  codeReference: z.string(),
  recommendation: z.string(),
  location: z.string().optional(),
});

const optimizationSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  potentialSavings: z.string().optional(),
  impact: z.enum(["high", "medium", "low"]),
});

const complianceSchema = z.object({
  standard: z.string(),
  status: z.enum(["pass", "fail", "warning", "not-applicable"]),
  details: z.string(),
});

const reviewSchema = z.object({
  issues: z.array(issueSchema).describe("List of identified design issues"),
  optimizations: z.array(optimizationSchema).describe("List of optimization suggestions"),
  compliance: z.array(complianceSchema).describe("Compliance check results for each standard"),
  aiNotes: z.string().describe("Overall AI assessment and summary notes"),
});

export async function POST(req: Request) {
  try {
    const { files, projectName } = await req.json();

    const fileDescriptions = files
      .map(
        (f: { name: string; category: string }) =>
          `- ${f.name} (Category: ${f.category})`
      )
      .join("\n");

    const { object } = await generateObject({
      model: "anthropic/claude-sonnet-4.5",
      schema: reviewSchema,
      prompt: `You are an expert photovoltaic (PV) system design reviewer with comprehensive knowledge of:
- IEC 62548:2016 (PV array design requirements)
- Saudi Building Code (SBC 401)
- SEC Technical Standards
- MOMRA Regulations
- WERA Guidelines

Analyze the following PV system design package and provide a detailed review:

Project: ${projectName || "PV System Design"}

Uploaded Documents:
${fileDescriptions}

Perform a thorough review checking for:
1. String sizing and MPPT compatibility (Voc, Vmp, Isc, Imp at temperature extremes)
2. Cable sizing and current-carrying capacity
3. Voltage drop calculations (should not exceed 3% for DC, 2% for AC)
4. Grounding system design and equipment grounding conductors
5. Protection device coordination (fuses, breakers, surge protection)
6. Material specifications and BoQ/BoM consistency
7. Compliance with all relevant standards (IEC, SBC, SEC, MOMRA, WERA)
8. Layout optimization and maintenance access

Generate realistic issues that could be found in a typical PV design review, with specific code references and actionable recommendations. Include a mix of critical, high, medium, and low severity issues.

Also provide optimization suggestions for cost reduction, performance improvement, and sustainability.`,
      maxOutputTokens: 4000,
    });

    const summary = {
      totalIssues: object.issues.length,
      criticalIssues: object.issues.filter((i) => i.riskLevel === "critical").length,
      highIssues: object.issues.filter((i) => i.riskLevel === "high").length,
      mediumIssues: object.issues.filter((i) => i.riskLevel === "medium").length,
      lowIssues: object.issues.filter((i) => i.riskLevel === "low").length,
      complianceScore: calculateComplianceScore(object.compliance),
    };

    return Response.json({
      id: crypto.randomUUID(),
      projectName: projectName || "PV System Design",
      reviewDate: new Date().toISOString(),
      status: "completed",
      summary,
      issues: object.issues.map((issue, index) => ({
        ...issue,
        id: `issue-${index + 1}`,
      })),
      optimizations: object.optimizations.map((opt, index) => ({
        ...opt,
        id: `opt-${index + 1}`,
      })),
      compliance: object.compliance,
      aiNotes: object.aiNotes,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze design" },
      { status: 500 }
    );
  }
}

function calculateComplianceScore(
  compliance: { status: "pass" | "fail" | "warning" | "not-applicable" }[]
): number {
  const applicable = compliance.filter((c) => c.status !== "not-applicable");
  if (applicable.length === 0) return 100;

  const scores = applicable.map((c) => {
    switch (c.status) {
      case "pass":
        return 100;
      case "warning":
        return 70;
      case "fail":
        return 0;
      default:
        return 100;
    }
  });

  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
