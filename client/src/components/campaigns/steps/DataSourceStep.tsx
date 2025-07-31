import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/ui/file-uploader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { downloadSampleCsv, formatIndianRupee } from "@/lib/utils";
import { Download, AlertCircle, Upload, CheckCircle } from "lucide-react";
import { WalletAction } from "@/types/campaign";
import { HelperText } from "@/components/ui/helper-text";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

interface DataSourceStepProps {
  onNext: (csvFile: File, walletAction: WalletAction, selectedProgram?: any, csvHeaders?: string[]) => void;
  initialWalletAction?: WalletAction;
}

interface Program {
  id: string;
  name: string;
  purpose: string;
  inputType: string;
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
  status: string;
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

export function DataSourceStep({ onNext, initialWalletAction }: DataSourceStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvValidationError, setCsvValidationError] = useState<string>("");
  
  // Wallet action state
  const [creditWallet, setCreditWallet] = useState<string>(initialWalletAction?.creditWallet || "Credit Wallet");
  const [walletId, setWalletId] = useState<string>(initialWalletAction?.walletId || "razorpay_wallet_test_sto");
  const [creditType, setCreditType] = useState<"flat" | "percentage">(initialWalletAction?.creditType || "flat");
  const [creditAmount, setCreditAmount] = useState<string>(
    initialWalletAction?.creditAmount ? initialWalletAction.creditAmount.toString() : "100"
  );
  const [creditPercentage, setCreditPercentage] = useState<string>(
    initialWalletAction?.creditPercentage ? initialWalletAction.creditPercentage.toString() : "10"
  );
  const [percentageField, setPercentageField] = useState<string>(initialWalletAction?.percentageField || "");

  const { data: programs = [] } = useQuery<Program[]>({
    queryKey: ['/api/programs'],
  });

  const { data: fileFormats = [] } = useQuery<FileFormat[]>({
    queryKey: ['/api/programs/file-formats'],
  });

  // Filter for file-based programs only
  const fileBasedPrograms = programs.filter(program => 
    program.inputType === "file" && program.status === "active"
  );

  const selectedFileFormat = selectedProgram ? fileFormats.find(f => f.id === selectedProgram.fileFormatId) : null;
  
  // Get numeric fields from CSV headers for percentage calculation
  const numericFields = csvHeaders.filter(header => {
    const field = selectedFileFormat?.fields.find(f => f.name === header);
    return field && (field.type === 'number' || field.type === 'float' || field.type === 'int');
  });

  const validateCsvFile = async (file: File): Promise<{ isValid: boolean; headers: string[]; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length > 6) { // 1 header + 5 data rows max
            resolve({ isValid: false, headers: [], error: "File contains more than 5 rows. Please upload a smaller file for this prototype." });
            return;
          }

          if (lines.length < 2) {
            resolve({ isValid: false, headers: [], error: "File must contain at least a header and one data row." });
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim());
          
          // Validate against selected program's file format
          if (selectedProgram && selectedFileFormat) {
            const requiredFields = selectedFileFormat.fields.filter(f => f.required).map(f => f.name);
            const missingFields = requiredFields.filter(field => !headers.includes(field));
            
            if (missingFields.length > 0) {
              resolve({ 
                isValid: false, 
                headers: [], 
                error: `Missing required fields: ${missingFields.join(', ')}. Please ensure your CSV matches the selected program format.` 
              });
              return;
            }
          }

