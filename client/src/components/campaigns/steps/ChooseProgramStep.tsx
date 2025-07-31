import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Calendar, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CampaignData {
  name: string;
  type: "trigger-based";
  triggerEvent?: string;
  programId?: string;
}

interface Program {
  id: string;
  name: string;
  purpose: string;
  inputType: string;
  expiryDays: number;
  minimumOrderValue?: number;
  status: string;
  createdAt: string;
}

interface ChooseProgramStepProps {
  data: CampaignData;
  updateData: (updates: Partial<CampaignData>) => void;
  onNext: () => void;
}

export default function ChooseProgramStep({ 
  data, 
  updateData, 
  onNext 
}: ChooseProgramStepProps) {
  
  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ['/api/programs'],
  });

  // Filter for event-based programs only
  const eventBasedPrograms = programs.filter(program => 
    program.inputType === "event" && program.status === "active"
  );

  const handleProgramSelect = (programId: string) => {
    updateData({ programId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose Program</h2>
        <p className="text-gray-600">
          Select a program that defines the rewards and rules for this campaign.
        </p>
      </div>

      {eventBasedPrograms.length === 0 ? (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            No event-based programs available. Please create an event-based program first before setting up trigger-based campaigns.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <Label className="text-base font-medium">Available Programs</Label>
          
          <RadioGroup
            value={data.programId || ""}
            onValueChange={handleProgramSelect}
          >
            <div className="space-y-4">
              {eventBasedPrograms.map((program) => (
                <Card key={program.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value={program.id} id={program.id} className="mt-1" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={program.id} className="cursor-pointer font-medium text-lg">
                          {program.name}
                        </Label>
                        <Badge variant="outline" className="capitalize">
                          {program.purpose}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            Expires in {program.expiryDays} days
                          </span>
                        </div>
                        {program.minimumOrderValue && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              Min. order: ₹{program.minimumOrderValue}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          Event-based
                        </Badge>
                        <Badge 
                          variant={program.status === "active" ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </RadioGroup>

          {data.programId && (
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Program Selected</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                You can now proceed to configure campaign settings.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}