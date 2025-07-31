import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProgramData {
  name: string;
  purpose: "promotions" | "loyalty" | "";
  inputType: "event" | "file" | "";
  expiryDays: number;
  minimumOrderValue?: number;
  fileFormatId?: string;
}

interface EventConfigStepProps {
  data: ProgramData;
  updateData: (updates: Partial<ProgramData>) => void;
}

export default function EventConfigStep({ data, updateData }: EventConfigStepProps) {
  const { toast } = useToast();
  const [programId, setProgramId] = useState("");

  useEffect(() => {
    // Generate a random program ID when component mounts
    const id = `iprog_${Math.random().toString(36).substring(2, 15)}`;
    setProgramId(id);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Program ID copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="expiry-days">Expiry Days *</Label>
        <Input
          id="expiry-days"
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
        <Label htmlFor="min-order-value">Minimum Order Value (₹)</Label>
        <Input
          id="min-order-value"
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

      <Card className="p-4 border-blue-200 bg-blue-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Generated Program ID</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(programId)}
              className="h-8 px-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="font-mono text-sm bg-white p-2 rounded border">
            {programId}
          </div>
          <p className="text-sm text-blue-700">
            <strong>Next Step:</strong> You can use this program ID to create campaigns. 
            Navigate to the Campaigns section and select this program when creating 
            event-based campaigns.
          </p>
        </div>
      </Card>
    </div>
  );
}