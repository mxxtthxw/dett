"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  GraduationCap,
  Star,
  Zap,
} from "lucide-react";
import { DettAdminCircle } from "@/components/shared/DettAdminCircle";
import { WelcomeBackBox } from "@/components/dashboard/WelcomeBackBox";
import { RequirementTrackerHomeCard } from "@/components/landing/RequirementTrackerHomeCard";
import {
  ROADMAP_CARD_HEIGHT,
  ROADMAP_CARD_LIVE,
  ROADMAP_CARD_SHELL,
  ROADMAP_CARD_SOON,
} from "@/components/landing/roadmapCardStyles";

const COMING_SOON = [
  {
    icon: "🎓",
    title: "Scholarship Matching",
    desc: "Scholarships matched to your schools and profile.",
    live: false,
  },
  {
    icon: "📋",
    title: "University Requirement Tracker",
    desc: "Sort DE credits into core, major, and elective blocks.",
    live: true,
    component: "requirements" as const,
  },
  {
    icon: "🤖",
    title: "AI Academic Advisor",
    desc: "Personalized next-step course recommendations.",
    live: true,
    href: "/checker",
    badge: "In Results",
  },
  {
    icon: "🗺️",
    title: "Major Roadmap Generator",
    desc: "DE courses mapped to your intended major.",
    live: false,
  },
  {
    icon: "💰",
    title: "Financial Aid Comparison",
    desc: "Compare aid packages across target schools.",
    live: false,
  },
  {
    icon: "🏆",
    title: "Transfer Success Stories",
    desc: "Real transfer wins from DE students.",
    live: false,
  },
  {
    icon: "📈",
    title: "Degree Progress Tracking",
    desc: "Live credit progress toward your degree.",
    live: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Your Name",
    desc: "Tell us who you are",
  },
  {
    step: "02",
    title: "Pick Schools",
    desc: "Choose the colleges you're considering",
  },
  {
    step: "03",
    title: "Add Courses",
    desc: "Enter your DE classes",
  },
  {
    step: "04",
    title: "See Results",
    desc: "Instant transfer breakdown + PDF report",
  },
];

