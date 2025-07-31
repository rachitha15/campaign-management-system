import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Shield, User } from "lucide-react";
import { CampaignSettings } from "@/types/campaign";

interface CampaignSettingsStepProps {
  onNext: (settings: CampaignSettings) => void;
  onBack: () => void;
  initialData?: CampaignSettings;
}

const DURATION_OPTIONS = [
  { value: "day", label: "Per Day" },
  { value: "week", label: "Per Week" },
  { value: "month", label: "Per Month" },
  { value: "lifetime", label: "Lifetime" }
];

const TIME_OPTIONS = [
  "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM",
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
];

export function CampaignSettingsStep({ onNext, onBack, initialData }: CampaignSettingsStepProps) {
  // Schedule state
  const [startDate, setStartDate] = useState(initialData?.schedule.startDate || "");
  const [startTime, setStartTime] = useState(initialData?.schedule.startTime || "");
  const [startImmediately, setStartImmediately] = useState(initialData?.schedule.startImmediately ?? true);
  const [endDate, setEndDate] = useState(initialData?.schedule.endDate || "");
  const [endTime, setEndTime] = useState(initialData?.schedule.endTime || "");
  const [noEndDate, setNoEndDate] = useState(initialData?.schedule.noEndDate ?? true);

  // Campaign Limits state
  const [limitTotalAmount, setLimitTotalAmount] = useState(initialData?.campaignLimits.limitTotalAmount ?? false);
  const [maxTotalAmount, setMaxTotalAmount] = useState(initialData?.campaignLimits.maxTotalAmount?.toString() || "");
  const [totalAmountDuration, setTotalAmountDuration] = useState(initialData?.campaignLimits.totalAmountDuration || "lifetime");
  const [limitTotalActions, setLimitTotalActions] = useState(initialData?.campaignLimits.limitTotalActions ?? false);
  const [maxTotalActions, setMaxTotalActions] = useState(initialData?.campaignLimits.maxTotalActions?.toString() || "");
  const [totalActionsDuration, setTotalActionsDuration] = useState(initialData?.campaignLimits.totalActionsDuration || "lifetime");

  // User Limits state
  const [limitUserAmount, setLimitUserAmount] = useState(initialData?.userLimits.limitUserAmount ?? false);
  const [maxUserAmount, setMaxUserAmount] = useState(initialData?.userLimits.maxUserAmount?.toString() || "");
  const [userAmountDuration, setUserAmountDuration] = useState(initialData?.userLimits.userAmountDuration || "lifetime");
  const [limitUserActions, setLimitUserActions] = useState(initialData?.userLimits.limitUserActions ?? false);
  const [maxUserActions, setMaxUserActions] = useState(initialData?.userLimits.maxUserActions?.toString() || "");
  const [userActionsDuration, setUserActionsDuration] = useState(initialData?.userLimits.userActionsDuration || "lifetime");

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateForInput(tomorrow);
  };

  const handleNext = () => {
    const settings: CampaignSettings = {
      schedule: {
        startDate: startImmediately ? "" : startDate,
        startTime: startImmediately ? "" : startTime,
        startImmediately,
        endDate: noEndDate ? "" : endDate,
        endTime: noEndDate ? "" : endTime,
        noEndDate
      },
      campaignLimits: {
        limitTotalAmount,
        maxTotalAmount: limitTotalAmount ? parseInt(maxTotalAmount) || 0 : undefined,
        totalAmountDuration: limitTotalAmount ? totalAmountDuration : undefined,
        limitTotalActions,
        maxTotalActions: limitTotalActions ? parseInt(maxTotalActions) || 0 : undefined,
        totalActionsDuration: limitTotalActions ? totalActionsDuration : undefined
      },
      userLimits: {
        limitUserAmount,
        maxUserAmount: limitUserAmount ? parseInt(maxUserAmount) || 0 : undefined,
        userAmountDuration: limitUserAmount ? userAmountDuration : undefined,
        limitUserActions,
        maxUserActions: limitUserActions ? parseInt(maxUserActions) || 0 : undefined,
        userActionsDuration: limitUserActions ? userActionsDuration : undefined
      }
    };

    onNext(settings);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Campaign Settings</h2>
        <p className="text-gray-600">Configure scheduling, limits, and other campaign parameters.</p>
      </div>

      {/* Schedule Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium">Schedule</h3>
          </div>

          {/* Start Date */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-sm text-gray-600">Starts From</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={startImmediately}
                  min={formatDateForInput(new Date())}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">At</Label>
                <Select value={startTime} onValueChange={setStartTime} disabled={startImmediately}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="startImmediately" 
                  checked={startImmediately}
                  onCheckedChange={(checked) => setStartImmediately(!!checked)}
                />
                <Label htmlFor="startImmediately" className="text-sm">Start Immediately</Label>
              </div>
            </div>

            {/* End Date */}
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-sm text-gray-600">Ends On</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={noEndDate}
                  min={startDate || getTomorrowDate()}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">At</Label>
                <Select value={endTime} onValueChange={setEndTime} disabled={noEndDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="noEndDate" 
                  checked={noEndDate}
                  onCheckedChange={(checked) => setNoEndDate(!!checked)}
                />
                <Label htmlFor="noEndDate" className="text-sm">No End Date</Label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Campaign Limits Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium">Campaign Limits</h3>
          </div>
          <p className="text-sm text-gray-600 -mt-2">
            These limits apply to the entire campaign. When breached, the campaign will pause, and no further rewards will be credited.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Total Amount Limit */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="limitTotalAmount" 
                  checked={limitTotalAmount}
                  onCheckedChange={(checked) => setLimitTotalAmount(!!checked)}
                />
                <Label htmlFor="limitTotalAmount">Limit total amount credited</Label>
              </div>
              
              {limitTotalAmount && (
                <>
                  <div>
                    <Label className="text-sm text-gray-600">Max amount</Label>
                    <div className="flex items-center mt-1">
                      <span className="text-gray-600 mr-2">₹</span>
                      <Input
                        type="text"
                        value={maxTotalAmount}
                        onChange={(e) => setMaxTotalAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Amount"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Applies</Label>
                    <Select value={totalAmountDuration} onValueChange={setTotalAmountDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Total Actions Limit */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="limitTotalActions" 
                  checked={limitTotalActions}
                  onCheckedChange={(checked) => setLimitTotalActions(!!checked)}
                />
                <Label htmlFor="limitTotalActions">Limit no. of actions performed</Label>
              </div>
              
              {limitTotalActions && (
                <>
                  <div>
                    <Label className="text-sm text-gray-600">Max actions</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        type="text"
                        value={maxTotalActions}
                        onChange={(e) => setMaxTotalActions(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="No. of"
                        className="flex-1 mr-2"
                      />
                      <span className="text-gray-600">times</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Applies</Label>
                    <Select value={totalActionsDuration} onValueChange={setTotalActionsDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* User Limits Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium">User Limits</h3>
          </div>
          <p className="text-sm text-gray-600 -mt-2">
            These limits apply to individual users. When breached, the campaign will stop crediting rewards to that user.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* User Amount Limit */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="limitUserAmount" 
                  checked={limitUserAmount}
                  onCheckedChange={(checked) => setLimitUserAmount(!!checked)}
                />
                <Label htmlFor="limitUserAmount">Limit total amount credited per user</Label>
              </div>
              
              {limitUserAmount && (
                <>
                  <div>
                    <Label className="text-sm text-gray-600">Max amount</Label>
                    <div className="flex items-center mt-1">
                      <span className="text-gray-600 mr-2">₹</span>
                      <Input
                        type="text"
                        value={maxUserAmount}
                        onChange={(e) => setMaxUserAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Amount"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Applies</Label>
                    <Select value={userAmountDuration} onValueChange={setUserAmountDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* User Actions Limit */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="limitUserActions" 
                  checked={limitUserActions}
                  onCheckedChange={(checked) => setLimitUserActions(!!checked)}
                />
                <Label htmlFor="limitUserActions">Limit no. of actions per user</Label>
              </div>
              
              {limitUserActions && (
                <>
                  <div>
                    <Label className="text-sm text-gray-600">Max actions</Label>
                    <div className="flex items-center mt-1">
                      <Input
                        type="text"
                        value={maxUserActions}
                        onChange={(e) => setMaxUserActions(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="No. of"
                        className="flex-1 mr-2"
                      />
                      <span className="text-gray-600">times</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Applies</Label>
                    <Select value={userActionsDuration} onValueChange={setUserActionsDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} className="px-6 py-2">
          Next: Review & Publish
        </Button>
      </div>
    </div>
  );
}