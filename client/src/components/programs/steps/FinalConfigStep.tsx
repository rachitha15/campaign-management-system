import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface ProgramData {
  name: string;
  purpose: "promotions" | "loyalty" | "";
  inputType: "event" | "file" | "";
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
  // User limits
  enableUserLimits?: boolean;
  maxCreditAmount?: number;
  maxTimesToCredit?: number;
  limitPeriod?: "day" | "week" | "month" | "lifetime";
}

interface FinalConfigStepProps {
  data: ProgramData;
  updateData: (updates: Partial<ProgramData>) => void;
}

export default function FinalConfigStep({ data, updateData }: FinalConfigStepProps) {
  const enableUserLimits = data.enableUserLimits || false;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="final-expiry-days">Expiry Days *</Label>
        <Input
          id="final-expiry-days"
          type="number"
          value={data.expiryDays}
          onChange={(e) => updateData({ expiryDays: parseInt(e.target.value) || 0 })}
          placeholder="Enter expiry days"
          min="1"
        />
        <p className="text-sm text-gray-500">
          Number of days after which the program will expire
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="final-min-order-value">Minimum Order Value (₹)</Label>
        <Input
          id="final-min-order-value"
          type="number"
          value={data.minimumOrderValue || ""}
          onChange={(e) => updateData({ minimumOrderValue: parseFloat(e.target.value) || undefined })}
          placeholder="Enter minimum order value (optional)"
          min="0"
          step="0.01"
        />
        <p className="text-sm text-gray-500">
          Minimum order value required to redeem from this program
        </p>
      </div>

      <Separator />

      {/* User Limits Section */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Limits</h3>
            <p className="text-sm text-gray-600 mb-4">Set limits that apply across all campaigns using this program</p>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Enable User Limits</Label>
              <p className="text-sm text-gray-600">
                Set usage limits per user across all campaigns using this program
              </p>
            </div>
            <Switch
              checked={enableUserLimits}
              onCheckedChange={(checked) => updateData({ enableUserLimits: checked })}
            />
          </div>

          {enableUserLimits && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-credit-amount">Max Credit Amount (₹)</Label>
                  <Input
                    id="max-credit-amount"
                    type="number"
                    value={data.maxCreditAmount || ""}
                    onChange={(e) => updateData({ maxCreditAmount: parseInt(e.target.value) || undefined })}
                    placeholder="1000"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">Maximum credit amount per user</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-times-credit">Max Number of Times to Credit</Label>
                  <Input
                    id="max-times-credit"
                    type="number"
                    value={data.maxTimesToCredit || ""}
                    onChange={(e) => updateData({ maxTimesToCredit: parseInt(e.target.value) || undefined })}
                    placeholder="5"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">Maximum times a user can receive credits</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit-period">Period</Label>
                <Select 
                  value={data.limitPeriod || "lifetime"} 
                  onValueChange={(value: "day" | "week" | "month" | "lifetime") => updateData({ limitPeriod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Per Day</SelectItem>
                    <SelectItem value="week">Per Week</SelectItem>
                    <SelectItem value="month">Per Month</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Time period for the limits above</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}