import React from 'react';
import { Search, Bell, MessageCircle, Menu, ArrowLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface TopNavbarProps {
  /**
   * Callback function to toggle sidebar visibility.
   * Invoked when the sidebar toggle button is clicked.
   */
  onToggleSidebar?: () => void;
}

/**
 * Top navigation bar component.
 * 
 * Displays a logo, back to home link, sidebar toggle button, search input,
 * and notification icons with user avatar.
 * 
 * @param {TopNavbarProps} props - Component props.
 * @returns {JSX.Element} Rendered TopNavbar component.
 */
const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  return (
    <div className="h-14 border-b border-blue-300 flex items-center justify-between px-4 bg-gray-100">
      {/* Left section: Logo, Back to Home link, and Sidebar toggle */}
      <div className="flex items-center">
        {/* Logo shape */}
        <div className="mr-4">
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-16 border-b-purple-600" />
        </div>

        {/* Go Back to Home Link */}
        <div className="px-4 py-2 border-none border-purple-200 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <NavLink to="/">
            <span className="text-sm">Go Back to Home</span>
          </NavLink>
        </div>

        {/* Sidebar toggle button */}
        <button
          onClick={onToggleSidebar}
          className="ml-4 p-2 rounded hover:bg-gray-200 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Center section: Search input */}
      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search & run commands"
            className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-200 border-none focus:ring-1 focus:ring-gray-500 focus:outline-none text-sm"
            aria-label="Search commands"
          />
        </div>
      </div>

      {/* Right section: Notification icons and user avatar */}
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded hover:bg-gray-100" aria-label="Notifications">
          <Bell className="h-5 w-5 text-gray-700" />
        </button>
        <NavLink to="/chat">
          <button className="p-1 rounded hover:bg-gray-100" aria-label="Chat">
            <MessageCircle className="h-5 w-5 text-gray-700" />
          </button>
        </NavLink>
        <div className="ml-2 flex items-center">
          <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-700">
            VA
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
