import { HTMLAttributes, forwardRef, ElementType, AnchorHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type BadgeOwnProps = {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'trust' | 'chapter';
  size?: 'sm' | 'md';
  as?: ElementType;
};

type BadgeProps = BadgeOwnProps & 
  Omit<HTMLAttributes<HTMLSpanElement>, 'as'> & 
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'as'>;

export type { BadgeProps };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, as: Component = 'span', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variantStyles = {
      default: 'bg-border text-text',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error',
      info: 'bg-info/10 text-info',
      trust: 'bg-trust-bg text-trust-text',
      chapter: 'bg-primary/10 text-primary',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
    };

    return (
      <Component
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Badge.displayName = 'Badge';