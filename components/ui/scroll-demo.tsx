"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-12 pt-4 bg-slate-900 text-white">
      <ContainerScroll
        titleComponent={""}
      >
        <img
          src="/assets/images/dashboard-screenshot.png"
          alt="dashboard"
          className="mx-auto rounded-2xl object-cover h-full object-left-top w-full select-none shadow-2xl"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default HeroScrollDemo;
