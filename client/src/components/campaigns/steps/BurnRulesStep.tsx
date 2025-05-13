import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelperText } from "@/components/ui/helper-text";
import { BurnRules } from "@/types/campaign";

interface BurnRulesStepProps {
  onNext: (burnRules: BurnRules) => void;
  onBack: () => void;
  initialData?: BurnRules;
}

export function BurnRulesStep({ onNext, onBack, initialData }: BurnRulesStepProps) {
  const [expiryDays, setExpiryDays] = useState(initialData?.expiryDays?.toString() || "30");
  const [expiryPeriod, setExpiryPeriod] = useState(initialData?.expiryPeriod || "Days");
  const [minimumOrderValue, setMinimumOrderValue] = useState(initialData?.minimumOrderValue?.toString() || "");

  const handleNext = () => {
    const burnRules: BurnRules = {
      expiryDays: parseInt(expiryDays) || 30,
      expiryPeriod,
      minimumOrderValue: minimumOrderValue ? parseFloat(minimumOrderValue) : undefined
    };
    onNext(burnRules);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Burn Rules</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <Label className="block text-sm font-medium text-gray-700">Points expire after</Label>
            <HelperText className="ml-1" icon>
              <span className="sr-only">Info about points expiry</span>
            </HelperText>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              className="w-16"
              placeholder="30"
              value={expiryDays}
              onChange={(e) => setExpiryDays(e.target.value)}
            />
            <Select value={expiryPeriod} onValueChange={setExpiryPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Days">Days</SelectItem>
                <SelectItem value="Weeks">Weeks</SelectItem>
                <SelectItem value="Months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <Label className="block text-sm font-medium text-gray-700">Minimum order value</Label>
            <HelperText className="ml-1" icon>
              <span className="sr-only">Info about minimum order value</span>
            </HelperText>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₹</span>
            </div>
            <Input
              type="text"
              className="pl-7 w-64"
              placeholder="Enter Value"
              value={minimumOrderValue}
              onChange={(e) => setMinimumOrderValue(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
