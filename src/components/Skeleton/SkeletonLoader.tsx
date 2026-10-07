import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  animate?: boolean;
}

/**
 * Base generic skeleton container with subtle green-tinted shimmer
 */
export const SkeletonBox: React.FC<SkeletonProps> = ({
  className = '',
  animate = true,
  ...props
}) => {
  return (
    <div
      className={`bg-bamboo-skeleton-box ${animate ? 'animate-shimmer' : ''} ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Skeleton Line / Text Bar
 */
export const SkeletonLine: React.FC<
  SkeletonProps & {
    height?: string;
    width?: string;
  }
> = ({
  className = '',
  height = 'h-4',
  width = 'w-full',
  animate = true,
  ...props
}) => {
  return (
    <div
      className={`${height} ${width} rounded-md bg-bamboo-skeleton-line ${
        animate ? 'animate-shimmer' : ''
      } ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Skeleton Circle (for avatars, icon buttons, badges)
 */
export const SkeletonCircle: React.FC<
  SkeletonProps & {
    size?: string;
  }
> = ({ className = '', size = 'w-10 h-10', animate = true, ...props }) => {
  return (
    <div
      className={`${size} rounded-full bg-bamboo-skeleton-line flex-shrink-0 ${
        animate ? 'animate-shimmer' : ''
      } ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Skeleton Button
 */
export const SkeletonButton: React.FC<
  SkeletonProps & {
    width?: string;
    height?: string;
  }
> = ({
  className = '',
  width = 'w-32',
  height = 'h-10',
  animate = true,
  ...props
}) => {
  return (
    <div
      className={`${width} ${height} rounded-xl bg-bamboo-tint/70 ${
        animate ? 'animate-shimmer' : ''
      } ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

/**
 * Skeleton Card Container
 */
export const SkeletonCard: React.FC<SkeletonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-bamboo-card rounded-2xl sm:rounded-3xl border border-bamboo-divider p-5 sm:p-6 shadow-2xs ${className}`}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  );
};

export default {
  SkeletonBox,
  SkeletonLine,
  SkeletonCircle,
  SkeletonButton,
  SkeletonCard,
};
