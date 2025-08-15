"use client";
import React, { useRef, useMemo, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useAnimationFrame,
  PanInfo,
} from "framer-motion";
import ProjectCard from "./ProjectCard"; // Assuming this is your actual ProjectCard component
import { Project } from "@/reducers/productsReducer";

// --- Helper Function ---
const wrap = (min: number, max: number, v: number): number => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- Custom Hook for Mouse Position ---
const useMouseLocation = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

// --- Component Prop Types ---

interface WorkCarouselProps {
  items: Project[];
  cardWidth?: number;
  gap?: number;
  baseVelocity?: number;
}

// --- The Main Component ---
const WorkCarousel: React.FC<WorkCarouselProps> = ({
  items,
  cardWidth = 350,
  gap = 40, // Corresponds to gap-[2.5rem]
  baseVelocity = -50,
}) => {
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: true, margin: "-100px" });
  const { x: mouseX, y: mouseY } = useMouseLocation();

  // FIX: Increased the number of duplicated items from 2 to 4.
  // This creates a much larger buffer, hiding the wrap-around point and fixing the visual glitch.
  const duplicatedItems = useMemo(() => [...items, ...items, ...items, ...items], [items]);
  
  const animationWidth = useMemo(() => items.length * (cardWidth + gap), [items.length, cardWidth, gap]);

  const x = useMotionValue(0);
  const velocity = useRef(0);
  const lastFrameTime = useRef(performance.now());

  useAnimationFrame(() => {
    const now = performance.now();
    const delta = (now - lastFrameTime.current) / 1000;
    lastFrameTime.current = now;

    velocity.current *= 0.95;
    const moveBy = (baseVelocity + velocity.current) * delta;
    
    const newX = x.get() + moveBy;
    x.set(wrap(-animationWidth, 0, newX));
  });
  
  const dragStartPos = useRef(0);

  const onPanStart = () => {
    velocity.current = 0;
    dragStartPos.current = x.get();
    x.stop();
  };

  const onPan = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    x.set(dragStartPos.current + info.offset.x);
  };

  const onPanEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    velocity.current = info.velocity.x;
  };

  return (
    <section className="w-full flex items-start justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full relative overflow-hidden flex py-[4rem]">
          {/* Desktop Carousel */}
          <div ref={inViewRef} className="w-full hidden md:flex items-center justify-center">
            <motion.div
              className="flex w-max flex-row items-center justify-center flex-nowrap gap-[2.5rem]"
              style={{ x }}
              onPanStart={onPanStart}
              onPan={onPan}
              onPanEnd={onPanEnd}
              whileTap={{ cursor: "grabbing" }}
            >
              {duplicatedItems.map((item, index) => (
                <div key={`${item._id}-${index}`} style={{ flex: `0 0 ${cardWidth}px` }}>
                   {/* Pass any necessary props to your actual ProjectCard */}
                  <ProjectCard key={item._id} {...item} />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Mobile View */}
          <div className="flex w-full items-center justify-center md:hidden flex-col gap-[5rem]">
            {items.map((item) => (
               <ProjectCard key={item._id} {...item} />
            ))}
          </div>

          {/* Mouse follower */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: `${mouseX - 100}px`,
              y: `${mouseY - 200}px`,
              opacity: isInView ? 1 : 0,
              scale: isInView ? 1 : 0,
            }}
            transition={{ type: "tween", duration: 2, ease: "backOut" }}
            className="absolute md:visible invisible text-[#3d2b1f] pointer-events-none text-center font-raleway cursor-default font-bold tracking-tighter bg-[#C8A464] rounded-full p-[2rem]"
          >
            Drag
            <br />
            or click
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WorkCarousel;
