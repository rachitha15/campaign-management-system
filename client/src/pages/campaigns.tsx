import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CampaignsList } from "@/components/campaigns/CampaignsList";
import { OneTimeCampaignFlow } from "@/components/campaigns/OneTimeCampaignFlow";
import { HelpButton } from "@/components/common/HelpButton";

const TABS = [
  { id: "campaigns", label: "Campaigns", href: "/campaigns" },
  { id: "programs", label: "Programs", href: "/programs" },
  { id: "batch-actions", label: "Batch Actions", href: "#" },
  { id: "accounts", label: "Accounts", href: "#" },
  { id: "transactions", label: "Transactions", href: "#" },
  { id: "funds", label: "Funds", href: "#" },
  { id: "payments", label: "Payments", href: "#" },
  { id: "loads", label: "Loads", href: "#" },
  { id: "reports", label: "Reports", href: "#" }
];

export default function Campaigns() {
  const [location] = useLocation();
  const [showOneTimeCampaignFlow, setShowOneTimeCampaignFlow] = useState(false);
  const [campaignName, setCampaignName] = useState("");

  const handleStartOneTimeCampaignFlow = (name: string) => {
    setCampaignName(name);
    setShowOneTimeCampaignFlow(true);
  };

  const handleCloseOneTimeCampaignFlow = () => {
    setShowOneTimeCampaignFlow(false);
  };

  return (
    <div className="space-y-6">

      {/* Main Content */}
      {showOneTimeCampaignFlow ? (
        <OneTimeCampaignFlow 
          campaignName={campaignName}
          onClose={handleCloseOneTimeCampaignFlow}
        />
      ) : (
        <CampaignsList onStartOneTimeCampaignFlow={handleStartOneTimeCampaignFlow} />
      )}

      <HelpButton />
    </div>
  );
}
