import StaggeredReveal from "@/components/StaggeredReveal";
import React from "react";
import WorkCarousel from "../WorkCarousel";
import TechStackCarousel from "../TechStackCarousel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const WorkSection = () => {

  const {projects} = useSelector((state: RootState)=> state.projects)
  const {user} = useSelector((state: RootState) => state.user)

  return (
    <section className="w-full flex justify-center items-center px-4 py-20 pb-32 md:py-32">
      <div className="flex justify-center items-center">
        {/* Main two-column grid layout */}
        <div className="grid w-full grid-cols-1 gap-10">
          <div className="flex w-full justify-center items-center">
            <div className="w-[80%] text-2xl md:text-5xl flex md:flex-row flex-col justify-between items-center font-cinzel font-medium leading-tight">
              <div>
                <StaggeredReveal staggerDelay={0.1} animationDuration={0.4}>
                  <h2 className="md:translate-x-[-2.5rem]">Some <span className="text-[#C8A464]">of</span></h2>
                  <h2 className="md:translate-x-[1rem]"><span className="text-[#C8A464]">Our</span> work</h2>
                </StaggeredReveal>
              </div>
              {/*  */}
              <div>
                <StaggeredReveal staggerDelay={0.1} animationDuration={0.4}>
                  <p className="flex self-end text-2xl md:visible invisible font-raleway text-[#C8A464]">
                    Each project is a&nbsp;<span className="text-[#faf3e0]">unique</span>&nbsp;piece of development
                  </p>
                </StaggeredReveal>
              </div>
            </div>
          </div>
          {/*  */}
          <div className=" w-full flex justify-center items-center">
            <WorkCarousel items={projects} />
          </div>
          {/*  */}
          <div className=" w-full flex justify-center items-center">
            <TechStackCarousel items={user?.stack} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
