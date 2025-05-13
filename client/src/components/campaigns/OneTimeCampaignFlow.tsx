import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { CampaignSteps } from "./CampaignSteps";
import { DataSourceStep } from "./steps/DataSourceStep";
import { BurnRulesStep } from "./steps/BurnRulesStep";
import { ReviewPublishStep } from "./steps/ReviewPublishStep";
import { CampaignData, StepId, BurnRules } from "@/types/campaign";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface OneTimeCampaignFlowProps {
  campaignName: string;
  onClose: () => void;
}

export function OneTimeCampaignFlow({ campaignName, onClose }: OneTimeCampaignFlowProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("dataSource");
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: campaignName,
    type: "one-time",
    csvFile: null,
    burnRules: {
      expiryDays: 30,
      expiryPeriod: "Days"
    }
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const steps = [
    { id: "dataSource", label: "Data Source & Action", status: currentStep === "dataSource" ? "active" : (currentStep === "burnRules" || currentStep === "review") ? "completed" : "inactive" },
    { id: "burnRules", label: "Burn Rules", status: currentStep === "burnRules" ? "active" : currentStep === "review" ? "completed" : "inactive" },
    { id: "review", label: "Review & Publish", status: currentStep === "review" ? "active" : "inactive" }
  ] as const;

  const publishCampaignMutation = useMutation({
    mutationFn: async (data: CampaignData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('burnRules', JSON.stringify(data.burnRules));
      if (data.csvFile) {
        formData.append('csvFile', data.csvFile);
      }
      
      const res = await fetch('/api/campaigns/publish', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setShowSuccessDialog(true);
    },
    onError: (error) => {
      toast({
        title: "Error publishing campaign",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const handleDataSourceNext = (csvFile: File) => {
    setCampaignData(prev => ({ ...prev, csvFile }));
    setCurrentStep("burnRules");
  };

  const handleBurnRulesNext = (burnRules: BurnRules) => {
    setCampaignData(prev => ({ ...prev, burnRules }));
    setCurrentStep("review");
  };

  const handlePublishCampaign = () => {
    publishCampaignMutation.mutate(campaignData);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    onClose();
  };

  return (
    <div>
      <div className="bg-secondary text-white py-4 px-6 flex items-center">
        <button onClick={onClose} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-medium">One time campaign</h2>
        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Trigger Based
        </span>
      </div>
      
      <div className="flex">
        <CampaignSteps steps={steps} />
        
        <div className="flex-1 p-6 bg-white">
          {currentStep === "dataSource" && (
            <DataSourceStep onNext={handleDataSourceNext} />
          )}
          
          {currentStep === "burnRules" && (
            <BurnRulesStep 
              onNext={handleBurnRulesNext} 
              onBack={() => setCurrentStep("dataSource")}
              initialData={campaignData.burnRules}
            />
          )}
          
          {currentStep === "review" && (
            <ReviewPublishStep 
              campaignData={campaignData}
              onBack={() => setCurrentStep("burnRules")}
              onPublish={handlePublishCampaign}
            />
          )}
          
          {publishCampaignMutation.isPending && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Publishing Campaign</AlertTitle>
              <AlertDescription>
                Your campaign is being published. Please wait...
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessClose}>
        <DialogContent className="sm:max-w-md text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Published!</h3>
          <p className="text-sm text-gray-500 mb-6">Your one-time campaign has been created successfully and is now active.</p>
          <Button onClick={handleSuccessClose} className="mx-auto">
            View Campaigns
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
