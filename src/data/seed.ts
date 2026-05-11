import type { Workshop } from "@/context/WorkshopsContext";

const today = new Date();
const addDays = (d: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + d);
  return date.toISOString();
};

export const SEED_WORKSHOPS: Workshop[] = [
  {
    id: "w1",
    title: "Design Systems na Prática",
    description:
      "Aprenda a construir um design system escalável com tokens, componentes acessíveis e documentação viva.",
    date: addDays(5),
    teacherIds: ["t3", "t4"],
    createdAt: addDays(-12),
  },
  {
    id: "w2",
    title: "Introdução a Machine Learning",
    description:
      "Conceitos fundamentais de ML supervisionado, métricas, validação cruzada e exemplos com Python.",
    date: addDays(12),
    teacherIds: ["t2", "t5"],
    createdAt: addDays(-8),
  },
  {
    id: "w3",
    title: "Pesquisa com Usuários",
    description:
      "Técnicas qualitativas e quantitativas para entender comportamento, dores e oportunidades de produto.",
    date: addDays(-3),
    teacherIds: ["t1"],
    createdAt: addDays(-20),
  },
  {
    id: "w4",
    title: "React Avançado: Padrões e Performance",
    description:
      "Padrões modernos com hooks, suspense, memoização inteligente e otimização de renderização.",
    date: addDays(20),
    teacherIds: ["t4"],
    createdAt: addDays(-2),
  },
  {
    id: "w5",
    title: "Storytelling com Dados",
    description:
      "Como transformar dashboards em narrativas claras, com hierarquia visual e foco em decisões.",
    date: addDays(34),
    teacherIds: ["t2", "t1"],
    createdAt: addDays(-1),
  },
];
