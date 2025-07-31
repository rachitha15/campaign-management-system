import { Link, useLocation } from "wouter";

const navItems = [
  { path: "/campaigns", label: "Campaigns" },
  { path: "/programs", label: "Programs" },
  { path: "/accounts", label: "Accounts" },
];

export default function WalletNavigation() {
  const [location] = useLocation();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6">
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path === "/campaigns" && location === "/");
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}