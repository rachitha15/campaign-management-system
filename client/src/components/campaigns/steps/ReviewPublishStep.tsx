import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Calendar, Settings, Zap, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface Program {
  id: string;
  name: string;
  purpose: string;
  inputType: string;
  expiryDays: number;
  minimumOrderValue?: number;
  status: string;
}

interface ReviewPublishStepProps {
  data: CampaignData;
  updateData: (updates: Partial<CampaignData>) => void;
  onNext: () => void;
}

export default function ReviewPublishStep({ 
  data, 
  updateData, 
  onNext 
}: ReviewPublishStepProps) {
  
  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ['/api/programs'],
  });

  const selectedProgram = programs.find(p => p.id === data.programId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Publish</h2>
        <p className="text-gray-600">
          Review your campaign configuration before publishing. Once published, the campaign will be active and ready to trigger.
        </p>
      </div>

      <div className="space-y-6">
        {/* Campaign Overview */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Campaign Overview</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Campaign Name</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Campaign Type</p>
                <Badge variant="outline" className="capitalize">
                  {data.type.replace('-', ' ')}
                </Badge>
              </div>
            </div>

            {data.settings?.description && (
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm">{data.settings.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Trigger Configuration */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium">Trigger Configuration</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Trigger Event</p>
              {data.triggerEvent ? (
                <Badge variant="outline">{data.triggerEvent}</Badge>
              ) : (
                <p className="text-sm text-red-600">No event selected</p>
              )}
            </div>
          </div>
        </Card>

        {/* Program Details */}
        {selectedProgram && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium">Selected Program</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Program Name</p>
                  <p className="font-medium">{selectedProgram.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <Badge variant="secondary" className="capitalize">
                      {selectedProgram.purpose}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Period</p>
                    <p className="text-sm">{selectedProgram.expiryDays} days</p>
                  </div>
                </div>

                {selectedProgram.minimumOrderValue && (
                  <div>
                    <p className="text-sm text-gray-500">Minimum Order Value</p>
                    <p className="text-sm">₹{selectedProgram.minimumOrderValue}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Campaign Duration */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium">Campaign Duration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="text-sm">
                  {data.settings?.startDate 
                    ? formatDate(data.settings.startDate)
                    : "Today"
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="text-sm">
                  {data.settings?.endDate 
                    ? formatDate(data.settings.endDate)
                    : "No end date (runs indefinitely)"
                  }
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Publishing Status */}
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-green-900">Ready to Publish</h3>
            </div>
            
            <p className="text-sm text-green-700">
              Your trigger-based campaign is configured and ready to be published. Once published, 
              it will automatically trigger based on the configured events and award benefits 
              according to the selected program rules.
            </p>

            <Separator className="bg-green-200" />

            <div className="text-sm text-green-700">
              <p className="font-medium mb-2">What happens after publishing:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Campaign status will be set to "Active"</li>
                <li>Event triggers will start monitoring for the configured events</li>
                <li>Benefits will be automatically awarded when triggers fire</li>
                <li>You can monitor campaign performance in the campaigns dashboard</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}