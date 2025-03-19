
export interface Report {
  id: string;
  title: string;
  summary?: string;
  date: string;
  clientId: string;
  url?: string; // Changed from required to optional
  status: "processing" | "completed" | "failed";
  content?: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
  };
}
