export type Teacher = {
  id: string;
  name: string;
  expertise: string;
  color: string;
};

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Ana Souza", expertise: "UX Research", color: "oklch(0.7 0.18 30)" },
  { id: "t2", name: "Carlos Lima", expertise: "Data Science", color: "oklch(0.65 0.18 200)" },
  { id: "t3", name: "Fernanda Alves", expertise: "Product Design", color: "oklch(0.7 0.18 320)" },
  { id: "t4", name: "João Pedro", expertise: "Frontend Engineering", color: "oklch(0.65 0.18 145)" },
  { id: "t5", name: "Marina Costa", expertise: "Machine Learning", color: "oklch(0.7 0.18 60)" },
];

export function getTeachersByIds(ids: string[]): Teacher[] {
  return TEACHERS.filter((t) => ids.includes(t.id));
}
