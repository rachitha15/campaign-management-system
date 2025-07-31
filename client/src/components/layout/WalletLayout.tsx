import { ReactNode } from "react";
import { Link, useLocation } from "wouter";

interface WalletLayoutProps {
  children: ReactNode;
}

export default function WalletLayout({ children }: WalletLayoutProps) {
  const [location] = useLocation();

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', href: '/campaigns' },
    { id: 'batch-actions', label: 'Batch Actions', href: '#' },
    { id: 'accounts', label: 'Accounts', href: '#' },
    { id: 'transactions', label: 'Transactions', href: '#' },
    { id: 'funds', label: 'Funds', href: '#' },
    { id: 'programs', label: 'Programs', href: '/programs' },
  ];

  return (
    <div className="container mx-auto py-6">
      {/* Horizontal Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                location === tab.href || (tab.href === '/campaigns' && location === '/')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {children}
    </div>
  );
}