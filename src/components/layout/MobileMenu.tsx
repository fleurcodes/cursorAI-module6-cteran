import { useEffect } from 'react';
import type { MobileMenuProps } from '../../types/navigation';
import { isActive } from '../../utils/activeLink';

export default function MobileMenu({ links, isOpen, onClose }: MobileMenuProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <nav
      id="mobile-menu"
      aria-label="Mobile navigation"
      className="md:hidden border-t border-gray-100 bg-white"
    >
      <ul className="flex flex-col px-4 py-3 gap-0.5" role="list">
        {links.map((link) => {
          const active = isActive(link.href, link.exact);
          return (
            <li key={link.href}>
              <a
                href={`#${link.href}`}
                aria-current={active ? 'page' : undefined}
                onClick={onClose}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'text-primary font-semibold border-l-4 border-primary bg-primary/5 pl-2.5'
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
