"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Dashboard } from "@/components/dashboard";
import { FileUpload } from "@/components/file-upload";
import { ReviewReport } from "@/components/review-report";
import type { DesignReview, UploadedFile } from "@/lib/types";

export default function Home() {
  const [activeView, setActiveView] = useState<"dashboard" | "upload" | "report">("dashboard");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentReview, setCurrentReview] = useState<DesignReview | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleAnalysisComplete = (review: DesignReview) => {
    setCurrentReview(review);
    setIsAnalyzing(false);
    setActiveView("report");
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {activeView === "dashboard" && (
            <Dashboard 
              onStartReview={() => setActiveView("upload")} 
              recentReviews={currentReview ? [currentReview] : []}
            />
          )}
          {activeView === "upload" && (
            <FileUpload
              uploadedFiles={uploadedFiles}
              onFilesUploaded={handleFilesUploaded}
              onAnalysisComplete={handleAnalysisComplete}
              onStartAnalysis={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}
          {activeView === "report" && currentReview && (
            <ReviewReport review={currentReview} />
          )}
        </main>
      </div>
    </div>
  );
}
