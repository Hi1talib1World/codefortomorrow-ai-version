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
          src="https://ui.aceternity.com/_next/image?url=%2Flinear.webp&w=3840&q=75"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full object-left-top w-full select-none"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default HeroScrollDemo;
