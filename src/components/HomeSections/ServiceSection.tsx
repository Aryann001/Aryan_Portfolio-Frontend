"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LuBrainCircuit } from "react-icons/lu";
import { SiWeb3Dotjs } from "react-icons/si";
import { FaCode } from "react-icons/fa";

const ServiceSection = () => {
  const ref = useRef(null);
  // useInView will now track entering and leaving the viewport.
  // We set amount to 0.5 so it triggers when the element is 50% in view.
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    // The main section container. The ref is attached here to track its visibility.
    <section
      ref={ref}
      className="h-screen bg-[#faf3e0] flex flex-col justify-center items-center relative -mt-[100vh] overflow-hidden"
    >
      {/* Text block that fades out */}
      <motion.div
        // Animate based on whether the section is in view
        animate={{ opacity: isInView ? 0 : 1 }}
        transition={{ duration: 1.25, ease: "easeInOut" }}
        className="flex flex-col justify-center items-center relative z-[2]"
      >
        <h2 className="text-5xl text-[#3d2b1f] font-cinzel text-center">
          Services that we provide
        </h2>
        <p className="mt-4 text-[#3d2b1f]">
          Let&apos;s build something amazing together.
        </p>
      </motion.div>

      {/* Service card grid that fades in smoothly as one block */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 absolute z-[2]"
        // Animate the entire grid as a single unit, removing the stagger effect.
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
      >
        {/* Cards are now simple divs, as the parent motion.div handles the animation */}
        <div
          className="flex flex-col gap-6 justify-center items-center rounded-2xl border-2 border-[#C8A464] p-8 md:p-12 lg:p-16 shadow-2xl shadow-[#C8A464]/50 bg-[#faf3e0]/80 backdrop-blur-sm relative"
        >
          <div className="flex justify-center items-center text-[#3d2b1f] text-6xl">
            <FaCode />
          </div>
          <p className="text-[#3d2b1f] font-semibold text-center">Web Development</p>
        </div>

        {/* Card 2 */}
        <div
          className="flex flex-col gap-6 justify-center items-center rounded-2xl border-2 border-[#C8A464] p-8 md:p-12 lg:p-16 shadow-2xl shadow-[#C8A464]/50 bg-[#faf3e0]/80 backdrop-blur-sm relative"
        >
          <div className="flex justify-center items-center text-[#3d2b1f] text-6xl">
            <LuBrainCircuit />
          </div>
          <p className="text-[#3d2b1f] font-semibold text-center">AI Development</p>
        </div>

        {/* Card 3 */}
        <div
          className="flex flex-col gap-6 justify-center items-center rounded-2xl border-2 border-[#C8A464] p-8 md:p-12 lg:p-16 shadow-2xl shadow-[#C8A464]/50 bg-[#faf3e0]/80 backdrop-blur-sm relative"
        >
          <div className="flex justify-center items-center text-[#3d2b1f] text-6xl">
            <SiWeb3Dotjs />
          </div>
          <p className="text-[#3d2b1f] font-semibold text-center">Blockchain Development</p>
        </div>
      </motion.div>
    </section>
  );
};

export default ServiceSection;
