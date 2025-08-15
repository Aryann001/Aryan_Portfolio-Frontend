import React from "react";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { FiGithub } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Footer = () => {
  const {user} = useSelector((state: RootState)=>state.user)
  return (
    <div className="flex relative z-10 w-full md:h-[20vh] h-[40vh] justify-center items-center bg-[#3d2b1f] text-[#faf3e0]">
      <div className="flex w-[80%] md:flex-row flex-col md:gap-0 gap-[3rem] justify-between items-center">
        <div>
          <h3 className="md:text-start text-center cursor-default text-xl tracking-wider"><span className="text-[#C8A464]">Copyright © 2025.</span> All rights are reserved</h3>
        </div>
        {/*  */}
        <div className="flex gap-10">
          <div>
            <Link className="text-3xl" href={String(user?.linkedInLink)}>
              <PiLinkedinLogoBold className="hover:text-[#C8A464] transition-all ease-in-out duration-250" />
            </Link>
          </div>
          {/*  */}
          <div>
            <Link className="text-3xl" href={String(user?.githubLink)}>
              <FiGithub className="hover:text-[#C8A464] transition-all ease-in-out duration-250" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;