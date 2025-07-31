import { ChevronDown, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface CampaignData {
  name: string;
  type: "trigger-based";
  triggerEvent?: string;
  programId?: string;
}

interface TriggerActionStepProps {
  data: CampaignData;
  updateData: (updates: Partial<CampaignData>) => void;
  onNext: () => void;
}

export default function TriggerActionStep({ 
  data, 
  updateData, 
  onNext 
}: TriggerActionStepProps) {
  
  const handleEventSelect = (eventId: string) => {
    updateData({ triggerEvent: eventId });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Trigger & Action</h2>
        <p className="text-gray-600">
          Define when this campaign should be triggered and what action should be taken.
        </p>
      </div>

      {/* Trigger Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">If this happens</h3>
            <p className="text-sm text-gray-500">Trigger</p>
          </div>
        </div>

        <div className="ml-11">
          <Label htmlFor="trigger-event" className="text-base font-medium mb-3 block">
            Select event
          </Label>
          
          <Select value={data.triggerEvent || ""} onValueChange={handleEventSelect}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {/* No events available for now */}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm text-gray-600">is triggered</span>
          </div>
        </div>

        {/* No Events Alert */}
        <div className="ml-11">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No events configured. Please configure events in your system before creating trigger-based campaigns.
            </AlertDescription>
          </Alert>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <ChevronDown className="h-5 w-5 text-gray-600" />
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Do this</h3>
            <p className="text-sm text-gray-500">Action</p>
          </div>
        </div>

        <div className="ml-11">
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-blue-600 border-blue-200">
              + Action
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Actions will be configured based on the selected program in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}