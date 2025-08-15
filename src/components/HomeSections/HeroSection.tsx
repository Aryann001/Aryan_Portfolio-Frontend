import React from "react";
import aryanImg from "../../../public/aryan.jpg";
import Image from "next/image";
import SlideUpText from "../SlideUpText";
import StaggeredReveal from "../StaggeredReveal";

const HeroSection = () => {
  return (
    <div className="flex justify-center items-center h-[90vh] md:pb-0 pb-[10vh] md:mb-0 mb-[10vh] w-full z-10 relative">
      <div className="flex w-[75%] justify-center items-center">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-[1rem]">
          <div className="flex flex-col justify-center items-center">
            <div className="font-cinzel text-6xl invisible md:visible -translate-y-[4rem]">
              <StaggeredReveal staggerDelay={0.2}>
                {/* Child 1: This will animate first */}
                <h2 className="translate-x-[-2.5rem]">Software</h2>

                {/* Child 2: This will animate after a 0.2s delay */}
                <h2 className="">
                  {" "}
                  {/* <-- You can add any unique styles for "Developer" here */}
                  Developer
                </h2>
              </StaggeredReveal>
            </div>
          </div>
          {/*  */}
          <div>
            <StaggeredReveal staggerDelay={0.2}>
              <div className="shadow-2xl overflow-hidden w-[100%] h-[75vh] rounded-xl bg-amber-950">
                <Image
                  className="w-full h-full object-cover"
                  src={aryanImg}
                  alt="aryan"
                />
              </div>
            </StaggeredReveal>
          </div>
          {/*  */}
          <div className="flex items-end">
            <SlideUpText>
              <p className="text-wrap font-raleway text-4xl leading-[2rem]">
                Hi, I'm Aryan Baghel. A passionate Full Stack Developer based in
                Bhopal, India. 
              </p>
            </SlideUpText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
