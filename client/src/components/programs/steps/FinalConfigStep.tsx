import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProgramData {
  name: string;
  purpose: "promotions" | "loyalty" | "";
  inputType: "event" | "file" | "";
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
}

interface FinalConfigStepProps {
  data: ProgramData;
  updateData: (updates: Partial<ProgramData>) => void;
}

export default function FinalConfigStep({ data, updateData }: FinalConfigStepProps) {
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
    </div>
  );
}