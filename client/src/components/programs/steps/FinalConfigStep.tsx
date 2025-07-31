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
  maxUsagePerUser?: number;
  limitPeriod?: "day" | "week" | "month" | "lifetime";
  cooldownPeriod?: number;
  cooldownUnit?: "hours" | "days";
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
                  <Label htmlFor="max-usage">Max Usage Per User</Label>
                  <Input
                    id="max-usage"
                    type="number"
                    value={data.maxUsagePerUser || ""}
                    onChange={(e) => updateData({ maxUsagePerUser: parseInt(e.target.value) || undefined })}
                    placeholder="5"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">Maximum times a user can benefit</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limit-period">Limit Period</Label>
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
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cooldown-period">Cooldown Period (Optional)</Label>
                  <Input
                    id="cooldown-period"
                    type="number"
                    value={data.cooldownPeriod || ""}
                    onChange={(e) => updateData({ cooldownPeriod: parseInt(e.target.value) || undefined })}
                    placeholder="24"
                    min="1"
                  />
                  <p className="text-sm text-gray-500">Wait time between usage</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooldown-unit">Cooldown Unit</Label>
                  <Select 
                    value={data.cooldownUnit || "hours"} 
                    onValueChange={(value: "hours" | "days") => updateData({ cooldownUnit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}