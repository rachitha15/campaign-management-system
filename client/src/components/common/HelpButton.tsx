import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HelpButton() {
  return (
    <div className="fixed bottom-6 right-6">
      <Button
        variant="default"
        className="rounded-full shadow-lg p-3 flex items-center"
      >
        <HelpCircle className="h-6 w-6 mr-1" />
        Help & Support
      </Button>
    </div>
  );
}
