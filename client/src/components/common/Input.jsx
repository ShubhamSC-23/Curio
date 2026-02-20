import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      helperText,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      containerClassName = "",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const baseInputStyles = `
      block w-full
      px-4 py-2.5
      text-gray-900 dark:text-white
      bg-white dark:bg-gray-800
      border rounded-lg
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:bg-gray-50 dark:disabled:bg-gray-900
    `;

    const borderStyles = error
      ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
      : isFocused
        ? "border-primary-500 dark:border-primary-400 focus:border-primary-600 focus:ring-primary-500/20"
        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary-500 focus:ring-primary-500/20";

    const iconStyles = error
      ? "text-red-500 dark:text-red-400"
      : isFocused
        ? "text-primary-600 dark:text-primary-400"
        : "text-gray-400 dark:text-gray-500";

    const paddingWithIcon =
      Icon && iconPosition === "left" ? "pl-11" : isPassword ? "pr-11" : "";

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            className={`
              block text-sm font-medium mb-2
              ${
                error
                  ? "text-red-700 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {Icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className={`h-5 w-5 ${iconStyles}`} />
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              ${baseInputStyles}
              ${borderStyles}
              ${paddingWithIcon}
              ${className}
            `}
            {...props}
          />

          {/* Password Toggle Button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`
                absolute inset-y-0 right-0 pr-3
                flex items-center
                ${iconStyles}
                hover:text-gray-600 dark:hover:text-gray-300
                transition-colors duration-200
              `}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Right Icon */}
          {Icon && iconPosition === "right" && !isPassword && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon className={`h-5 w-5 ${iconStyles}`} />
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {(helperText || error) && (
          <p
            className={`
              mt-2 text-sm
              ${
                error
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }
            `}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */
export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      rows = 4,
      fullWidth = false,
      className = "",
      containerClassName = "",
      disabled = false,
      maxLength,
      showCharCount = false,
      ...props
    },
    ref,
  ) => {
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles = `
      block w-full
      px-4 py-2.5
      text-gray-900 dark:text-white
      bg-white dark:bg-gray-800
      border rounded-lg
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      resize-y
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:bg-gray-50 dark:disabled:bg-gray-900
    `;

    const borderStyles = error
      ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
      : isFocused
        ? "border-primary-500 dark:border-primary-400 focus:border-primary-600 focus:ring-primary-500/20"
        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary-500 focus:ring-primary-500/20";

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            className={`
              block text-sm font-medium mb-2
              ${
                error
                  ? "text-red-700 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setCharCount(e.target.value.length);
            if (props.onChange) props.onChange(e);
          }}
          className={`
            ${baseStyles}
            ${borderStyles}
            ${className}
          `}
          {...props}
        />

        {/* Character Count or Helper Text */}
        <div className="flex justify-between items-center mt-2">
          {(helperText || error) && (
            <p
              className={`
                text-sm
                ${
                  error
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              `}
            >
              {error || helperText}
            </p>
          )}
          {showCharCount && maxLength && (
            <p
              className={`
                text-sm ml-auto
                ${
                  charCount >= maxLength
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              `}
            >
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

/* ============================================
   SELECT COMPONENT
   ============================================ */
export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      fullWidth = false,
      className = "",
      containerClassName = "",
      disabled = false,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles = `
      block w-full
      px-4 py-2.5
      text-gray-900 dark:text-white
      bg-white dark:bg-gray-800
      border rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:bg-gray-50 dark:disabled:bg-gray-900
      appearance-none
      cursor-pointer
    `;

    const borderStyles = error
      ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20"
      : isFocused
        ? "border-primary-500 dark:border-primary-400 focus:border-primary-600 focus:ring-primary-500/20"
        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary-500 focus:ring-primary-500/20";

    return (
      <div className={`${fullWidth ? "w-full" : ""} ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            className={`
              block text-sm font-medium mb-2
              ${
                error
                  ? "text-red-700 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            `}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              ${baseStyles}
              ${borderStyles}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`h-5 w-5 ${
                error
                  ? "text-red-500 dark:text-red-400"
                  : isFocused
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-400 dark:text-gray-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Helper Text or Error Message */}
        {(helperText || error) && (
          <p
            className={`
              mt-2 text-sm
              ${
                error
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }
            `}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

/* ============================================
   CHECKBOX COMPONENT
   ============================================ */
export const Checkbox = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = "",
      containerClassName = "",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={containerClassName}>
        <label
          className={`flex items-center ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className={`
              w-4 h-4
              text-primary-600 dark:text-primary-500
              bg-white dark:bg-gray-800
              border-gray-300 dark:border-gray-600
              rounded
              focus:ring-2 focus:ring-primary-500 focus:ring-offset-0
              transition-colors duration-200
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
              ${className}
            `}
            {...props}
          />
          {label && (
            <span
              className={`ml-2 text-sm ${error ? "text-red-700 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
            >
              {label}
            </span>
          )}
        </label>
        {(helperText || error) && (
          <p
            className={`
              mt-1 ml-6 text-sm
              ${error ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}
            `}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Input;
