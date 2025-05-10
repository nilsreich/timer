import React from 'react';

// Definiert die Eigenschaften für die Button-Komponente
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

// Komponente für die Schaltflächen
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'medium', className, ...props }) => {
  const baseStyle = " rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 ease-in-out";
  
  const variantStyles = {
    primary: "bg-teal-700 hover:bg-teal-600 text-white focus:ring-teal-400",
    secondary: "bg-gray-600 hover:bg-gray-500 text-gray-200 focus:ring-gray-500",
    danger: "bg-red-700 hover:bg-red-600 text-white focus:ring-red-400",
    icon: "bg-gray-700 hover:bg-gray-600 text-gray-300 focus:ring-gray-500 p-3",
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
