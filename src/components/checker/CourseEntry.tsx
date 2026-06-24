import { PRELOADED_COURSES } from "@/data/mockData";
import { OriginSchoolSelector } from "@/components/checker/OriginSchoolSelector";
import type { DualEnrollmentCourse } from "@/types";

interface CourseEntryProps {
  selectedCourses: DualEnrollmentCourse[];
  onChange: (courses: DualEnrollmentCourse[]) => void;
  originSchoolId: string;
  onOriginSchoolChange: (originSchoolId: string) => void;
}

const CATEGORIES = [
  { label: "English & Communications", prefix: ["engl", "comm"] },
  { label: "Mathematics", prefix: ["math"] },
  { label: "Natural Sciences", prefix: ["biol", "chem", "phys", "geol"] },
  {
    label: "Social Sciences & History",
    prefix: ["hist", "pols", "psyc", "soci", "econ"],
  },
  { label: "Humanities & Fine Arts", prefix: ["arts", "musc", "phil"] },
  { label: "Technology & Business", prefix: ["csci", "busa", "acct"] },
];

export function CourseEntry({
  selectedCourses,
  onChange,
  originSchoolId,
  onOriginSchoolChange,
}: CourseEntryProps) {
  const selectedIds = new Set(selectedCourses.map((course) => course.id));

  const toggleCourse = (course: DualEnrollmentCourse) => {
    if (selectedIds.has(course.id)) {
      onChange(selectedCourses.filter((entry) => entry.id !== course.id));
      return;
    }

    onChange([...selectedCourses, course]);
  };

  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  return (
    <div>
      <OriginSchoolSelector
        value={originSchoolId}
        onChange={onOriginSchoolChange}
      />

      <div className="mb-6 flex items-center justify-between border-4 border-[#1a1a2e] bg-[#f5c842] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#1a1a2e] shadow-[4px_4px_0px_#1a1a2e]">
        <span>{selectedCourses.length} courses selected</span>
        <span>{totalCredits} credit hours</span>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const courses = PRELOADED_COURSES.filter((course) =>
            category.prefix.some((prefix) => course.id.startsWith(prefix)),
          );

          return (
            <div
              key={category.label}
              className="border-4 border-[#1a1a2e] bg-white p-4 shadow-[4px_4px_0px_#1a1a2e]"
            >
              <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#c0392b]">
                {category.label}
              </h2>
              <div className="grid gap-2 md:grid-cols-2">
                {courses.map((course) => {
                  const selected = selectedIds.has(course.id);

                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => toggleCourse(course)}
                      className={`flex items-start justify-between gap-2 border-4 border-[#1a1a2e] px-3 py-3 text-left text-sm font-bold transition-all ${
                        selected
                          ? "bg-[#1a1a2e] text-[#f5c842] shadow-[3px_3px_0px_#f5c842]"
                          : "bg-[#f5f0e8] text-[#1a1a2e] shadow-[2px_2px_0px_#1a1a2e] hover:bg-white"
                      }`}
                    >
                      <span>
                        <span className="block">{course.courseCode}</span>
                        <span className="block text-xs font-normal opacity-80">
                          {course.courseName}
                        </span>
                      </span>
                      <span className="text-xs">{course.credits} cr</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
