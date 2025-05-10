import React from 'react';

// Definiert die Eigenschaften für die Button-Komponente
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

// Komponente für die Schaltflächen
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'medium', className, ...props }) => {
  const baseStyle = " rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-primary transition-all duration-150 ease-in-out";

  const variantStyles = {
    primary: "bg-green-600 hover:bg-blue-600 dark:bg-neutral-950 dark:hover:bg-blue-500 text-white focus:ring-neutral-200 dark:focus:ring-neutral-950",
    secondary: "bg-gray-300 hover:bg-gray-400 dark:bg-neutral-800 dark:hover:bg-gray-600 text-neutral-950 dark:text-neutral-100 focus:ring-gray-400 dark:focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white focus:ring-red-400 dark:focus:ring-red-500",
    icon: "bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-gray-600 text-neutral-950 dark:text-neutral-100 focus:ring-gray-400 dark:focus:ring-gray-500 p-3",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
