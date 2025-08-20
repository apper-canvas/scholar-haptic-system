import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { AuthContext } from "@/App";

const Sidebar = ({ isOpen, onClose, classCount = 0 }) => {
const navigation = [
    { name: "Students", href: "/", icon: "Users" },
    { name: "Parents", href: "/parents", icon: "Users" },
    { name: "Classes", href: "/classes", icon: "BookOpen", count: classCount },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Attendance", href: "/attendance", icon: "Calendar" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  // Desktop Sidebar
const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-gradient-to-b from-primary-900 to-primary-800 border-r border-primary-700">
      <div className="flex items-center px-6 py-4 border-b border-primary-700">
        <div className="flex items-center">
          <div className="p-2 bg-white rounded-lg">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-primary-600" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-white">Scholar Hub</h1>
            <p className="text-xs text-primary-200">Student Management</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-700 text-white shadow-lg"
                      : "text-primary-100 hover:bg-primary-800 hover:text-white"
                  )
                }
>
                <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                {item.name}
                {item.count > 0 && (
                  <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-primary-700">
          <LogoutButton />
        </div>
      </nav>
    </div>
  );

// LogoutButton component
  const LogoutButton = () => {
    const { logout } = useContext(AuthContext) || {};
    
    if (!logout) return null;
    
    return (
      <button
        onClick={logout}
        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-primary-100 hover:bg-primary-800 hover:text-white"
      >
        <ApperIcon name="LogOut" className="h-5 w-5 mr-3" />
        Logout
      </button>
    );
  };

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-900 to-primary-800 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary-700">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-lg">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-white">Scholar Hub</h1>
              <p className="text-xs text-primary-200">Student Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-800 transition-colors duration-200"
          >
            <ApperIcon name="X" className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary-700 text-white shadow-lg"
                        : "text-primary-100 hover:bg-primary-800 hover:text-white"
                    )
                  }
>
                  <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                  {item.name}
                  {item.count > 0 && (
                    <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-primary-700">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;