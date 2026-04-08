import React, { useState } from "react";
import { Plus, Minus } from "phosphor-react";
import { MenuItem } from "./MenuItem";
import { SubMenu } from "./SubMenu";

interface SubMenuItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

interface SidebarMenuProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  sectionKey: string;
  expandedSection: string | null;
  toggleSection: (section: string) => void;
  subItems?: SubMenuItem[];
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  label,
  icon,
  active,
  sectionKey,
  expandedSection,
  toggleSection,
  subItems = []
}) => {
  const isExpanded = expandedSection === sectionKey;

  return (
    <>
      <MenuItem
        icon={icon}
        label={label}
        active={active}
        onClick={() => toggleSection(sectionKey)}
        rightIcon={isExpanded ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
      />
      {isExpanded && subItems.length > 0 && <SubMenu items={subItems} />}
    </>
  );
};