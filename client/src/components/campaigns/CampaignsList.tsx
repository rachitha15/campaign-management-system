import { useState } from "react";
import { XCircle, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignModal } from "@/components/common/CampaignModal";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Campaign } from "@/types/campaign";

interface CampaignsListProps {
  onStartOneTimeCampaignFlow: (name: string) => void;
}

export function CampaignsList({ onStartOneTimeCampaignFlow }: CampaignsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: { name: string, type: string }) => {
      const res = await apiRequest('POST', '/api/campaigns', campaignData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating campaign",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });

  const handleCreateCampaign = (name: string, type: "trigger-based" | "one-time") => {
    createCampaignMutation.mutate({ name, type });
    if (type === "one-time") {
      onStartOneTimeCampaignFlow(name);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Active Campaigns</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          New Campaign
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading campaigns...
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No campaigns found. Create your first campaign with the "New Campaign" button.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-red-500 hover:text-red-700">
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <CampaignModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
}
