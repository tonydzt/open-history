import { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface DropdownMenuItemProps {
  onClick?: () => void;
  className?: string;
  isDestructive?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, className = '' }) => {
  return <div className={`relative ${className}`}>{children}</div>;
};

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={className}>{children}</div>;
};

const DropdownMenuContent: React.FC<{ 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  align?: 'left' | 'right';
  children: React.ReactNode;
}> = ({ 
  open, 
  onOpenChange, 
  className = '', 
  align = 'left',
  children 
}) => {
  // 关闭菜单当点击外部
  useEffect(() => {
    if (open) {
      const handleClickOutside = (event: MouseEvent) => {
        const dropdownContent = document.querySelector('.dropdown-menu-content');
        const trigger = document.querySelector('.dropdown-menu-trigger');
        
        if (dropdownContent && trigger) {
          const isClickInside = dropdownContent.contains(event.target as Node) || 
                             trigger.contains(event.target as Node);
          
          if (!isClickInside) {
            onOpenChange(false);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className={`
      absolute z-50 mt-2 w-48 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
      dropdown-menu-content
      ${align === 'right' ? 'right-0' : ''}
      animate-in fade-in slide-in-from-top-5 duration-150
      ${className}
    `}>
      {children}
    </div>
  );
};

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  onClick, 
  className = '', 
  isDestructive = false,
  children 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150
        ${isDestructive 
          ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };