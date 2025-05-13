import { Button } from "@/components/ui/button";
import { formatIndianRupee } from "@/lib/utils";
import { CampaignData } from "@/types/campaign";

interface ReviewPublishStepProps {
  campaignData: CampaignData;
  onBack: () => void;
  onPublish: () => void;
}

export function ReviewPublishStep({ campaignData, onBack, onPublish }: ReviewPublishStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Review & Publish</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Data Source & Action</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary font-medium">
                A
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Data Source</h4>
                <p className="text-sm text-gray-500">{campaignData.csvFile?.name || "customers.csv"}</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary font-medium">
                B
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Credit Wallet</h4>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-500">Credit Type:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Flat
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Credit Amount:</span>
                  <span className="ml-2 text-sm text-gray-900">100 (₹100.00)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Burn Rules</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Points expire after</span>
                <span className="text-sm font-medium text-gray-900">
                  {campaignData.burnRules.expiryDays} {campaignData.burnRules.expiryPeriod}
                </span>
              </div>
              {campaignData.burnRules.minimumOrderValue !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Minimum order value</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatIndianRupee(campaignData.burnRules.minimumOrderValue)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onPublish}>
          Publish Campaign
        </Button>
      </div>
    </div>
  );
}
