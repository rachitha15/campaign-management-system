import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BasicInfoStep from "./steps/BasicInfoStep";
import EventConfigStep from "./steps/EventConfigStep";
import FileConfigStep from "./steps/FileConfigStep";
import FinalConfigStep from "./steps/FinalConfigStep";

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProgramData {
  name: string;
  purpose: "promotions" | "loyalty" | "";
  inputType: "event" | "file" | "";
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
}

export default function CreateProgramModal({ isOpen, onClose }: CreateProgramModalProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [programData, setProgramData] = useState<ProgramData>({
    name: "",
    purpose: "",
    inputType: "",
    expiryDays: 30,
    minimumOrderValue: undefined,
    fileFormatId: undefined,
  });

  const createProgramMutation = useMutation({
    mutationFn: async (data: ProgramData) => {
      const res = await apiRequest('POST', '/api/programs', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/programs'] });
      toast({
        title: "Success",
        description: "Program created successfully",
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create program",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCurrentStep(1);
    setProgramData({
      name: "",
      purpose: "",
      inputType: "",
      expiryDays: 30,
      minimumOrderValue: undefined,
      fileFormatId: undefined,
    });
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    createProgramMutation.mutate(programData);
  };

  const updateProgramData = (updates: Partial<ProgramData>) => {
    setProgramData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return programData.name && programData.purpose && programData.inputType;
      case 2:
        if (programData.inputType === "event") {
          return programData.expiryDays > 0;
        } else {
          return programData.fileFormatId;
        }
      case 3:
        return programData.expiryDays > 0;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return programData.inputType === "event" ? "Event Configuration" : "File Configuration";
      case 3:
        return "Final Configuration";
      default:
        return "Create Program";
    }
  };

  const getTotalSteps = () => {
    return programData.inputType === "event" ? 2 : 3;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getStepTitle()}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            {Array.from({ length: getTotalSteps() }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i < currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="mt-6">
          {currentStep === 1 && (
            <BasicInfoStep
              data={programData}
              updateData={updateProgramData}
            />
          )}
          
          {currentStep === 2 && programData.inputType === "event" && (
            <EventConfigStep
              data={programData}
              updateData={updateProgramData}
            />
          )}
          
          {currentStep === 2 && programData.inputType === "file" && (
            <FileConfigStep
              data={programData}
              updateData={updateProgramData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 3 && (
            <FinalConfigStep
              data={programData}
              updateData={updateProgramData}
            />
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {currentStep < getTotalSteps() ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || createProgramMutation.isPending}
              >
                {createProgramMutation.isPending ? "Creating..." : "Create Program"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}