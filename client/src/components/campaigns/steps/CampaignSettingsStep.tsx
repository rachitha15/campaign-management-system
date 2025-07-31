import { useState } from "react";
import { Calendar, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface CampaignSettingsStepProps {
  data: CampaignData;
  updateData: (updates: Partial<CampaignData>) => void;
  onNext: () => void;
}

export default function CampaignSettingsStep({ 
  data, 
  updateData, 
  onNext 
}: CampaignSettingsStepProps) {
  
  const [settings, setSettings] = useState(data.settings || {});

  const updateSettings = (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateData({ settings: newSettings });
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Settings</h2>
        <p className="text-gray-600">
          Configure additional settings for your trigger-based campaign.
        </p>
      </div>

      <div className="space-y-6">
        {/* Campaign Name */}
        <Card className="p-4">
          <div className="space-y-4">
            <Label htmlFor="campaign-name" className="text-base font-medium">
              Campaign Name
            </Label>
            <Input
              id="campaign-name"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="Enter campaign name"
              className="max-w-md"
            />
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4">
          <div className="space-y-4">
            <Label htmlFor="description" className="text-base font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={settings.description || ""}
              onChange={(e) => updateSettings("description", e.target.value)}
              placeholder="Describe the purpose and goals of this campaign"
              className="min-h-[100px]"
            />
            <p className="text-sm text-gray-500">
              This description will help you and your team understand the campaign's objectives.
            </p>
          </div>
        </Card>

        {/* Campaign Duration */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium">Campaign Duration</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div>
                <Label htmlFor="start-date" className="text-sm">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={settings.startDate || today}
                  onChange={(e) => updateSettings("startDate", e.target.value)}
                  min={today}
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-sm">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={settings.endDate || ""}
                  onChange={(e) => updateSettings("endDate", e.target.value)}
                  min={settings.startDate || today}
                />
              </div>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                If no end date is specified, the campaign will run indefinitely until manually stopped.
              </AlertDescription>
            </Alert>
          </div>
        </Card>

        {/* Campaign Status */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-2">
            <Label className="text-base font-medium text-blue-900">Campaign Status</Label>
            <p className="text-sm text-blue-700">
              This campaign will be created in "Active" status and will start triggering based on the configured events immediately after publishing.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}