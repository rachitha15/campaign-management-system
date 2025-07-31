import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Shield, Calendar, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wallet as WalletType } from "@shared/schema";
import { AccountDrawer } from "@/components/accounts/AccountDrawer";

export default function Accounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: wallets = [], isLoading, refetch } = useQuery<WalletType[]>({
    queryKey: ['/api/wallets'],
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch to get latest data
  });

  // Filter wallets based on search term
  const filteredWallets = wallets.filter(wallet => {
    const searchLower = searchTerm.toLowerCase();
    return (
      wallet.partnerUserId.toLowerCase().includes(searchLower) ||
      wallet.id.toLowerCase().includes(searchLower)
    );
  });

  const handleAccountClick = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedWallet(null);
  };

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Wallet accounts created from campaign actions</p>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const totalWallets = filteredWallets.length;
  const totalBalance = filteredWallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeWallets = filteredWallets.filter(wallet => wallet.balance > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Accounts</h1>
        <p className="text-gray-600 mt-1">Wallet accounts created from campaign actions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Wallets</p>
              <p className="text-2xl font-semibold text-gray-900">{totalWallets}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Wallets</p>
              <p className="text-2xl font-semibold text-gray-900">{activeWallets}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Partner User ID or Wallet ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Search
          </Button>
        </div>
      </Card>

      {/* Wallets Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Wallet Details</h2>
          
          {filteredWallets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets found</h3>
              <p className="text-gray-600">
                Wallets will appear here after publishing one-time campaigns with CSV data.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet ID</TableHead>
                    <TableHead>Partner User ID</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet) => (
                    <TableRow 
                      key={wallet.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleAccountClick(wallet)}
                    >
                      <TableCell>
                        <div className="font-mono text-sm text-blue-600 hover:text-blue-800 cursor-pointer border-b border-dotted border-blue-300 hover:border-blue-500">
                          {wallet.id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Click to view transactions</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{wallet.partnerUserId}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(wallet.balance)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(wallet.createdAt.toString())}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={wallet.balance > 0 ? "default" : "secondary"}
                          className={wallet.balance > 0 ? "bg-green-100 text-green-800" : ""}
                        >
                          {wallet.balance > 0 ? "Active" : "Empty"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccountClick(wallet);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Account Drawer */}
      <AccountDrawer 
        wallet={selectedWallet}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}