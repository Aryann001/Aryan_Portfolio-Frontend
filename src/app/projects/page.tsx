"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/reducers/productsReducer"; // Adjust the import path to your slice
import { AppDispatch, RootState } from "@/store/store"; // Adjust the import path to your store
import ProjectCard from "@/components/ProjectCard";
import PaginationControls from "@/components/PaginationControls"; // Import the new component
import { hideLoader } from "@/reducers/loadingReducer";

// ... (LoadingSpinner and ErrorDisplay components remain the same) ...
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#3d2b1f]"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
    <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
    <p>{message}</p>
  </div>
);

const ProjectsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const { projects, isLoading, error, totalPages, currentPage } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    dispatch(hideLoader());
    // Fetch the first page of projects when the component mounts
    dispatch(fetchProjects(1));
  }, [dispatch]);

  // Handler for changing the page
  const handlePageChange = (page: number) => {
    // Dispatch the fetchProjects thunk with the new page number
    dispatch(fetchProjects(page));
  };

  const renderContent = () => {
    // ... (Your renderContent logic remains exactly the same) ...
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorDisplay message={error} />;
    }

    if (projects.length === 0) {
      return <p className="text-center text-lg">No projects found.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="w-full flex items-center justify-center"
          >
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          {/* ... (Header content remains the same) ... */}
        </header>

        {renderContent()}

        {/* Add the pagination controls at the bottom */}
        {!isLoading && !error && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
};

export default ProjectsPage;