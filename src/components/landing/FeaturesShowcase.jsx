// components/FeaturesShowcase.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Bot,
  ImageIcon,
  Globe,
  ArrowRight,
  CheckCircle,
  Play,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
// STATIC FEATURE DATA WITH FLOWS
/* -------------------------------------------------------------------------- */
const FEATURES = [
  {
    id: "compiler",
    icon: <Terminal className="h-8 w-8" />,
    gradient: "from-blue-500 to-cyan-500",
    title: "Online Compiler",
    intro: "Run code in 15+ languages instantly.",
    flow: [
      {
        step: 1,
        caption: "Choose a language",
        code: "// Select C++, Python, Java …",
      },
      {
        step: 2,
        caption: "Write or paste code",
        code: "printf(\"Hello RunIt!\\n\");",
      },
      {
        step: 3,
        caption: "Hit ▶ Run and see output",
        code: "Hello RunIt!",
      },
    ],
  },
  {
    id: "ai-assistant",
    icon: <Bot className="h-8 w-8" />,
    gradient: "from-purple-500 to-pink-500",
    title: "AI‑Powered Assistant",
    intro: "Generate code from plain English prompts.",
    flow: [
      {
        step: 1,
        caption: "Describe what you need",
        code: "\"Find duplicates in an array\"",
      },
      {
        step: 2,
        caption: "AI writes the function",
        code: "function findDuplicates(arr){…}",
      },
      {
        step: 3,
        caption: "Insert directly into editor",
        code: "// Click \"Insert\" button",
      },
    ],
  },
  {
    id: "snippet",
    icon: <ImageIcon className="h-8 w-8" />,
    gradient: "from-green-500 to-teal-500",
    title: "Code Snippet Designer",
    intro: "Turn code into beautiful share‑ready images.",
    flow: [
      {
        step: 1,
        caption: "Paste your code",
        code: "const greet = () => console.log('Hi');",
      },
      {
        step: 2,
        caption: "Pick a theme & background",
        code: "// Theme: Midnight, Background: Gradient",
      },
      {
        step: 3,
        caption: "Download PNG & share",
        code: "// social-ready graphic exported",
      },
    ],
  },
  {
    id: "portfolio",
    icon: <Globe className="h-8 w-8" />,
    gradient: "from-orange-500 to-red-500",
    title: "AI Portfolio Builder",
    intro: "Create & publish a professional portfolio in 5 min.",
    flow: [
      {
        step: 1,
        caption: "Upload your resume (PDF)",
        code: "{ resume.pdf } → parsing…",
      },
      {
        step: 2,
        caption: "AI fills a premium template",
        code: "<About />, <Projects />, <Skills />",
      },
      {
        step: 3,
        caption: "Publish to username.runit.in",
        code: "// Portfolio live!",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
// REUSABLE COMPONENTS
/* -------------------------------------------------------------------------- */
const Slide = ({ feature }) => (
  <motion.div
    key={feature.id}
    className={`w-full bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 shadow-xl flex flex-col lg:flex-row`}
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -40 }}
    transition={{ duration: 0.5 }}
  >
    {/* left meta */}
    <div className="lg:w-2/5 flex flex-col gap-4 text-white mb-6 lg:mb-0">
      <div className="flex items-center gap-3">
        {feature.icon}
        <h2 className="text-2xl font-bold">{feature.title}</h2>
      </div>
      <p className="opacity-90">{feature.intro}</p>
      <ul className="space-y-2 text-sm list-disc list-inside opacity-90">
        {feature.flow.map((s) => (
          <li key={s.step} className="flex">
            <span className="font-semibold mr-2">Step {s.step}:</span>
            {s.caption}
          </li>
        ))}
      </ul>
    </div>

    {/* right flow frames */}
    <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {feature.flow.map((block) => (
        <div
          key={block.step}
          className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-4 text-xs font-mono text-white/90 shadow-inner"
        >
          <span className="block text-[10px] uppercase tracking-wider text-white/60 mb-2">
            {block.caption}
          </span>
          <pre className="whitespace-pre-wrap leading-tight">{block.code}</pre>
        </div>
      ))}
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
// MAIN COMPONENT
/* -------------------------------------------------------------------------- */
export default function FeaturesShowcase() {
  const [index, setIndex] = useState(0);

  // Auto cycle every 5 s
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % FEATURES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-6 sm:py-6 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400">
          Explore RunIt's Core Features
        </h1>

        <div className="relative h-[480px]">
          <AnimatePresence mode="wait">
            <Slide feature={FEATURES[index]} key={FEATURES[index].id} />
          </AnimatePresence>
        </div>

        {/* manual controls */}
        <div className="flex justify-center gap-3 mt-6">
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Show ${f.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
