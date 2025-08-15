"use client";
import React, { useMemo } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { StackItem } from "@/reducers/userReducers";
import Image from "next/image";

// --- Helper Function ---
const wrap = (min: number, max: number, v: number): number => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- Component Prop Types ---

interface TechStackCarouselProps {
  items?: StackItem[];
  itemWidth?: number;
  gap?: number;
  baseVelocity?: number;
  fadeColor?: string; // Prop to control the fade color
}

// --- The Main Component ---
const TechStackCarousel: React.FC<TechStackCarouselProps> = ({
  items = [],
  itemWidth = 100,
  gap = 40, // Corresponds to gap-10
  baseVelocity = 25, // Positive value for rightward movement
  fadeColor = '#3d2b1f', // Default fade color, assuming a black background
}) => {
  // Calculate the total width of ONE set of items. This is the distance the carousel travels before looping.
  const animationWidth = useMemo(() => items.length * (itemWidth + gap), [items, itemWidth, gap]);

  // The core of the new logic: a motion value that increases indefinitely.
  const x = useMotionValue(0);

  useAnimationFrame((time, delta) => {
    // The base movement is a combination of the base velocity and the current fling velocity
    const moveBy = baseVelocity * (delta / 1000); // delta is in ms, convert to s
    
    // Update the position and use the wrap function to create the infinite loop
    const newX = x.get() + moveBy;
    x.set(wrap(-animationWidth, 0, newX));
  });

  // The content to be rendered inside each of the moving divs.
  const renderContent = () => (
    <>
      {items.map((item, index) => (
        <div 
          key={`${item.description}-${index}`} 
          className="flex-shrink-0 flex flex-col items-center justify-center"
          style={{ width: `${itemWidth}px` }}
          title={item.description}
        >
          <Image 
            src={item.image?.url} 
            alt={item.description} 
            className="h-16 w-16 object-contain"
            onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = `https://placehold.co/100x100/333/fff?text=${item.description.charAt(0)}`; 
            }}
          />
        </div>
      ))}
    </>
  );

  return (
    <div className="w-[50%] py-8 overflow-hidden relative h-24">
      {/* The main container that moves. */}
      <motion.div
        className="flex items-center justify-center flex-nowrap absolute left-0"
        style={{ 
          x, // Use the motion value directly
          gap: `${gap}px`,
          willChange: 'transform' // Performance optimization
        }}
      >
        {/* We render the content twice to create the seamless loop */}
        {renderContent()}
        {renderContent()}
      </motion.div>

      {/* Gradient fade overlays for a "cloud" effect */}
      <div 
        className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${fadeColor}, transparent)` }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${fadeColor})` }}
      />
    </div>
  );
};

export default TechStackCarousel;
