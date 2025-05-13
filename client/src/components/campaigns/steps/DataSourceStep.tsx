import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploader } from "@/components/ui/file-uploader";
import { downloadSampleCsv, formatIndianRupee } from "@/lib/utils";
import { Download, AlertCircle } from "lucide-react";
import { WalletAction } from "@/types/campaign";
import { HelperText } from "@/components/ui/helper-text";

interface DataSourceStepProps {
  onNext: (csvFile: File, walletAction: WalletAction) => void;
  initialWalletAction?: WalletAction;
}

export function DataSourceStep({ onNext, initialWalletAction }: DataSourceStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataSource, setDataSource] = useState<string>("upload-csv");
  
  // Wallet action state
  const [creditWallet, setCreditWallet] = useState<string>(initialWalletAction?.creditWallet || "Credit Wallet");
  const [walletId, setWalletId] = useState<string>(initialWalletAction?.walletId || "razorpay_wallet_test_sto");
  const [creditAmount, setCreditAmount] = useState<string>(
    initialWalletAction?.creditAmount ? initialWalletAction.creditAmount.toString() : "100"
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCreditAmount(value);
  };

  const handleNext = () => {
    if (selectedFile) {
      const walletAction: WalletAction = {
        creditWallet,
        walletId,
        creditType: "flat",
        creditAmount: parseInt(creditAmount) || 0
      };
      
      onNext(selectedFile, walletAction);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Data Source & Action</h2>
      
      {/* Data Source Section */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-800 mb-4">Data Source</h3>
        
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
      </div>
      
      {/* Action Section */}
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-800 mb-4">Define Action</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Credit Wallet</Label>
              <Select value={creditWallet} onValueChange={setCreditWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Wallet">Credit Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet</Label>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay_wallet_test_sto">razorpay_wallet_test_sto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Label className="block text-sm font-medium text-gray-700">Credit Type</Label>
              <HelperText className="ml-1" icon>
                Amount to be credited to each customer
              </HelperText>
            </div>
            <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-2.5 py-0.5 text-xs font-medium">
              Flat
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Credit Amount</Label>
            <div>
              <div className="relative mt-1 rounded-md shadow-sm w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <Input
                  type="text"
                  className="pl-7"
                  placeholder="Enter amount"
                  value={creditAmount}
                  onChange={handleAmountChange}
                />
              </div>
              {creditAmount && parseInt(creditAmount) > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Equivalent to {formatIndianRupee(parseInt(creditAmount))}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 flex justify-end">
        <Button 
          onClick={handleNext}
          disabled={!selectedFile || !creditAmount || parseInt(creditAmount) === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
