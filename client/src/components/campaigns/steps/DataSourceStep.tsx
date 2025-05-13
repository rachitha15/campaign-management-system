import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/ui/file-uploader";
import { downloadSampleCsv } from "@/lib/utils";
import { Download } from "lucide-react";

interface DataSourceStepProps {
  onNext: (csvFile: File) => void;
}

export function DataSourceStep({ onNext }: DataSourceStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataSource, setDataSource] = useState<string>("upload-csv");

  const handleNext = () => {
    if (selectedFile) {
      onNext(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Data Source & Action</h2>
      
      <div className="mb-6">
        <Label className="block text-sm font-medium text-gray-700 mb-2">Select Data Source</Label>
        <Select value={dataSource} onValueChange={setDataSource}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload-csv">Upload CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <div className="border border-gray-300 rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Upload your customer data</h3>
              <p className="text-xs text-gray-500 mt-1">CSV file with customer identifiers</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={downloadSampleCsv} 
              className="text-primary font-medium hover:text-blue-600 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Download sample
            </Button>
          </div>
          
          <FileUploader onFileSelect={setSelectedFile} />
          
          <div className="mt-3 text-xs text-gray-500">
            <p>Upload a CSV file with either partner_user_id or contact (10 digit number) columns.</p>
            <p className="mt-1">At least one of these fields must be provided for each customer.</p>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!selectedFile}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
