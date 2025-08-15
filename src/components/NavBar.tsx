"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, Variants } from "framer-motion";
import { useDispatch } from "react-redux";
import { showLoader } from "@/reducers/loadingReducer";

// Animation variants for the dropdown menu container
const menuVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50%)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Animation variants for the individual menu items
const menuItemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const NavBar = () => {
  const navRef = useRef(null);
  const isNavInView = useInView(navRef, { margin: "-50px" });

  // State to control the dropdown menu's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const handleLoadClick = () => {
    // 1. Show the loader. The curtains will slide in.
    dispatch(showLoader());

    // 2. Simulate a task (like an API call).
    //    We wait for a bit before hiding the loader to ensure the animation is fully visible.
    // setTimeout(() => {
    //   // 3. Hide the loader. The curtains will slide out.
    //   dispatch(hideLoader());
    // }, 4000); // A 2-second delay is good for a ~1.6s total animation time.
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <div
        ref={navRef}
        className="flex md:justify-around justify-between items-center p-[1.5rem] bg-[#faf3e0] relative"
      >
        <div className="flex justify-center items-center">
          <Link
            href="/"
            className="font-cinzel font-normal text-[1.2rem] tracking-[3px]"
            onClick={handleLoadClick}
          >
            Aryan Baghel
          </Link>
        </div>
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex justify-center items-center text-sm w-[35%] lg:w-[25%] text-[#3D2B1F]">
          <ul className="flex justify-between w-full">
            <li className="font-raleway tracking-[1px] font-semibold hover:text-[#C8A464] transition-all ease-in-out duration-300">
              <Link href="/" onClick={handleLoadClick}>
                Home
              </Link>
            </li>
            <li className="font-raleway tracking-[1px] font-semibold hover:text-[#C8A464] transition-all ease-in-out duration-300">
              <Link href="/projects" onClick={handleLoadClick}>
                Projects
              </Link>
            </li>
            <li className="font-raleway tracking-[1px] font-semibold hover:text-[#C8A464] transition-all ease-in-out duration-300">
              <Link href="#services">Services</Link>
            </li>
          </ul>
        </div>
        {/* Desktop Contact Us Button */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            onClick={handleLoadClick}
            className="font-cinzel text-sm text-[#3D2B1F] px-[1.5rem] py-[1rem] font-semibold tracking-widest transition-all ease-in-out duration-500 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#C8A464] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
          >
            Contact Us
          </Link>
        </div>
        {/* Mobile Menu Icon (Placeholder for smaller screens in main nav) */}
        <div className="md:hidden">
          <motion.div
            className="fixed top-4 right-4 z-50"
            // initial={{ y: "0%", opacity: 1 }}
            // animate={{
            //   y: isNavInView ? "-150%" : 0,
            //   opacity: isNavInView ? 0 : 1,
            // }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* The button toggles the menu state */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-14 h-14 rounded-full cursor-pointer bg-[#3d2b1f] text-white flex flex-col justify-center items-center gap-1 shadow-lg relative"
              animate={isMenuOpen ? "open" : "closed"}
            >
              {/* Animated burger icon lines */}
              <motion.span
                className="w-6 h-0.5 bg-white block absolute"
                variants={{
                  open: { rotate: 45, y: 0 },
                  closed: { rotate: 0, y: -4 },
                }}
              ></motion.span>
              <motion.span
                className="w-6 h-0.5 bg-white block absolute"
                variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
              ></motion.span>
              <motion.span
                className="w-6 h-0.5 bg-white block absolute"
                variants={{
                  open: { rotate: -45, y: 0 },
                  closed: { rotate: 0, y: 4 },
                }}
              ></motion.span>
            </motion.button>

            {/* Dropdown Menu */}
            <motion.div
              className="absolute top-20 right-0 w-56 bg-[#faf3e0] rounded-xl shadow-xl"
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
              variants={menuVariants}
            >
              <motion.ul className="flex flex-col p-4 gap-4">
                <motion.li variants={menuItemVariants}>
                  <Link
                    href="/"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLoadClick();
                    }}
                    className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
                  >
                    Home
                  </Link>
                </motion.li>
                <motion.li variants={menuItemVariants}>
                  <Link
                    href="/projects"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLoadClick();
                    }}
                    className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
                  >
                    Projects
                  </Link>
                </motion.li>
                <motion.li variants={menuItemVariants}>
                  <Link
                    href="#services"
                    onClick={() => setIsMenuOpen(false)}
                    className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
                  >
                    Services
                  </Link>
                </motion.li>
                <motion.li variants={menuItemVariants}>
                  <Link
                    href="/contact"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLoadClick();
                    }}
                    className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
                  >
                    Contact Us
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Animated Burger Button & Dropdown Menu */}
      <motion.div
        className="fixed md:visible invisible top-4 right-4 z-50"
        initial={{ y: "-150%", opacity: 0 }}
        animate={{
          y: isNavInView ? "-150%" : 0,
          opacity: isNavInView ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* The button toggles the menu state */}
        <motion.button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-14 h-14 rounded-full cursor-pointer bg-[#3d2b1f] text-white flex flex-col justify-center items-center gap-1 shadow-lg relative"
          animate={isMenuOpen ? "open" : "closed"}
        >
          {/* Animated burger icon lines */}
          <motion.span
            className="w-6 h-0.5 bg-white block absolute"
            variants={{
              open: { rotate: 45, y: 0 },
              closed: { rotate: 0, y: -4 },
            }}
          ></motion.span>
          <motion.span
            className="w-6 h-0.5 bg-white block absolute"
            variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
          ></motion.span>
          <motion.span
            className="w-6 h-0.5 bg-white block absolute"
            variants={{
              open: { rotate: -45, y: 0 },
              closed: { rotate: 0, y: 4 },
            }}
          ></motion.span>
        </motion.button>

        {/* Dropdown Menu */}
        <motion.div
          className="absolute top-20 right-0 w-56 bg-[#faf3e0] rounded-xl shadow-xl"
          initial={false}
          animate={isMenuOpen ? "open" : "closed"}
          variants={menuVariants}
        >
          <motion.ul className="flex flex-col p-4 gap-4">
            <motion.li variants={menuItemVariants}>
              <Link
                href="/"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLoadClick();
                }}
                className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
              >
                Home
              </Link>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <Link
                href="/projects"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLoadClick();
                }}
                className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
              >
                Projects
              </Link>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <Link
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
              >
                Services
              </Link>
            </motion.li>
            <motion.li variants={menuItemVariants}>
              <Link
                href="/contact"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLoadClick();
                }}
                className="font-raleway font-semibold text-[#3D2B1F] w-full block hover:text-[#C8A464] transition-all ease-in-out duration-250"
              >
                Contact Us
              </Link>
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </>
  );
};

export default NavBar;
