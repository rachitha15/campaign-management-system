import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CampaignModalProps {
  open: boolean;
  onClose: () => void;
  onCreateCampaign: (name: string, type: "trigger-based" | "one-time") => void;
}

export function CampaignModal({ open, onClose, onCreateCampaign }: CampaignModalProps) {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<"trigger-based" | "one-time">("one-time");

  const handleSubmit = () => {
    if (!campaignName.trim()) return;
    onCreateCampaign(campaignName, campaignType);
    setCampaignName("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Create New Campaign</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 py-2 pb-4">
          <div>
            <Label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
            <Input 
              id="campaign-name" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="One time campaign"
              className="w-full"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Type</Label>
            <RadioGroup value={campaignType} onValueChange={(v) => setCampaignType(v as "trigger-based" | "one-time")}>
              <div className="flex items-start space-x-3 py-2">
                <RadioGroupItem id="trigger-based" value="trigger-based" className="mt-1" />
                <div>
                  <Label htmlFor="trigger-based" className="text-sm font-medium text-gray-700">Trigger Based Campaign</Label>
                  <p className="text-xs text-gray-500">Credit points when an event is triggered</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 py-2">
                <RadioGroupItem id="one-time" value="one-time" className="mt-1" />
                <div>
                  <Label htmlFor="one-time" className="text-sm font-medium text-gray-700">One Time Campaign</Label>
                  <p className="text-xs text-gray-500">Upload CSV to credit customers in bulk</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleSubmit}>Create Campaign</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
