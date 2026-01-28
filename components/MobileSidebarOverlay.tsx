interface MobileSidebarOverlayProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileSidebarOverlay({ isOpen, onClick }: MobileSidebarOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClick}
    />
  );
}
