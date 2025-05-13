import { useRef, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateCsvFile } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileSelect?: (file: File) => void;
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    // Validate CSV content
    const validationResult = await validateCsvFile(file);
    if (!validationResult.valid) {
      toast({
        title: "Invalid CSV format",
        description: validationResult.message,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }

    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been successfully uploaded.`,
      variant: "default"
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleBrowseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent propagation to parent onClick
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent propagation to parent onClick
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (selectedFile) {
    return (
      <div className="border-2 rounded-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-md mr-3">
            <File className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-md px-6 pt-5 pb-6 flex justify-center ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-3 text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex flex-col items-center text-sm text-gray-600">
          <p>
            <button 
              type="button"
              onClick={handleBrowseClick}
              className="font-medium text-primary hover:text-blue-500 focus:outline-none"
            >
              Upload a file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept=".csv"
              onChange={handleFileChange}
            />
            <span className="mx-1">or drag and drop</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            CSV files only. Headers should be partner_user_id OR contact
          </p>
        </div>
      </div>
    </div>
  );
}
