import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Shield, Calendar } from "lucide-react";
import { Wallet as WalletType } from "@shared/schema";

export default function Accounts() {
  const { data: wallets = [], isLoading } = useQuery<WalletType[]>({
    queryKey: ['/api/wallets'],
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

  const totalWallets = wallets.length;
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeWallets = wallets.filter(wallet => wallet.balance > 0).length;

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

      {/* Wallets Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Wallet Details</h2>
          
          {wallets.length === 0 ? (
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
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{wallet.id}</div>
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
                        <div className="font-mono text-sm text-gray-600">{wallet.campaignId}</div>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}