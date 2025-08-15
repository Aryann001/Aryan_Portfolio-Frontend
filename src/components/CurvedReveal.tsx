"use client";

import { motion, Variants } from 'framer-motion';
import React from 'react';

// Define the type for the component's props
type CurveRevealProps = {
  children: React.ReactNode;
  className?: string;
};

const CurveReveal: React.FC<CurveRevealProps> = ({
  children,
  className,
}) => {
  // A unique ID for the SVG clip-path
  const clipPathId = `curve-reveal-mask-${React.useId()}`;

  // Variants for the <motion.path> element inside the SVG
  const pathVariants: Variants = {
    // Initial state: A flat line at the bottom of the viewbox
    hidden: {
      d: "M0,1 C0.5,1,0.5,1,1,1 L1,1 C0.5,1,0.5,1,0,1 Z",
    },
    // Final state: A shape covering the whole viewbox, with a curved top
    visible: {
      d: "M0,0 C0.5,0.2,0.5,0.2,1,0 L1,1 C0.5,1,0.5,1,0,1 Z",
      transition: {
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    // This motion.div will act as the trigger for the animation
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* This SVG is visually hidden but defines the shape of our mask.
        Its animation is controlled by the parent motion.div.
      */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="objectBoundingBox">
            <motion.path variants={pathVariants} />
          </clipPath>
        </defs>
      </svg>

      {/* This div wraps your content and applies the SVG clip-path by its ID.
        As the <motion.path> animates, this div's visible area will change shape.
      */}
      <div style={{ clipPath: `url(#${clipPathId})` }}>
        {children}
      </div>
    </motion.div>
  );
};

export default CurveReveal;