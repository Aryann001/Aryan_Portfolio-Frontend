"use client";

import React, { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';

// Define the types for the component's props
interface PeelWrapperProps {
  children: ReactNode;
  // Allows you to pass additional classes for background colors, etc.
  className?: string;
}

const PeelWrapper: React.FC<PeelWrapperProps> = ({ children, className }) => {
    // A ref for the sticky container that holds your content
    const stickyContainerRef = useRef<HTMLDivElement | null>(null);

    // We track the scroll progress of the sticky container itself
    const { scrollYProgress } = useScroll({
        target: stickyContainerRef,
        // The animation starts when the bottom of your content hits the bottom of the screen.
        // It ends after you've scrolled another 50% of the screen's height.
        // This creates a much slower and more deliberate peel effect.
        offset: ["end end", "end 50%"]
    });

    // This transforms the scroll progress (0 to 1) into the 'd' attribute of an SVG path,
    // creating the dynamic, curvy shape for the mask.
    const pathD = useTransform(scrollYProgress, (value) => {
        // When scroll progress is 0, the path is a full rectangle (fully visible).
        if (value <= 0) {
            return "M 0,0 L 1,0 L 1,1 L 0,1 Z";
        }
        // As scroll progresses, the bottom edge moves up and curves.
        const y = 1 - value;
        // The control point for the curve is pulled up more aggressively to create a nice arc.
        const controlPointY = 1 - (value * 1.8);
        return `M 0,0 L 1,0 L 1,${y} Q 0.5,${controlPointY} 0,${y} Z`;
    });

    // A unique ID for the clip-path to avoid conflicts.
    const clipId = "peel-clip-path-id-" + React.useId();

    return (
        // 1. A container that adds padding to the bottom. This creates the extra
        // scroll space needed for the animation to play out.
        <div className="relative pb-[50vh] z-10">
            {/* 2. A sticky container that holds your content. Its height is determined
              by the content inside it, so nothing gets cut off. */}
            <div ref={stickyContainerRef} className="sticky top-0">
                {/* 3. The SVG definitions are hidden but are referenced by the clip-path. */}
                <svg className="absolute w-0 h-0">
                    <defs>
                        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                            <motion.path d={pathD} />
                        </clipPath>
                    </defs>
                </svg>

                {/* 4. This is the content wrapper that gets "peeled". */}
                <div
                    style={{ clipPath: `url(#${clipId})` }}
                    className={className}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PeelWrapper;
