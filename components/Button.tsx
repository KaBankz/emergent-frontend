import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-white text-black py-2 px-4 rounded-md hover:bg-gray-100 ${className}`}
    />
  );
}
