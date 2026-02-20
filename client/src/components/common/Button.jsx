import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  icon,
  iconPosition = "left",
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    dark:focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:transform-none
  `;

  const variants = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
      focus:ring-primary-500
      shadow-sm hover:shadow-md
      dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700
      dark:focus:ring-primary-400
    `,
    secondary: `
      bg-gray-600 text-white
      hover:bg-gray-700 active:bg-gray-800
      focus:ring-gray-500
      shadow-sm hover:shadow-md
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
      dark:focus:ring-gray-400
    `,
    outline: `
      border-2 border-primary-600 text-primary-600
      hover:bg-primary-50 hover:border-primary-700
      active:bg-primary-100
      focus:ring-primary-500
      dark:border-primary-400 dark:text-primary-400
      dark:hover:bg-primary-900/20 dark:hover:border-primary-300
      dark:active:bg-primary-900/30
      dark:focus:ring-primary-400
    `,
    ghost: `
      text-gray-700 
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-500
      dark:text-gray-300
      dark:hover:bg-gray-800 dark:active:bg-gray-700
      dark:focus:ring-gray-400
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 active:bg-red-800
      focus:ring-red-500
      shadow-sm hover:shadow-md
      dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700
      dark:focus:ring-red-400
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700 active:bg-green-800
      focus:ring-green-500
      shadow-sm hover:shadow-md
      dark:bg-green-500 dark:hover:bg-green-600 dark:active:bg-green-700
      dark:focus:ring-green-400
    `,
    warning: `
      bg-yellow-500 text-white
      hover:bg-yellow-600 active:bg-yellow-700
      focus:ring-yellow-500
      shadow-sm hover:shadow-md
      dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-800
      dark:focus:ring-yellow-400
    `,
    link: `
      text-primary-600 hover:text-primary-700
      hover:underline
      focus:ring-primary-500
      dark:text-primary-400 dark:hover:text-primary-300
      dark:focus:ring-primary-400
    `,
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span>{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

/* ============================================
   BUTTON GROUP COMPONENT
   ============================================ */
export const ButtonGroup = ({ children, className = "" }) => (
  <div className={`inline-flex rounded-lg shadow-sm ${className}`} role="group">
    {React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;

      const isFirst = index === 0;
      const isLast = index === React.Children.count(children) - 1;

      return React.cloneElement(child, {
        className: `
          ${child.props.className || ""}
          ${isFirst ? "rounded-r-none" : ""}
          ${isLast ? "rounded-l-none" : ""}
          ${!isFirst && !isLast ? "rounded-none border-x-0" : ""}
        `,
      });
    })}
  </div>
);

/* ============================================
   ICON BUTTON COMPONENT
   ============================================ */
export const IconButton = ({
  icon,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}) => {
  const iconSizes = {
    xs: "p-1",
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
    xl: "p-4",
  };

  return (
    <Button
      variant={variant}
      className={`${iconSizes[size]} !rounded-full ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default Button;
