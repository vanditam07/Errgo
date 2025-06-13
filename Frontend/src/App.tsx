import { Outlet } from 'react-router-dom';
import TopNavbar from './components/TopNavbar';
import { useState } from 'react';
import Sidebar from './components/Sidebar';

/**
 * Main application layout component.
 * 
 * Manages the overall page structure including:
 * - A top navigation bar with a toggle button for sidebar visibility.
 * - A collapsible sidebar.
 * - The main content area rendered via React Router's Outlet.
 *
 * @component
 * @returns {JSX.Element} The app layout with navbar, sidebar, and routed content.
 */
export default function App() {
  /** 
   * State controlling sidebar visibility.
   * When true, sidebar is shown with width 64; otherwise, collapsed to width 0.
   */
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);

  /**
   * Toggles the sidebar visibility state.
   */
  const toggleSidebar = (): void => {
    setSidebarVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/** Pass toggleSidebar handler to the top navigation bar */}
      <TopNavbar onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`transition-all duration-300 ${
            sidebarVisible ? 'w-64' : 'w-0'
          } flex-shrink-0 overflow-hidden`}
        >
          {/** Sidebar component receives current visibility state */}
          <Sidebar visible={sidebarVisible} />
        </div>

        {/** Outlet renders the matched child route component */}
        <Outlet />
      </div>
    </div>
  );
}
