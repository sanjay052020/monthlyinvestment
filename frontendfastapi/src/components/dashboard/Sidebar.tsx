import React, { useState } from "react";
import {
  House,
  SquaresFour,
  FolderPlus,
  CheckSquare,
  Gear,
  User,
  IdentificationCard,
  LockSimple,
  PuzzlePiece,
  CreditCard,
  ChatCircle,
  Bell,
  Lifebuoy,
  Plus,
  Minus,
  SignOut,
  UserFocus
} from "phosphor-react";
import "./Sidebar.css";
import { useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { handleLogoutCommon } from "../../utils/logoutHelper";


interface SidebarProps {
  setActiveContent: (content: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveContent }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("Home");
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const navigator = useNavigate()

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setActiveContent(tab);
  };
  const handleLogout = () => {
    handleLogoutCommon(dispatch, navigator, setActiveContent);
  };



  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">Monthly Expenses ▼</div>
      </div>

      {/* Search */}
      {/* <div className="search-bar">
        <MagnifyingGlass size={16} />
        <input type="text" placeholder="Search..." />
      </div> */}

      {/* Menu */}
      <nav className="menu">
        <div className={`menu-item ${activeTab === "Home" ? "active" : ""}`} onClick={() => handleTabClick("Home")}>
          <div className="menu-left">
            <House size={20} />
            <span>Home</span>
          </div>
        </div>

        {/* Dashboard */}
        <div className={`menu-item ${activeTab === "Dashboard" ? "active" : ""}`} onClick={() => toggleSection("Dashboard")}>
          <div className="menu-left">
            <SquaresFour size={20} />
            <span>Dashboard</span>
          </div>
          <div className="menu-right">
            {expandedSection === "Dashboard" ? (
              <Minus size={18} weight="bold" />
            ) : (
              <Plus size={18} weight="bold" />
            )}
          </div>
        </div>
        {expandedSection === "Dashboard" && (
          <div className="submenu">
            <div className={`submenu-item ${activeTab === "todo" ? "active" : ""}`} onClick={() => handleTabClick("todo")}>
              Todo List
            </div>
            <div className={`submenu-item ${activeTab === "EnterExpenses" ? "active" : ""}`} onClick={() => handleTabClick("EnterExpenses")}>
              Enter Investment Expenses
            </div>
            <div className={`submenu-item ${activeTab === "ViewMonthly" ? "active" : ""}`} onClick={() => handleTabClick("ViewMonthly")}>
              View Expenses
            </div>
            <div className={`submenu-item ${activeTab === "ReportGenerate" ? "active" : ""}`} onClick={() => handleTabClick("ReportGenerate")}>
              Report Generate
            </div>
          </div>
        )}

        {/* Projects */}
        <div className={`menu-item ${activeTab === "excel" ? "active" : ""}`} onClick={() => handleTabClick("excel")}>
          <div className="menu-left">
            <FolderPlus size={20} />
            <span>Dummy Excel Open</span>
          </div>
        </div>

        {/* Tasks */}
        <div className={`menu-item ${activeTab === "calculator" ? "active" : ""}`} onClick={() => handleTabClick("calculator")}>
          <div className="menu-left">
            <CheckSquare size={20} />
            <span>Calculator</span>
          </div>
        </div>

        {/* Settings */}
        <div className="menu-item" onClick={() => toggleSection("Settings")}>
          <div className="menu-left">
            <Gear size={20} />
            <span>Settings</span>
          </div>
          <div className="menu-right">
            {expandedSection === "Settings" ? (
              <Minus size={18} weight="bold" />
            ) : (
              <Plus size={18} weight="bold" />
            )}
          </div>
        </div>
        {expandedSection === "Settings" && (
          <div className="submenu">
            <div className="submenu-item"><User size={18} /> My details</div>
            <div className="submenu-item"><IdentificationCard size={18} /> Profile</div>
            <div className="submenu-item"><LockSimple size={18} /> Security</div>
            <div className="submenu-item"><PuzzlePiece size={18} /> Integrations</div>
            <div className="submenu-item"><CreditCard size={18} /> Billing</div>
          </div>
        )}

        {/* User Contact */}
        <div className="menu-item" onClick={() => toggleSection("contact")}>
          <div className="menu-left">
            <UserFocus size={20} />
            <span>User Contact</span>
          </div>
          <div className="menu-right">
            {expandedSection === "contact" ? (
              <Minus size={18} weight="bold" />
            ) : (
              <Plus size={18} weight="bold" />
            )}
          </div>
        </div>
        {expandedSection === "contact" && (
          <div className="submenu">
            <div className={`submenu-item ${activeTab === "userdetails" ? "active" : ""}`} onClick={() => handleTabClick("userdetails")}><User size={18} /> User details</div>
            <div className={`submenu-item ${activeTab === "enterusers" ? "active" : ""}`} onClick={() => handleTabClick("enterusers")}><IdentificationCard size={18} /> Enter Users</div>
          </div>
        )}

        {/* User Billing */}
        <div className="menu-item" onClick={() => toggleSection("billing")}>
          <div className="menu-left">
            <UserFocus size={20} />
            <span>AjanNext Shop</span>
          </div>
          <div className="menu-right">
            {expandedSection === "billing" ? (
              <Minus size={18} weight="bold" />
            ) : (
              <Plus size={18} weight="bold" />
            )}
          </div>
        </div>
        {expandedSection === "billing" && (
          <div className="submenu">
            <div className={`submenu-item ${activeTab === "createbills" ? "active" : ""}`} onClick={() => handleTabClick("createbills")}><User size={18} />Create Customer Bills</div>
            <div className={`submenu-item ${activeTab === "showtransaction" ? "active" : ""}`} onClick={() => handleTabClick("showtransaction")}><IdentificationCard size={18} />Transaction Bills</div>
          </div>
        )}

        <div className="menu-item" onClick={() => setActiveContent("url")}>
          <div className="menu-left">
            <ChatCircle size={20} /> Important URL
          </div>
        </div>
        <div className="menu-item" onClick={() => setActiveContent("Updates")}>
          <div className="menu-left">
            <Bell size={20} /> Updates
          </div>
        </div>
        <div className="menu-item" onClick={() => setActiveContent("Support")}>
          <div className="menu-left">
            <Lifebuoy size={20} /> Support
          </div>
        </div>
        <div className="menu-item" onClick={handleLogout}>
          <div className="menu-left">
            <SignOut size={20} />
            <span>Logout</span>
          </div>
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;