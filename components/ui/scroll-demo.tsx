"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-12 pt-4 bg-slate-900 text-white">
      <ContainerScroll
        titleComponent={
          <div className="mb-6 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-300">
              Unleash the power of <br />
              <span className="text-4xl md:text-[5.5rem] font-bold mt-2 leading-none text-[#FBBF24]">
                Scroll Animations
              </span>
            </h1>
          </div>
        }
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
