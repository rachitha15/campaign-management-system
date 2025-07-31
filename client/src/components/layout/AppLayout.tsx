import { ReactNode } from "react";
import { useLocation } from "wouter";
import Header from "./Header";
import Sidebar from "./Sidebar";
import WalletNavigation from "./WalletNavigation";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  
  // Show wallet navigation for wallet-related pages
  const isWalletPage = location === '/campaigns' || location === '/' || location === '/programs' || location === '/accounts';
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#f9fafb] flex flex-col">
          {isWalletPage && <WalletNavigation />}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
