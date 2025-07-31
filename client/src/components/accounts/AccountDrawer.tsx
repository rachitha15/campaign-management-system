import { useState, useEffect } from "react";
import { X, Wallet, Calendar, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Wallet as WalletType, Customer } from "@shared/schema";

interface AccountDrawerProps {
  wallet: WalletType | null;
  isOpen: boolean;
  onClose: () => void;
}

interface UserTransaction {
  id: number;
  campaignId: string;
  campaignName: string;
  amount: number;
  loadId: string;
  createdAt: string;
  type: "credit";
}

export function AccountDrawer({ wallet, isOpen, onClose }: AccountDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const { data: transactions = [], isLoading } = useQuery<UserTransaction[]>({
    queryKey: ['wallet-transactions', wallet?.id],
    queryFn: async () => {
      if (!wallet?.id) return [];
      const response = await fetch(`/api/wallets/${wallet.id}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    enabled: !!wallet?.id,
  });



  const { data: campaignDetails = [] } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return '₹0.00';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(numericAmount);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`ml-auto w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wallet && (
              <>
                {/* User Info */}
                <Card className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">User ID</h3>
                        <p className="text-sm text-gray-600">{wallet.partnerUserId}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Wallet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Current Balance</h3>
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(wallet.balance)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Account Created</h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(wallet.createdAt.toString())}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Transaction History */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h3>
                  
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map((transaction) => (
                        <Card key={transaction.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CreditCard className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Credit from Campaign
                                </p>
                                <p className="text-sm text-gray-600">
                                  {transaction.campaignName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Load ID: {transaction.loadId}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                +{formatCurrency(Number(transaction.amount) || 0)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <div className="space-y-2">
                        <CreditCard className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-gray-600">No transactions found</p>
                        <p className="text-sm text-gray-500">
                          Transactions will appear here when this user participates in campaigns
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}