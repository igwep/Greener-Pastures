import React from 'react';
interface AvatarProps {
  src?: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export function Avatar({
  src,
  initials,
  size = 'md',
  className = ''
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl'
  };
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-ajo-100 text-ajo-800 font-semibold overflow-hidden shrink-0 ${sizes[size]} ${className}`}>
      
      {src ?
      <img src={src} alt={initials} className="w-full h-full object-cover" /> :

      <span>{initials}</span>
      }
    </div>);

}