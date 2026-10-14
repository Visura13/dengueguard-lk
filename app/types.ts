export type Severity = "Low" | "Medium" | "High";
export type RiskStatus = "Pending" | "Clean-up planned" | "Resolved";

export type RiskReport = {
  id: string;
  location: string;
  district: string;
  category: string;
  severity: Severity;
  description: string;
  status: RiskStatus;
  createdAt: string;
  isSample?: boolean;
};
