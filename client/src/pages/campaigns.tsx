import { useState } from "react";
import { CampaignsList } from "@/components/campaigns/CampaignsList";
import { OneTimeCampaignFlow } from "@/components/campaigns/OneTimeCampaignFlow";
import { HelpButton } from "@/components/common/HelpButton";

const TABS = [
  "Campaigns",
  "Batch Actions",
  "Accounts",
  "Transactions",
  "Funds",
  "Payments",
  "Loads",
  "Reports"
];

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState("Campaigns");
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
    <div className="py-6 px-8">
      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active-campaign-tab" : "inactive-campaign-tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

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
