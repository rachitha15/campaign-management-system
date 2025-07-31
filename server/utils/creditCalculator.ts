export interface WalletAction {
  creditWallet: string;
  walletId: string;
  creditType: "flat" | "percentage";
  creditAmount?: number;
  creditPercentage?: number;
  percentageField?: string;
  hasMaxLimit?: boolean;
  maxLimit?: number;
}

export function calculateCreditAmount(
  walletAction: WalletAction,
  csvRow: Record<string, string>
): number {
  if (walletAction.creditType === "flat") {
    return walletAction.creditAmount || 0;
  }

  if (walletAction.creditType === "percentage") {
    const percentage = walletAction.creditPercentage || 0;
    const field = walletAction.percentageField || "";
    const baseAmount = parseFloat(csvRow[field] || "0");
    
    let calculatedAmount = (baseAmount * percentage) / 100;
    
    // Apply maximum limit if enabled
    if (walletAction.hasMaxLimit && walletAction.maxLimit) {
      calculatedAmount = Math.min(calculatedAmount, walletAction.maxLimit);
    }
    
    return calculatedAmount;
  }

  return 0;
}

export function generateWalletId(): string {
  const prefix = "wallet_";
  const randomString = Math.random().toString(36).substring(2, 15);
  return prefix + randomString.toUpperCase();
}