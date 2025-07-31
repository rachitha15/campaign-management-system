import { Link, useLocation } from "wouter";
import { 
  FileText, 
  Link as LinkIcon, 
  MoreHorizontal, 
  X, 
  Users, 
  Tag, 
  Code, 
  ClipboardList, 
  Printer, 
  Settings,
  Megaphone
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <FileText className="h-5 w-5 mr-3" />
              Payment Pages
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <LinkIcon className="h-5 w-5 mr-3" />
              Razorpay.me Link
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 mr-3" />
              +12 More
            </a>
          </li>
        </ul>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            BANKING PRODUCTS
          </h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5 mr-3" />
                X Payroll
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            LOYALTY PRODUCTS
          </h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link 
                href="/campaigns" 
                className={`flex items-center px-3 py-2 rounded-md ${
                  location === '/campaigns' || location === '/' || location === '/programs'
                    ? 'text-primary bg-blue-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Wallet
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            CUSTOMER PRODUCTS
          </h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Users className="h-5 w-5 mr-3" />
                Customers
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Tag className="h-5 w-5 mr-3" />
                Offers
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Code className="h-5 w-5 mr-3" />
                Developers
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <ClipboardList className="h-5 w-5 mr-3" />
                Apps & Deals
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mt-8">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Printer className="h-5 w-5 mr-3" />
                Test Mode
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Settings className="h-5 w-5 mr-3" />
                Account & Settings
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
