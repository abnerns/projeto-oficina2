import { createFileRoute } from "@tanstack/react-router";
import { WorkshopForm } from "@/components/workshops/WorkshopForm";

export const Route = createFileRoute("/_app/workshops/new")({
  head: () => ({
    meta: [
      { title: "Nova oficina" },
      { name: "description", content: "Crie uma nova oficina educacional." },
    ],
  }),
  component: () => <WorkshopForm mode="create" />,
});
