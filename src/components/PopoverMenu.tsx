import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import React from "react";

type PopoverMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
};

export default function PopoverMenu({
  anchorEl,
  open,
  onClose,
  children,
  width = 240,
}: PopoverMenuProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor: "divider",
            p: 1,
          },
        },
      }}
    >
      <MenuList
        sx={{ p: 0, outline: 0, display: "flex", flexDirection: "column" }}
      >
        {children}
      </MenuList>
    </Popover>
  );
}
