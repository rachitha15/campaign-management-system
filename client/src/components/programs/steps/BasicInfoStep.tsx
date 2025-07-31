import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProgramData {
  name: string;
  purpose: "promotions" | "loyalty" | "";
  inputType: "event" | "file" | "";
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
}

interface BasicInfoStepProps {
  data: ProgramData;
  updateData: (updates: Partial<ProgramData>) => void;
}

export default function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="program-name">Program Name *</Label>
        <Input
          id="program-name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="Enter program name"
        />
      </div>

      <div className="space-y-2">
        <Label>Purpose *</Label>
        <Select value={data.purpose} onValueChange={(value) => updateData({ purpose: value as "promotions" | "loyalty" })}>
          <SelectTrigger>
            <SelectValue placeholder="Select program purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="promotions">Promotions</SelectItem>
            <SelectItem value="loyalty">Loyalty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Input Type *</Label>
        <RadioGroup
          value={data.inputType}
          onValueChange={(value) => updateData({ inputType: value as "event" | "file" })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="event" id="event" />
            <Label htmlFor="event" className="cursor-pointer">
              Event - Configure for event-based triggers
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id="file" />
            <Label htmlFor="file" className="cursor-pointer">
              File Upload - Use CSV data for bulk processing
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}