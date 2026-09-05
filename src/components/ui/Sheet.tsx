'use client';

import { Fragment, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  side?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  showClose?: boolean;
}

const sideStyles = {
  right: 'right-0',
  left: 'left-0',
  bottom: 'bottom-0 left-0 right-0',
};

const sizeStyles = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  full: 'w-full max-w-2xl',
};

const sideAnimation = {
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
};

export function Sheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = 'right',
  size = 'md',
  showClose = true,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      sheetRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab') {
          const focusableElements = sheetRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements?.length) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const portalRoot = document.getElementById('sheet-portal') || document.body;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'sheet-title' : undefined}
        aria-describedby={description ? 'sheet-description' : undefined}
      >
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          ref={sheetRef}
          tabIndex={-1}
          className={clsx(
            'fixed z-50 flex flex-col bg-bg shadow-xl',
            sideStyles[side],
            sizeStyles[size],
            side === 'bottom' ? 'h-auto max-h-[80vh]' : 'h-full',
            side === 'right' || side === 'left' ? 'top-0' : ''
          )}
          initial={sideAnimation[side].initial}
          animate={sideAnimation[side].animate}
          exit={sideAnimation[side].exit}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between px-4 py-4 border-b border-border sticky top-0 bg-bg/95 backdrop-blur z-10">
              <div>
                {title && (
                  <h2 id="sheet-title" className="text-lg font-semibold text-text">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="sheet-description" className="text-sm text-text-muted mt-1">
                    {description}
                  </p>
                )}
              </div>
              {showClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1 -mr-2 -mt-2"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              )}
            </div>
          )}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    portalRoot
  );
}

interface SheetTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function SheetTrigger({ children, asChild = false }: SheetTriggerProps) {
  if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
    return children;
  }
  return <>{children}</>;
}

SheetTrigger.displayName = 'SheetTrigger';