import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  success?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  pattern?: string;
}

export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder,
  required,
  disabled,
  autoComplete,
  pattern,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          pattern={pattern}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-500 focus:ring-red-500 bg-red-50'
              : success
              ? 'border-green-500 focus:ring-green-500 bg-green-50'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } ${isPassword ? 'pr-10' : ''} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'text-gray-900'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />
        )}
        {success && !error && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">{error}</p>}
    </div>
  );
}
