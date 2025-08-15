"use client";
import CurvedReveal from "@/components/CurvedReveal";
import WorkSection from "@/components/HomeSections/WorkSection";
import HeroSection from "@/components/HomeSections/HeroSection";
import React, { useEffect } from "react";
import PeelWrapper from "@/components/PeelWrapper";
import ServiceSection from "@/components/HomeSections/ServiceSection";
import Footer from "@/components/HomeSections/Footer";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "@/reducers/loadingReducer";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUser } from "@/reducers/userReducers";
import { fetchProjects } from "@/reducers/productsReducer";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isUserLoading } = useSelector(
    (state: RootState) => state.user
  );
  const { isLoading: isProjectLoading } = useSelector(
    (state: RootState) => state.projects
  );
  const { isLoading: isGlobalLoading } = useSelector(
    (state: RootState) => state.loading
  );

  // Effect to start fetching data.
  // We assume the loader is already visible by default from your Redux initial state.
  useEffect(() => {
    dispatch(showLoader());
    dispatch(fetchUser());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Effect to watch for changes in loading states and hide the loader when done.
  useEffect(() => {
    // We check if the global loader is currently active AND if both data fetching
    // operations have completed.
    if (isGlobalLoading && !isUserLoading && !isProjectLoading) {
      dispatch(hideLoader());
    }
  }, [isUserLoading, isProjectLoading, isGlobalLoading, dispatch]);

  // --- THE MAIN FIX ---
  // While the global loader is active, we render nothing from this page.
  // This prevents the flash of content you were seeing. Your loader component
  // in layout.tsx will be the only thing visible on the screen.
  if (isGlobalLoading) {
    return null;
  }

  // Once isGlobalLoading is false, the actual page content will render.
  return (
    <div>
      <HeroSection />

      <PeelWrapper>
        <CurvedReveal className="bg-[#3d2b1f] text-[#faf3e0]">
          <WorkSection />
        </CurvedReveal>
      </PeelWrapper>

      <ServiceSection />

      <CurvedReveal className="relative z-10">
        <Footer />
      </CurvedReveal>
    </div>
  );
};

export default Page;
