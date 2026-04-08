import React from "react";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  rightIcon?: React.ReactNode;
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, active, onClick, rightIcon }) => (
  <div className={`menu-item ${active ? "active" : ""}`} onClick={onClick}>
    <div className="menu-left">
      {icon}
      <span>{label}</span>
    </div>
    {rightIcon && <div className="menu-right">{rightIcon}</div>}
  </div>
);