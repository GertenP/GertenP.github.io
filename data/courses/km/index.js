import { kmCourseMeta } from "./course.js";
import { chapter1 } from "./chapter1.js";

// Uue nädala peatükk: kopeeri chapter1.js -> chapterN.js selles kaustas,
// impordi see siia ja lisa allolevasse massiivi.
export const kmCourse = {
  meta: kmCourseMeta,
  chapters: [chapter1],
};
