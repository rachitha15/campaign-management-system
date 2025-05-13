export type CampaignType = "trigger-based" | "one-time";
export type CampaignStatus = "Active" | "Paused" | "Ended" | "Campaign Ended";
export type StepId = "dataSource" | "burnRules" | "review";
export type StepStatus = "active" | "completed" | "inactive";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BurnRules {
  expiryDays: number;
  expiryPeriod: string;
  minimumOrderValue?: number;
}

export interface WalletAction {
  creditWallet: string;
  walletId: string;
  creditType: 'flat';
  creditAmount: number;
}

export interface CampaignData {
  name: string;
  type: CampaignType;
  csvFile: File | null;
  walletAction: WalletAction;
  burnRules: BurnRules;
}

export interface CampaignRequest {
  name: string;
  type: CampaignType;
}
