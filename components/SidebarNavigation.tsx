import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarNavigationProps {
  navItems: NavItem[];
  isActive: (path: string) => boolean;
  onLinkClick?: () => void;
}

export default function SidebarNavigation({ navItems, isActive, onLinkClick }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 px-4 py-2 overflow-y-auto ">

      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onLinkClick}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.href)
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
