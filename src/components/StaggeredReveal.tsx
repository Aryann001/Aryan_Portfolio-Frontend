// components/StaggeredReveal.tsx
"use client";

// 1. Import the 'Variants' type from framer-motion
import { motion, Variants } from 'framer-motion';
import React from 'react';

// Define the type for the component's props
type StaggeredRevealProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  animationDuration?: number;
  startOffsetY?: number;
  startOffsetX?: number;
};

const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  className,
  staggerDelay = 0.1,
  animationDuration = 0.6,
  startOffsetY = 25,
  startOffsetX = 0,
}) => {
  // 2. Apply the 'Variants' type to your variants objects
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // 2. Apply the 'Variants' type here as well
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: startOffsetY,
      x: startOffsetX,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: animationDuration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {React.Children.toArray(children).map((child, index) => (
        // This line will now be error-free
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredReveal;