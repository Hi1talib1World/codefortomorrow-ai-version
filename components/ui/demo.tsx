"use client";

import { Brain, Code, Bot } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Student Analytics Agent",
    date: "24/7 Active • Core AI",
    content: "Runs continuously 24/7 every day using advanced cognitive diagnostics to track student progression, analyze coding patterns, and construct real-time learning profiles.",
    category: "AI Engine",
    icon: Brain,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Curriculum Factory Agent",
    date: "24/7 Active • AI Tutor",
    content: "Works non-stop 24/7 every day to dynamically synthesize personalized curriculum tracks, interactive quizzes, and coding challenges tailored to students' exact skill gaps.",
    category: "AI Tutor",
    icon: Code,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 3,
    title: "B2B Sales Agent",
    date: "24/7 Active • Institutional Support",
    content: "Available 24/7 every day to assist school administrators and teachers by automatically setting up classrooms, licensing packages, custom pricing, and curriculum previews.",
    category: "AI Partner",
    icon: Bot,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <div className="w-full h-full min-h-[500px] overflow-hidden relative">
      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}

export default RadialOrbitalTimelineDemo;
