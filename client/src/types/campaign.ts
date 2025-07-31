export type CampaignType = "trigger-based" | "one-time";
export type CampaignStatus = "Active" | "Paused" | "Ended" | "Campaign Ended";
export type StepId = "dataSource" | "review";
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

export interface CampaignSchedule {
  startDate?: string;
  startTime?: string;
  startImmediately: boolean;
  endDate?: string;
  endTime?: string;
  noEndDate: boolean;
}

export interface CampaignLimits {
  limitTotalAmount: boolean;
  maxTotalAmount?: number;
  totalAmountDuration?: string;
  limitTotalActions: boolean;
  maxTotalActions?: number;
  totalActionsDuration?: string;
}

export interface UserLimits {
  limitUserAmount: boolean;
  maxUserAmount?: number;
  userAmountDuration?: string;
  limitUserActions: boolean;
  maxUserActions?: number;
  userActionsDuration?: string;
}

export interface CampaignSettings {
  schedule: CampaignSchedule;
  campaignLimits: CampaignLimits;
  userLimits: UserLimits;
}

export interface WalletAction {
  creditWallet: string;
  walletId: string;
  creditType: 'flat' | 'percentage';
  creditAmount?: number;
  creditPercentage?: number;
  percentageField?: string; // Field name from CSV for percentage calculation
  hasMaxLimit?: boolean; // Whether maximum limit is enabled for percentage
  maxLimit?: number; // Maximum credit amount limit
}

export interface CampaignData {
  name: string;
  type: CampaignType;
  csvFile: File | null;
  selectedProgram?: any; // Program selected for this campaign
  csvHeaders?: string[]; // Headers from uploaded CSV
  walletAction: WalletAction;
  burnRules: BurnRules;
  campaignSettings?: CampaignSettings;
}

export interface CampaignRequest {
  name: string;
  type: CampaignType;
  forceStatus?: CampaignStatus;
}
