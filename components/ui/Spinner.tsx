import React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, className }) => {
  return (
    <span
      className={clsx('inline-block animate-spin rounded-full border-2 border-t-transparent border-indigo-400', className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
};

export default Spinner;
