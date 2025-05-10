import React from 'react';

// Definiert die Eigenschaften für die TimerInput-Komponente
export interface TimerInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  max: number;
  disabled?: boolean;
  id?: string; // Added id prop
}

// Komponente für die Zeiteingabefelder
const TimerInput: React.FC<TimerInputProps> = ({ value, onChange, placeholder, label, max, disabled, id }) => (
  <div className="flex flex-col items-center">
    <input
      id={id} // Use id prop
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min="0"
      max={max}
      className="w-20 sm:w-24 h-16 sm:h-20 text-3xl sm:text-4xl text-center bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
    <label htmlFor={id} className="text-xs text-gray-400 mt-1">{label}</label> {/* Use id with htmlFor */}
  </div>
);

export default TimerInput;
