import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  hover = false,
  shadow = "md",
  padding = true,
  className = "",
  variant = "default",
  ...props
}) => {
  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  const variants = {
    default: `
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
    `,
    elevated: `
      bg-white dark:bg-gray-800
    `,
    outlined: `
      bg-transparent
      border-2 border-gray-200 dark:border-gray-700
    `,
    ghost: `
      bg-gray-50 dark:bg-gray-800/50
      border border-gray-100 dark:border-gray-700/50
    `,
  };

  const paddingClass = padding ? "p-6" : "";

  return (
    <motion.div
      initial={false}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }
          : {}
      }
      transition={{ duration: 0.2 }}
      className={`
        rounded-lg overflow-hidden
        transition-all duration-200
        ${variants[variant]}
        ${shadows[shadow]}
        ${paddingClass}
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ============================================
   CARD HEADER
   ============================================ */
export const CardHeader = ({
  children,
  className = "",
  divider = true,
  ...props
}) => (
  <div
    className={`
      px-6 py-4
      ${divider ? "border-b border-gray-200 dark:border-gray-700" : ""}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

/* ============================================
   CARD BODY
   ============================================ */
export const CardBody = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

/* ============================================
   CARD FOOTER
   ============================================ */
export const CardFooter = ({
  children,
  className = "",
  divider = true,
  ...props
}) => (
  <div
    className={`
      px-6 py-4
      ${divider ? "border-t border-gray-200 dark:border-gray-700" : ""}
      bg-gray-50 dark:bg-gray-800/50
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

/* ============================================
   CARD TITLE
   ============================================ */
export const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`
      text-xl font-semibold
      text-gray-900 dark:text-white
      ${className}
    `}
    {...props}
  >
    {children}
  </h3>
);

/* ============================================
   CARD DESCRIPTION
   ============================================ */
export const CardDescription = ({ children, className = "", ...props }) => (
  <p
    className={`
      text-sm
      text-gray-600 dark:text-gray-400
      mt-1
      ${className}
    `}
    {...props}
  >
    {children}
  </p>
);

/* ============================================
   CARD IMAGE
   ============================================ */
export const CardImage = ({ src, alt = "", className = "", ...props }) => (
  <div className="relative w-full h-48 overflow-hidden">
    <img
      src={src}
      alt={alt}
      className={`
        w-full h-full object-cover
        transition-transform duration-300
        hover:scale-105
        ${className}
      `}
      {...props}
    />
  </div>
);

/* ============================================
   CARD BADGE
   ============================================ */
export const CardBadge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    primary:
      "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

/* ============================================
   STATS CARD (Special Variant)
   ============================================ */
export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className = "",
  ...props
}) => {
  const trendColor =
    trend === "up"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  return (
    <Card variant="elevated" hover className={`${className}`} {...props}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {trendValue && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trendColor}`}>
              <span>{trend === "up" ? "↑" : "↓"}</span>
              <span>{trendValue}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <div className="text-primary-600 dark:text-primary-400">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
