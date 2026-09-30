"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Search } from "lucide-react";
import { PRELOADED_COURSES, PRELOADED_SCHOOLS } from "@/data/mockData";
import { SectionHeading } from "@/components/landing/SectionHeading";

type CatalogTab = "schools" | "courses";

const SUBJECT_BY_PREFIX: Record<string, string> = {
  ENGL: "English & Communication",
  COMM: "English & Communication",
  MATH: "Mathematics",
  BIOL: "Natural Sciences",
  CHEM: "Natural Sciences",
  PHYS: "Natural Sciences",
  GEOL: "Natural Sciences",
  HIST: "Social Sciences",
  POLS: "Social Sciences",
  PSYC: "Social Sciences",
  SOCI: "Social Sciences",
  ECON: "Social Sciences",
  ARTS: "Humanities & Arts",
  MUSC: "Humanities & Arts",
  PHIL: "Humanities & Arts",
  CSCI: "Technology & Business",
  BUSA: "Technology & Business",
  ACCT: "Technology & Business",
};

const SCHOOL_TYPE_LABEL: Record<string, string> = {
  university: "University",
  community_college: "Community College",
  high_school: "High School",
};

function subjectForCourse(courseCode: string): string {
  const prefix = courseCode.split(" ")[0] ?? "";
  return SUBJECT_BY_PREFIX[prefix] ?? "General Studies";
}

