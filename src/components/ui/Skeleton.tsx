import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'product-card' | 'chapter-card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-border rounded';

  const variantStyles = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    'product-card': '',
    'chapter-card': '',
  };

  const variantSizes = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '1rem', height: '1rem' },
    rectangular: { width: '100%', height: '1rem' },
    'product-card': { width: '100%', height: '100%' },
    'chapter-card': { width: '100%', height: '100%' },
  };

  if (variant === 'product-card') {
    return (
      <div className={clsx('product-card', className)} {...props}>
        <div className="aspect-[4/5] w-full skeleton rectangular" style={{ borderRadius: '0.5rem 0.5rem 0 0' }} />
        <div className="p-4 space-y-3">
          <div className="h-4 w-3/4 skeleton text" />
          <div className="h-4 w-1/2 skeleton text" />
          <div className="h-5 w-24 skeleton rectangular" />
          <div className="h-12 w-full skeleton rectangular mt-4" />
        </div>
      </div>
    );
  }

  if (variant === 'chapter-card') {
    return (
      <div className={clsx('chapter-card', className)} {...props}>
        <div className="aspect-square w-full skeleton rectangular" style={{ borderRadius: '0.5rem 0.5rem 0 0' }} />
        <div className="p-4 space-y-3">
          <div className="h-4 w-1/2 skeleton text" />
          <div className="h-4 w-3/4 skeleton text" />
          <div className="h-12 w-full skeleton rectangular mt-4" />
        </div>
      </div>
    );
  }

  if (lines > 1 && variant === 'text') {
    return (
      <div className={clsx('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(baseStyles, variantStyles[variant])}
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              height: variantSizes[variant].height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(baseStyles, variantStyles[variant], className)}
      style={{
        width: width ?? variantSizes[variant].width,
        height: height ?? variantSizes[variant].height,
      }}
      {...props}
    />
  );
}