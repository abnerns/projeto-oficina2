import { createFileRoute } from "@tanstack/react-router";
import { WorkshopForm } from "@/components/workshops/WorkshopForm";

export const Route = createFileRoute("/_app/workshops/$id/edit")({
  head: () => ({
    meta: [{ title: "Editar Oficina" }],
  }),
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  return <WorkshopForm mode="edit" id={id} />;
}
