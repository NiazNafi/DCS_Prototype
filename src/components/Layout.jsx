import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plane, Users, Package, User as UserIcon, BarChart3, Settings, LogOut, Bell, ChevronDown, ChevronRight } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/flight-list', icon: Plane, label: 'Flight List' },
    { path: '/check-in', icon: Users, label: 'Check-in Counters' },
    { path: '/boarding', icon: Package, label: 'Boarding Gates' },
    { path: '/weight', icon: BarChart3, label: 'Weight and Balance' },
    { path: '/baggage', icon: Package, label: 'Baggage' },
    { path: '/passengers', icon: UserIcon, label: 'Passenger List' },
    { path: '/reports', icon: BarChart3, label: 'Reports & Statistics' },
    { path: '/admin', icon: Settings, label: 'Administration' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#003366] text-white flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-6 bg-[#002855] flex items-center justify-between">
          {!isCollapsed && <h1 className="text-2xl font-bold">USBA</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto text-gray-300 hover:bg-[#004080] p-1 rounded transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" style={{ transform: 'rotate(180deg)' }} />}
          </button>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-6'} py-3 transition-colors ${
                  isActive ? 'bg-[#FF6B35] text-white' : 'text-gray-300 hover:bg-[#004080]'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#004080] pt-4 pb-4">
          <button className={`relative flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-6'} py-3 text-gray-300 hover:bg-[#004080] transition-colors w-full`} title={isCollapsed ? 'Notifications' : ''}>
            <Bell className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Notifications</span>}
            <span className={`w-2 h-2 bg-red-500 rounded-full ${isCollapsed ? 'absolute top-2 right-2' : 'absolute right-6'}`}></span>
          </button>

          {!isCollapsed && (
            <div className="px-6 py-3 hover:bg-[#004080] transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">Jonal</p>
                      <p className="text-xs text-gray-400 truncate">Station Manager - DAC</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="flex justify-center py-3 hover:bg-[#004080] transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                JD
              </div>
            </div>
          )}
        </div>

        <button className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-6'} py-3 text-gray-300 hover:bg-[#004080] transition-colors border-t border-[#004080]`} title={isCollapsed ? 'Logout' : ''}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
  
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
