import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";
import { StatusBadgeProps } from "./statusBadge";

export function RowActions({
  id,
  status,
}: {
  id: string;
  status: StatusBadgeProps["status"];
}) {
  const handleEdit = () => alert(`Editar ${id}`);
  const handleDelete = () => alert(`Cancelar ${id}`);

  return (
    <div className="flex gap-2">
      {status === "agendado" && <EditButton onClick={handleEdit} size="md" />}
      <DeleteButton onClick={handleDelete} />
    </div>
  );
}
