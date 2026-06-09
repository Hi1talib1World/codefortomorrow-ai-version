"use client";

import { Brain, Code, Bot } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Student Analytics Agent",
    date: "Core AI",
    content: "Uses advanced cognitive diagnostics to track student progression, analyze coding patterns, and construct real-time learning profiles (strengths, weaknesses, and skill graphs).",
    category: "AI Engine",
    icon: Brain,
    relatedIds: [2],
    status: "completed" as const,
    energy: 98,
  },
  {
    id: 2,
    title: "Curriculum Factory Agent",
    date: "AI Tutor",
    content: "Dynamically synthesizes personalized curriculum tracks, interactive quizzes, and coding sandbox challenges tailored to fill individual students' skill gaps.",
    category: "AI Tutor",
    icon: Code,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "B2B Sales Agent",
    date: "Institutional Onboarding",
    content: "Assists school administrators and teachers by automatically setting up classrooms, licensing packages, custom pricing options, and curriculum previews.",
    category: "AI Sales",
    icon: Bot,
    relatedIds: [2],
    status: "in-progress" as const,
    energy: 85,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}

export default RadialOrbitalTimelineDemo;
