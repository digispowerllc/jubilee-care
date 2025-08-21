import { cn } from '@/lib/utils/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = 'medium',
  className,
  fullPage = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div
          className={cn(
            'animate-spin rounded-full border-t-2 border-b-2 border-red-600',
            sizeClasses[size],
            className
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-t-2 border-b-2 border-red-600',
        sizeClasses[size],
        className
      )}
    />
  );
}