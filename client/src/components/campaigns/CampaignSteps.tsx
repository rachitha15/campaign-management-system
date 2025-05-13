import { Check } from "lucide-react";

export type StepStatus = "active" | "completed" | "inactive";

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface CampaignStepsProps {
  steps: Step[];
}

export function CampaignSteps({ steps }: CampaignStepsProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Steps</h3>
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center ${
              step.status === "active" 
                ? "step-active" 
                : step.status === "completed" 
                  ? "step-completed" 
                  : "step-inactive"
            }`}
          >
            {step.status === "completed" ? (
              <Check className="h-5 w-5 mr-2 step-icon" />
            ) : (
              <div className="step-bullet" />
            )}
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
