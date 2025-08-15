"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'; // Adjust path if needed

// Animation variants for the left curtain
const leftCurtainVariants = {
  initial: { x: "-100%" }, // Start off-screen to the left
  animate: { x: "0%" },      // Animate to the edge of the screen
  exit: { x: "-100%" },      // Animate back off-screen to the left
};

// Animation variants for the right curtain
const rightCurtainVariants = {
  initial: { x: "100%" }, // Start off-screen to the right
  animate: { x: "0%" },     // Animate to the edge of the screen
  exit: { x: "100%" },     // Animate back off-screen to the right
};

const CurtainLoader = () => {
  // Get the isLoading state from the Redux store
  const { isLoading } = useSelector((state: RootState) => state.loading);

  // Define a reusable transition for a smooth, consistent feel
  const transition = { duration: 0.8, ease: [0.85, 0, 0.15, 1] };

  return (
    // AnimatePresence is crucial for the exit animation to work correctly
    <AnimatePresence>
      {isLoading && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          {/* Left Curtain Panel */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-[#3d2b1f]"
            variants={leftCurtainVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
          />
          
          {/* Right Curtain Panel */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-[#3d2b1f]"
            variants={rightCurtainVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
          />

          {/* Your name/logo will fade in after the curtains close and fade out before they open */}
          <motion.h1
            className="relative text-5xl font-cinzel text-[#faf3e0] z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            Aryan Baghel
          </motion.h1>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CurtainLoader;
