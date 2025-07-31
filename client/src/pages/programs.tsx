import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramsList from "@/components/programs/ProgramsList";
import CreateProgramModal from "@/components/programs/CreateProgramModal";
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

export default function Programs() {
  const [location] = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="py-6 px-8">
      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {TABS.map((tab) => (
            tab.href === "#" ? (
              <button
                key={tab.id}
                className="inactive-campaign-tab"
                disabled
              >
                {tab.label}
              </button>
            ) : (
              <Link
                key={tab.id}
                href={tab.href}
                className={
                  location === tab.href || (tab.href === "/campaigns" && location === "/")
                    ? "active-campaign-tab" 
                    : "inactive-campaign-tab"
                }
              >
                {tab.label}
              </Link>
            )
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your promotional and loyalty programs
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Program
        </Button>
      </div>

      <ProgramsList />

      <CreateProgramModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <HelpButton />
    </div>
  );
}