import { Download, Pencil, Share2 } from "lucide-react";
import type { GlassMenuItem } from "@/components/atoms/GlassMenu";

interface PersonCardBaseMenuProps {
  anyFilled: boolean;
  onRename?: () => void;
  onExport?: () => void;
  onShare: () => void;
}

export function buildPersonCardBaseMenuItems({
  anyFilled,
  onRename,
  onExport,
  onShare,
}: PersonCardBaseMenuProps): GlassMenuItem[] {
  const items: GlassMenuItem[] = [];

  if (onRename) {
    items.push({
      id: "rename",
      label: "Rename",
      icon: Pencil,
      onSelect: onRename,
    });
  }
  if (onExport) {
    items.push({
      id: "export",
      label: "Export CSV",
      icon: Download,
      disabled: !anyFilled,
      onSelect: () => onExport(),
    });
  }
  items.push({
    id: "share",
    label: "Share card",
    icon: Share2,
    disabled: !anyFilled,
    onSelect: () => {
      void onShare();
    },
  });

  return items;
}
