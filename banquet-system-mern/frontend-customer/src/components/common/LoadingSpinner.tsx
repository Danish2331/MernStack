import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 40, className = '', fullScreen = false }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <Loader2 size={size} className={`animate-spin text-oberoi-gold ${className}`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={size} className={`animate-spin text-oberoi-gold ${className}`} />
    </div>
  );
};

export default LoadingSpinner;
