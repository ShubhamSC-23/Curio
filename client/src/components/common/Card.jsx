import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  hover = false,
  shadow = 'soft',
  className = '',
  ...props
}) => {
  const shadows = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    lg: 'shadow-lg',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)' } : {}}
      className={`
        bg-white rounded-lg overflow-hidden
        ${shadows[shadow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
    {children}
  </div>
);

export default Card;