export function RetroHome() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f5f0e8] font-mono">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          background:
            "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 4px)",
        }}
      />

      <nav className="sticky top-0 z-40 border-b-4 border-[#1a1a2e] bg-[#1a1a2e]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#f5c842] bg-[#f5c842]">
              <GraduationCap className="h-4 w-4 text-[#1a1a2e]" />
            </div>
            <span className="text-base font-black uppercase tracking-widest text-[#f5c842]">
              DETT
            </span>
            <span className="hidden text-xs tracking-wider text-[#f5c842]/50 sm:inline">
              Dual Enrollment Transfer Tool
            </span>
          </div>
          <DettAdminCircle />
        </div>
      </nav>

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 border-2 border-[#1a1a2e] bg-[#f5c842] px-4 py-1 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
            <Zap className="h-3 w-3" />
            Free · Instant · Built by Students
          </div>

          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-1 w-16 bg-[#1a1a2e]" />
            <GraduationCap className="h-6 w-6 text-[#1a1a2e]" />
            <div className="h-1 w-16 bg-[#1a1a2e]" />
          </div>

          <h1
            className="mb-4 text-6xl font-black uppercase leading-none tracking-tight text-[#1a1a2e] md:text-8xl"
            style={{
              fontFamily: "Georgia, serif",
              textShadow: "5px 5px 0px #f5c842",
            }}
          >
            DETT
          </h1>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#c0392b]">
            Dual Enrollment Transfer Tool
          </p>
          <div className="mx-auto mb-8 h-1 max-w-xs bg-[#1a1a2e]" />
          <p className="mx-auto mb-4 max-w-lg text-sm leading-relaxed text-[#4a4a4a]">
            Find out exactly which dual enrollment credits transfer to your
            target colleges — before you apply.
          </p>
          <p className="mb-10 text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
            &ldquo;Your future shouldn&apos;t be left to guesswork.&rdquo;
          </p>

          <Link
            href="/checker"
            className="group inline-flex items-center gap-3 border-4 border-[#1a1a2e] bg-[#c0392b] px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[6px_6px_0px_#1a1a2e] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#1a1a2e]"
          >
            Check My Credits
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <WelcomeBackBox />
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-1 flex-1 bg-[#1a1a2e]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#1a1a2e]">
            How It Works
          </span>
          <div className="h-1 flex-1 bg-[#1a1a2e]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {HOW_IT_WORKS.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border-4 border-[#1a1a2e] bg-white p-5 shadow-[4px_4px_0px_#1a1a2e]"
            >
              <div
                className="mb-2 text-3xl font-black text-[#f5c842]"
                style={{ WebkitTextStroke: "2px #1a1a2e" }}
              >
                {item.step}
              </div>
              <div className="mb-1 text-xs font-black uppercase tracking-wider text-[#1a1a2e]">
                {item.title}
              </div>
              <div className="text-xs text-[#4a4a4a]">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-t-4 border-[#1a1a2e] bg-[#1a1a2e] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center gap-4">
            <div className="h-1 w-8 bg-[#f5c842]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#f5c842]">
              Roadmap
            </span>
          </div>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2
              className="text-4xl font-black uppercase text-white"
              style={{
                fontFamily: "Georgia, serif",
                textShadow: "4px 4px 0px #f5c842",
              }}
            >
              Coming Soon
            </h2>
            <div className="flex items-center gap-2 border-2 border-[#f5c842]/30 px-4 py-2">
              <Clock className="h-3.5 w-3.5 text-[#f5c842]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#f5c842]">
                In Development
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[220px]">
            {COMING_SOON.map((feature, index) => {
              if (feature.component === "requirements") {
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className={`${ROADMAP_CARD_HEIGHT} w-full`}
                  >
                    <RequirementTrackerHomeCard />
                  </motion.div>
                );
              }

              const cardBody = (
                <>
                  <div className="mb-2 shrink-0 text-2xl leading-none">
                    {feature.icon}
                  </div>
                  <h3
                    className={`mb-2 line-clamp-2 text-xs font-black uppercase tracking-wider ${
                      feature.live ? "text-emerald-400" : "text-[#f5c842]"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-white/60">
                    {feature.desc}
                  </p>
                  <div
                    className={`mt-auto inline-flex w-fit items-center gap-1 border px-2 py-0.5 ${
                      feature.live
                        ? "border-emerald-500"
                        : "border-[#f5c842]/30"
                    }`}
                  >
                    {feature.live ? (
                      <>
                        <Star className="h-2.5 w-2.5 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                          {feature.badge ?? "Live"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Star className="h-2.5 w-2.5 text-[#f5c842]/50" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#f5c842]/50">
                          Soon
                        </span>
                      </>
                    )}
                  </div>
                </>
              );

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className={`${ROADMAP_CARD_HEIGHT} w-full`}
                >
                  {feature.href ? (
                    <Link
                      href={feature.href}
                      className={`${ROADMAP_CARD_SHELL} ${
                        feature.live ? ROADMAP_CARD_LIVE : ROADMAP_CARD_SOON
                      } group`}
                    >
                      {cardBody}
                    </Link>
                  ) : (
                    <div
                      className={`${ROADMAP_CARD_SHELL} ${
                        feature.live ? ROADMAP_CARD_LIVE : ROADMAP_CARD_SOON
                      }`}
                    >
                      {cardBody}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 border-4 border-[#f5c842]/30 bg-white/5 p-8 text-center">
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-[#f5c842]">
              Built by students. For students.
            </p>
            <p className="mx-auto max-w-xl text-xs leading-relaxed text-white/60">
              Every feature is designed with one goal: to help ambitious students
              make smarter academic decisions, save money, and get one step closer
              to their dream school.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t-4 border-[#f5c842] bg-[#1a1a2e] py-5 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-[#f5c842]">
          DETT — Dual Enrollment Transfer Tool · Your future shouldn&apos;t be
          left to guesswork.
        </div>
      </footer>
    </div>
  );
}
