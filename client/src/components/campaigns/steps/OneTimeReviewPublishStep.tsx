import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Settings, CreditCard, Calendar } from "lucide-react";
import { CampaignData } from "@/types/campaign";
import { formatIndianRupee } from "@/lib/utils";

interface OneTimeReviewPublishStepProps {
  campaignData: CampaignData;
  onBack: () => void;
  onPublish: () => void;
}

export function OneTimeReviewPublishStep({ 
  campaignData, 
  onBack, 
  onPublish 
}: OneTimeReviewPublishStepProps) {
  const { name, csvFile, selectedProgram, walletAction, burnRules } = campaignData;

  const formatCreditInfo = () => {
    if (walletAction.creditType === "flat") {
      return `₹${walletAction.creditAmount} flat amount per customer`;
    } else {
      const baseText = `${walletAction.creditPercentage}% of ${walletAction.percentageField}`;
      if (walletAction.hasMaxLimit && walletAction.maxLimit) {
        return `${baseText} (max ₹${walletAction.maxLimit})`;
      }
      return baseText;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Review & Publish</h2>
        <p className="text-gray-600">
          Review your one-time campaign configuration before publishing. Once published, the campaign will process the uploaded customer data.
        </p>
      </div>

      <div className="space-y-6">
        {/* Campaign Overview */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Campaign Overview</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Campaign Name</p>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Campaign Type</p>
                <Badge variant="outline">One Time</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Program & Data Source */}
        {selectedProgram && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium">Program & Data Source</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Selected Program</p>
                  <p className="font-medium">{selectedProgram.name}</p>
                  <p className="text-xs text-gray-600">{selectedProgram.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data File</p>
                  <p className="font-medium">{csvFile?.name || 'No file selected'}</p>
                  {csvFile && (
                    <p className="text-xs text-gray-600">
                      {Math.round(csvFile.size / 1024)} KB
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Wallet Action */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium">Wallet Action</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Action Type</p>
                  <p className="font-medium">{walletAction.creditWallet}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wallet ID</p>
                  <p className="font-medium text-xs">{walletAction.walletId}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Credit Configuration</p>
                <div className="mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {walletAction.creditType}
                  </Badge>
                  <p className="text-sm text-gray-700 mt-1">
                    {formatCreditInfo()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Campaign Settings */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-medium">Campaign Settings</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Credit Expiry</p>
                <p className="font-medium">{burnRules.expiryDays} {burnRules.expiryPeriod}</p>
              </div>
              {burnRules.minimumOrderValue && (
                <div>
                  <p className="text-sm text-gray-500">Minimum Order Value</p>
                  <p className="font-medium">{formatIndianRupee(burnRules.minimumOrderValue)}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onPublish} className="px-6 py-2">
          Publish Campaign
        </Button>
      </div>
    </div>
  );
}