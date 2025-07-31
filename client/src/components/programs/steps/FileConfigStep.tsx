import { useQuery } from "@tanstack/react-query";
import { Download, FileText, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProgramData {
  name: string;
  purpose: "promotions" | "loyalty" | "";
  inputType: "event" | "file" | "";
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
}

interface FileFormat {
  id: string;
  name: string;
  description: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

interface FileConfigStepProps {
  data: ProgramData;
  updateData: (updates: Partial<ProgramData>) => void;
  onNext: () => void;
}

export default function FileConfigStep({ data, updateData, onNext }: FileConfigStepProps) {
  const { data: fileFormats = [], isLoading } = useQuery<FileFormat[]>({
    queryKey: ['/api/programs/file-formats'],
  });

  const handleDownloadSample = async (formatId: string) => {
    try {
      const response = await fetch(`/api/programs/sample-file/${formatId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sample_${formatId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download sample file:', error);
    }
  };

  const handleFormatSelect = (formatId: string) => {
    updateData({ fileFormatId: formatId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Select File Format</Label>
        <p className="text-sm text-gray-500 mt-1">
          Choose the file format that matches your data structure
        </p>
      </div>

      <RadioGroup
        value={data.fileFormatId || ""}
        onValueChange={handleFormatSelect}
      >
        <div className="space-y-4">
          {fileFormats.map((format) => (
            <Card key={format.id} className="p-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={format.id} id={format.id} className="mt-1" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={format.id} className="cursor-pointer font-medium">
                      {format.name}
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSample(format.id)}
                      className="h-8"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download Sample
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600">{format.description}</p>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Required Fields:</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {format.fields.map((field) => (
                        <div key={field.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm">{field.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {field.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {data.fileFormatId && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Format Selected</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            You can now proceed to configure the program settings.
          </p>
        </Card>
      )}
    </div>
  );
}