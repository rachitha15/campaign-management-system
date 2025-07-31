import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Temporary simplified components until import issues are resolved
const TriggerActionStep = ({ data, updateData, onNext }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Trigger & Action</h2>
      <p className="text-gray-600 mb-6">
        Define when this campaign should be triggered and what action should be taken.
      </p>
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          No events configured. Please configure events in your system before creating trigger-based campaigns.
        </p>
      </div>
    </div>
  </div>
);

const ChooseProgramStep = ({ data, updateData, onNext }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Program</h2>
      <p className="text-gray-600 mb-6">
        Select a program that defines the rewards and rules for this campaign.
      </p>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          Programs will be loaded here to select from available event-based programs.
        </p>
      </div>
    </div>
  </div>
);

const CampaignSettingsStep = ({ data, updateData, onNext }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Settings</h2>
      <p className="text-gray-600 mb-6">
        Configure additional settings for your trigger-based campaign.
      </p>
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-sm text-gray-700">
          Campaign settings like duration, description, and other configurations will be available here.
        </p>
      </div>
    </div>
  </div>
);

const ReviewPublishStep = ({ data, updateData, onNext }: any) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Publish</h2>
      <p className="text-gray-600 mb-6">
        Review your campaign configuration before publishing.
      </p>
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-sm text-green-700">
          Campaign summary and final review will be displayed here before publishing.
        </p>
      </div>
    </div>
  </div>
);

interface TriggerBasedCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaignName: string;
}

interface CampaignData {
  name: string;
  type: "trigger-based";
  triggerEvent?: string;
  programId?: string;
  settings?: {
    description?: string;
    startDate?: string;
    endDate?: string;
  };
}

const STEPS = [
  { id: 1, name: "Trigger & Action", component: TriggerActionStep },
  { id: 2, name: "Choose Program", component: ChooseProgramStep },
  { id: 3, name: "Campaign Settings", component: CampaignSettingsStep },
  { id: 4, name: "Review & Publish", component: ReviewPublishStep },
];

export default function TriggerBasedCampaignModal({ 
  open, 
  onClose, 
  campaignName 
}: TriggerBasedCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: campaignName,
    type: "trigger-based"
  });

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCampaignData({
      name: campaignName,
      type: "trigger-based"
    });
    onClose();
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              Create Trigger Based Campaign: {campaignName}
            </DialogTitle>
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Steps Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 mb-4">Steps</p>
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    step.id === currentStep
                      ? "bg-blue-50 border border-blue-200"
                      : step.id < currentStep
                      ? "bg-green-50 border border-green-200"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id === currentStep
                        ? "bg-blue-600 text-white"
                        : step.id < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step.id < currentStep ? "✓" : step.id}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step.id === currentStep
                        ? "text-blue-900"
                        : step.id < currentStep
                        ? "text-green-900"
                        : "text-gray-600"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <CurrentStepComponent
                data={campaignData}
                updateData={updateCampaignData}
                onNext={handleNext}
                onBack={handleBack}
                currentStep={currentStep}
                totalSteps={STEPS.length}
              />
            </div>

            {/* Footer Actions */}
            <div className="border-t p-4 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                {currentStep < STEPS.length ? (
                  <Button
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !campaignData.triggerEvent) ||
                      (currentStep === 2 && !campaignData.programId)
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      // Handle campaign creation
                      console.log("Creating campaign:", campaignData);
                      handleClose();
                    }}
                  >
                    Publish Campaign
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}