function TabButton({
  active,
  count,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 border-r-4 border-[#1a1a2e] px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors last:border-r-0 ${
        active
          ? "bg-[#1a1a2e] text-[#f5c842]"
          : "bg-white text-[#1a1a2e] hover:bg-[#f5f0e8]"
      }`}
    >
      {icon}
      {label}
      <span
        className={`border-2 px-1.5 py-0.5 text-[10px] ${
          active
            ? "border-[#f5c842]/40 text-[#f5c842]"
            : "border-[#1a1a2e]/20 text-[#4a4a4a]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export function CatalogExplorer() {
  const [tab, setTab] = useState<CatalogTab>("schools");
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string | null>(null);

  const states = useMemo(() => {
    const unique = new Set<string>();

    for (const school of PRELOADED_SCHOOLS) {
      if (school.state) {
        unique.add(school.state);
      }
    }

    return [...unique].sort();
  }, []);

  const visibleSchools = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return PRELOADED_SCHOOLS.filter((school) => {
      if (stateFilter && school.state !== stateFilter) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        school.name.toLowerCase().includes(needle) ||
        (school.state ?? "").toLowerCase().includes(needle)
      );
    });
  }, [query, stateFilter]);

  const visibleCourses = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return PRELOADED_COURSES;
    }

    return PRELOADED_COURSES.filter(
      (course) =>
        course.courseCode.toLowerCase().includes(needle) ||
        course.courseName.toLowerCase().includes(needle) ||
        subjectForCourse(course.courseCode).toLowerCase().includes(needle),
    );
  }, [query]);

  const isSchools = tab === "schools";
  const resultCount = isSchools ? visibleSchools.length : visibleCourses.length;

  return (
    <section className="dett-grid-paper border-t-4 border-[#1a1a2e] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="The Catalog"
          title="What DETT Tracks Today"
          description="Every college and dual enrollment course in the system right now. Browse it before you start — then jump straight into the checker with a school already selected."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex border-4 border-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e]">
            <TabButton
              active={isSchools}
              count={PRELOADED_SCHOOLS.length}
              icon={<GraduationCap className="h-3.5 w-3.5" aria-hidden />}
              label="Colleges"
              onClick={() => setTab("schools")}
            />
            <TabButton
              active={!isSchools}
              count={PRELOADED_COURSES.length}
              icon={<BookOpen className="h-3.5 w-3.5" aria-hidden />}
              label="Courses"
              onClick={() => setTab("courses")}
            />
          </div>

          <label className="relative flex min-w-[260px] flex-1 items-center sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-[#4a4a4a]"
              aria-hidden
            />
            <span className="sr-only">
              Search {isSchools ? "colleges" : "courses"}
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                isSchools ? "Search colleges…" : "Search courses…"
              }
              className="w-full border-4 border-[#1a1a2e] bg-white py-2.5 pl-9 pr-3 text-xs font-bold text-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e] placeholder:font-normal placeholder:text-[#aaa] focus:border-[#c0392b] focus:outline-none"
            />
          </label>
        </div>

        {isSchools ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStateFilter(null)}
              aria-pressed={stateFilter === null}
              className={`border-2 border-[#1a1a2e] px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${
                stateFilter === null
                  ? "bg-[#f5c842] text-[#1a1a2e]"
                  : "bg-white text-[#4a4a4a] hover:bg-[#f5f0e8]"
              }`}
            >
              All States
            </button>
            {states.map((state) => (
              <button
                key={state}
                type="button"
                onClick={() =>
                  setStateFilter((current) =>
                    current === state ? null : state,
                  )
                }
                aria-pressed={stateFilter === state}
                className={`border-2 border-[#1a1a2e] px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  stateFilter === state
                    ? "bg-[#f5c842] text-[#1a1a2e]"
                    : "bg-white text-[#4a4a4a] hover:bg-[#f5f0e8]"
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#4a4a4a]">
          Showing {resultCount} {isSchools ? "colleges" : "courses"}
        </p>

        {resultCount === 0 ? (
          <div className="mt-4 border-4 border-[#1a1a2e] bg-white px-6 py-12 text-center shadow-[4px_4px_0px_#1a1a2e]">
            <p className="text-sm font-black uppercase tracking-widest text-[#1a1a2e]">
              No matches
            </p>
            <p className="mt-2 text-xs text-[#4a4a4a]">
              Try a different search term or clear the state filter.
            </p>
          </div>
        ) : null}

        {isSchools && resultCount > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSchools.map((school) => (
              <Link
                key={school.id}
                href={`/checker?school=${school.id}`}
                className="group relative flex flex-col justify-between border-4 border-[#1a1a2e] bg-white p-5 shadow-[4px_4px_0px_#1a1a2e] transition-all hover:-translate-y-1 hover:shadow-[6px_8px_0px_#1a1a2e]"
              >
                <span
                  aria-hidden
                  className="absolute right-0 top-0 h-3 w-3 bg-[#f5c842]"
                />

                <div>
                  <p className="pr-4 text-sm font-black uppercase leading-snug tracking-wide text-[#1a1a2e]">
                    {school.name}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a4a4a]">
                    {SCHOOL_TYPE_LABEL[school.type] ?? school.type}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  {school.state ? (
                    <span className="border-2 border-[#1a1a2e] bg-[#f5f0e8] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#1a1a2e]">
                      {school.state}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#c0392b]">
                    Check Credits
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {!isSchools && resultCount > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course) => (
              <article
                key={course.id}
                className="relative flex items-start justify-between gap-4 border-4 border-[#1a1a2e] bg-white p-5 shadow-[4px_4px_0px_#1a1a2e] transition-all hover:-translate-y-1 hover:shadow-[6px_8px_0px_#1a1a2e]"
              >
                <div className="min-w-0">
                  <p
                    className="text-lg font-black uppercase tracking-wide text-[#1a1a2e]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {course.courseCode}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#4a4a4a]">
                    {course.courseName}
                  </p>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#c0392b]">
                    {subjectForCourse(course.courseCode)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-center border-4 border-[#1a1a2e] bg-[#f5c842] px-3 py-2">
                  <span className="text-lg font-black leading-none text-[#1a1a2e]">
                    {course.credits}
                  </span>
                  <span className="mt-0.5 text-[8px] font-black uppercase tracking-widest text-[#1a1a2e]">
                    Cr
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-4 border-[#1a1a2e] bg-[#1a1a2e] px-8 py-6">
          <p className="max-w-lg text-xs leading-relaxed text-white/70">
            Don&apos;t see your college or a class you&apos;ve taken? Start the
            checker and use{" "}
            <span className="font-black text-[#f5c842]">
              &ldquo;Don&apos;t see your College?&rdquo;
            </span>{" "}
            to request it.
          </p>
          <Link
            href="/checker"
            className="group inline-flex items-center gap-2 border-4 border-[#f5c842] bg-[#f5c842] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#1a1a2e] transition-all hover:bg-transparent hover:text-[#f5c842]"
          >
            Start Checking
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
