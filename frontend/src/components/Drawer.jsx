import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  ChartBarIcon, 
  BeakerIcon, 
  CakeIcon,
  LightBulbIcon,
  XMarkIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

const Drawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth < 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsMediumScreen(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Daily Progress', href: '/dashboard/progress', icon: ChartBarIcon },
    { name: 'Meal', href: '/dashboard/meal', icon: CakeIcon },
    { name: 'Water', href: '/dashboard/water', icon: BeakerIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Suggestions', href: '/dashboard/suggestions', icon: LightBulbIcon },
  ];

  if (isMediumScreen) {
    return (
      <>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed top-4 left-4 p-3 rounded-full bg-green-500 text-white shadow-lg z-[9999] hover:bg-green-600 transition-colors"
          aria-label="Open menu"
        >
          <EllipsisVerticalIcon className="h-6 w-6" />
        </button>
        
        {isDrawerOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}
        
        <div 
          className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-[9999] ${
            isDrawerOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={`${isDrawerOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 h-screen`}>
      <div className="flex flex-col h-full">
        <div className="p-4">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isDrawerOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {isDrawerOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Drawer;    