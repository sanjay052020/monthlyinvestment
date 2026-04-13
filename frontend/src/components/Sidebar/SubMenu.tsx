import React from "react";

interface SubMenuItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

interface SubMenuProps {
  items: SubMenuItem[];
}

export const SubMenu: React.FC<SubMenuProps> = ({ items }) => {
  return (
    <div className="submenu">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`submenu-item ${item.active ? "active" : ""}`}
          onClick={item.onClick}
        >
          {item.icon && <span className="submenu-icon">{item.icon}</span>}
          <span className="submenu-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};