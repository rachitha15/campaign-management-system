import { Link, useLocation } from "wouter";
import { Zap, Settings, Wallet } from "lucide-react";

const navItems = [
  { path: "/campaigns", label: "Campaigns", icon: Zap },
  { path: "/programs", label: "Programs", icon: Settings },
  { path: "/accounts", label: "Accounts", icon: Wallet },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="p-4">
        <div className="mt-4">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            WALLET MANAGEMENT
          </h3>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path === "/campaigns" && location === "/");
              
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-primary bg-blue-50 border-r-2 border-primary' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
