import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  className,
  children,
  hover = true,
  padding = 'md',
  glass = false,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-slate-700/40 bg-slate-800/70 text-slate-100 shadow-xl shadow-black/40',
        hover && 'card-hover',
        glass && 'glass',
        paddingMap[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
