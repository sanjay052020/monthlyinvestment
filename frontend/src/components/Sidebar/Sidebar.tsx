import React, { useState } from "react";
import {
    House, SquaresFour, Plus, Minus, SignOut, FolderPlus,
    CheckSquare,
    UserFocus,
    UserCirclePlus,
    User,
    ShoppingCart,
    ShoppingBagOpen,
    ShoppingCartSimple,
    Link,
    LinkBreak,
    LinkSimpleHorizontal,
    Money,
    IdentificationCard,
    FileVideo,
    ThermometerCold,
    ArrowsInLineVertical,
    ArticleMedium,
    RepeatOnce,
    File,
    FilePdf,
    FileZip
} from "phosphor-react";
import "./Sidebar.css";
import { useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { handleLogoutCommon } from "../../utils/logoutHelper";
import { SidebarHeader } from "./SidebarHeader";
import { MenuItem } from "./MenuItem";
import { SubMenu } from "./SubMenu";

interface SidebarProps {
    setActiveContent: (content: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveContent }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("Home");
    const dispatch = useAppDispatch();
    const navigator = useNavigate();

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        setActiveContent(tab);
    };

    const handleLogout = () => {
        handleLogoutCommon(dispatch, navigator, setActiveContent);
    };

    return (
        <aside className="sidebar">
            <SidebarHeader />

            <nav className="menu">
                <MenuItem icon={<House size={20} />} label="Home" active={activeTab === "Home"} onClick={() => handleTabClick("Home")} />
                <MenuItem icon={<FolderPlus size={20} />} label="Dummy Excel Open" onClick={() => setActiveContent("excel")} />
                <MenuItem icon={<CheckSquare size={20} />} label="Calculator" onClick={() => setActiveContent("calculator")} />
                <MenuItem
                    icon={<SquaresFour size={20} />}
                    label="Monthly Expanses"
                    active={activeTab === "Dashboard"}
                    onClick={() => toggleSection("Dashboard")}
                    rightIcon={expandedSection === "Dashboard" ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                />
                {expandedSection === "Dashboard" && (
                    <SubMenu
                        items={[
                            {
                                label: "Todo List",
                                icon: <ThermometerCold size={20} />,
                                active: activeTab === "todo",
                                onClick: () => handleTabClick("todo")
                            },
                            { 
                                label: "Enter Investment", 
                                icon: <ArrowsInLineVertical size={20} />,
                                active: activeTab === "EnterExpenses", 
                                onClick: () => handleTabClick("EnterExpenses") 
                            },
                            { 
                                label: "View Expenses", 
                                icon: <ArticleMedium size={20} />,
                                active: activeTab === "ViewMonthly", 
                                onClick: () => handleTabClick("ViewMonthly") 
                            },
                            { 
                                label: "Report Generate", 
                                icon: <RepeatOnce size={20} />,
                                active: activeTab === "ReportGenerate", 
                                onClick: () => handleTabClick("ReportGenerate") 
                            },
                        ]}
                    />
                )}

                {/* Repeat MenuItem + SubMenu for other sections (Settings, Contact, Billing, URLs, Loans) */}

                <MenuItem
                    icon={<UserFocus size={20} />}
                    label="User Contact"
                    onClick={() => toggleSection("contact")}
                    rightIcon={expandedSection === "contact" ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                />
                {expandedSection === "contact" && (
                    <SubMenu
                        items={[
                            {
                                label: "User details",
                                icon: <User size={18} />, // ✅ added icon
                                active: activeTab === "userdetails",
                                onClick: () => handleTabClick("userdetails")
                            },
                            {
                                label: "Add Users",
                                icon: <UserCirclePlus size={18} />, // ✅ consistent icon usage
                                active: activeTab === "enterusers",
                                onClick: () => handleTabClick("enterusers")
                            }
                        ]}
                    />
                )}
                <MenuItem
                    icon={<ShoppingCart size={20} />}
                    label="AjanNest Shop"
                    onClick={() => toggleSection("billing")}
                    rightIcon={expandedSection === "billing" ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                />
                {expandedSection === "billing" && (
                    <SubMenu
                        items={[
                            {
                                label: "Create Bills",
                                icon: <ShoppingBagOpen size={18} />, // ✅ added icon
                                active: activeTab === "createbills",
                                onClick: () => handleTabClick("createbills")
                            },
                            {
                                label: "View Transactions",
                                icon: <ShoppingCartSimple size={18} />, // ✅ consistent icon usage
                                active: activeTab === "showtransaction",
                                onClick: () => handleTabClick("showtransaction")
                            }
                        ]}
                    />
                )}
                <MenuItem
                    icon={<Link size={20} />}
                    label="Important URLs"
                    onClick={() => toggleSection("url")}
                    rightIcon={expandedSection === "url" ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                />
                {expandedSection === "url" && (
                    <SubMenu
                        items={[
                            {
                                label: "Create Urls",
                                icon: <LinkSimpleHorizontal size={18} />, // ✅ added icon
                                active: activeTab === "createurl",
                                onClick: () => handleTabClick("createurl")
                            },
                            {
                                label: "View Urls",
                                icon: <LinkBreak size={18} />, // ✅ consistent icon usage
                                active: activeTab === "viewurl",
                                onClick: () => handleTabClick("viewurl")
                            }
                        ]}
                    />
                )}
                <MenuItem
                    icon={<File size={20} />}
                    label="Personal Documents"
                    onClick={() => toggleSection("documents")}
                    rightIcon={expandedSection === "documents" ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                />
                {expandedSection === "documents" && (
                    <SubMenu
                        items={[
                            {
                                label: "Upload Documents",
                                icon: <FilePdf size={18} />,
                                active: activeTab === "upload",
                                onClick: () => handleTabClick("upload")
                            },
                            {
                                label: "View Documents & Download",
                                icon: <FileZip size={18} />,
                                active: activeTab === "download",
                                onClick: () => handleTabClick("download")
                            }
                        ]}
                    />
                )}
                <MenuItem
                    icon={<Money size={20} />}
                    label="Loans Details"
                    onClick={() => toggleSection("Loans")}
                    rightIcon={expandedSection === "Loans" ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                />
                {expandedSection === "Loans" && (
                    <SubMenu
                        items={[
                            {
                                label: "Add Loan Data",
                                icon: <IdentificationCard size={18} />, // ✅ added icon
                                active: activeTab === "addloan",
                                onClick: () => handleTabClick("addloan")
                            },
                            {
                                label: "View All Loans",
                                icon: <FileVideo size={18} />, // ✅ consistent icon usage
                                active: activeTab === "viewloan",
                                onClick: () => handleTabClick("viewloan")
                            }
                        ]}
                    />
                )}
                <MenuItem icon={<SignOut size={20} />} label="Logout" onClick={handleLogout} />
            </nav>
        </aside>
    );
};

export default Sidebar;