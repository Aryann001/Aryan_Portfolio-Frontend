import { Project } from "@/reducers/productsReducer";
import React from "react";

const ProjectCard = (project: Project) => {
  return (
    <div className="w-[25rem] bg-[#D7C4A8]">
        <video
          src={project?.thumbnail?.url} // The path is relative to the `public` folder
          autoPlay
          loop
          muted
          playsInline // Important for iOS devices to play inline
          className="w-full h-full object-cover" // Example styling
        />
    </div>
  );
};

export default ProjectCard;