          resolve({ isValid: true, headers });
        } catch (error) {
          resolve({ isValid: false, headers: [], error: "Invalid CSV format. Please check your file." });
        }
      };
      reader.readAsText(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!selectedProgram) {
      setCsvValidationError("Please select a program first.");
      return;
    }

    const validation = await validateCsvFile(file);
    if (validation.isValid) {
      setSelectedFile(file);
      setCsvHeaders(validation.headers);
      setCsvValidationError("");
    } else {
      setSelectedFile(null);
      setCsvHeaders([]);
      setCsvValidationError(validation.error || "File validation failed");
    }
  };

  const handleProgramSelect = (programId: string) => {
    const program = fileBasedPrograms.find(p => p.id === programId);
    setSelectedProgram(program || null);
    setSelectedFile(null);
    setCsvHeaders([]);
    setCsvValidationError("");
    setPercentageField("");
  };

  const handleDownloadSample = async () => {
    if (!selectedFileFormat) return;
    
    try {
      const response = await fetch(`/api/programs/sample-file/${selectedFileFormat.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sample_${selectedFileFormat.id}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download sample file:', error);
    }
  };

  const handleNext = () => {
    if (selectedFile && selectedProgram) {
      const walletAction: WalletAction = {
        creditWallet,
        walletId,
        creditType,
        ...(creditType === "flat" 
          ? { creditAmount: parseInt(creditAmount) || 0 }
          : { 
              creditPercentage: parseFloat(creditPercentage) || 0,
              percentageField 
            }
        )
      };
      
      onNext(selectedFile, walletAction, selectedProgram, csvHeaders);
    }
  };

  const isValid = selectedFile && selectedProgram && (creditType === "flat" || (creditType === "percentage" && percentageField));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Data Source & Action</h2>
      
      {/* Program Selection */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-800 mb-4">Choose Program</h3>
        
        {fileBasedPrograms.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No file-based programs available. Please create a file-based program first.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Select Program</Label>
            <Select value={selectedProgram?.id || ""} onValueChange={handleProgramSelect}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose a program for this campaign" />
              </SelectTrigger>
              <SelectContent>
                {fileBasedPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} - {program.purpose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedProgram && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Selected:</strong> {selectedProgram.name}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Purpose: {selectedProgram.purpose}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* File Upload Section */}
      {selectedProgram && (
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4">Upload Customer Data</h3>
          
          <div className="border border-gray-300 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Upload your customer data</h3>
                <p className="text-xs text-gray-500 mt-1">CSV file with customer identifiers (max 5 rows for prototype)</p>
              </div>
              {selectedFileFormat && (
                <Button 
                  variant="outline"
                  onClick={handleDownloadSample}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Sample
                </Button>
              )}
            </div>

            {selectedFileFormat && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Required Format: {selectedFileFormat.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{selectedFileFormat.description}</p>
                <div className="space-y-1">
                  {selectedFileFormat.fields.map((field) => (
                    <div key={field.name} className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded text-white ${field.required ? 'bg-red-500' : 'bg-gray-400'}`}>
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                      <span className="font-medium">{field.name}</span>
                      <span className="text-gray-500">({field.type})</span>
                      <span className="text-gray-600">- {field.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FileUploader 
              onFileSelect={handleFileSelect}
              accept=".csv"
              className="mb-4"
            />

            {csvValidationError && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{csvValidationError}</AlertDescription>
              </Alert>
            )}

            {selectedFile && !csvValidationError && (
              <div className="mt-3 p-3 bg-green-50 rounded-md flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  File validated successfully: {selectedFile.name} ({csvHeaders.length} columns)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallet Action Section */}
      {selectedFile && (
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-4">Wallet Action</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Action</Label>
              <Select value={creditWallet} onValueChange={setCreditWallet}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Wallet">Credit Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Wallet ID</Label>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger className="w-80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay_wallet_test_sto">razorpay_wallet_test_sto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">Credit Type</Label>
              <RadioGroup value={creditType} onValueChange={(value: "flat" | "percentage") => setCreditType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flat" id="flat" />
                  <Label htmlFor="flat">Flat Amount</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Percentage of Field Value</Label>
                </div>
              </RadioGroup>
            </div>

            {creditType === "flat" ? (
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</Label>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">₹</span>
                  <Input
                    type="text"
                    value={creditAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setCreditAmount(value);
                    }}
                    className="w-32"
                    placeholder="100"
                  />
                </div>
                <HelperText>Amount to credit to each customer's wallet</HelperText>
              </div>
            ) : (
              <>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Percentage</Label>
                  <div className="flex items-center">
                    <Input
                      type="text"
                      value={creditPercentage}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setCreditPercentage(value);
                      }}
                      className="w-32"
                      placeholder="10"
                    />
                    <span className="text-gray-600 ml-2">%</span>
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Calculate From Field</Label>
                  <Select value={percentageField} onValueChange={setPercentageField}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select numeric field" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericFields.map((field) => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <HelperText>Credit amount will be calculated as {creditPercentage}% of this field's value for each customer</HelperText>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleNext} 
          disabled={!isValid}
          className="px-6 py-2"
        >
          Next: Campaign Settings
        </Button>
      </div>
    </div>
  );
}
