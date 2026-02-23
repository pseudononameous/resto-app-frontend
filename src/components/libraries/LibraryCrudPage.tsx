import { useState, useEffect } from "react";
import { TextInput, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { PageHeader, ActionButtons, CrudModal } from "@components/ui";
import { DataTable } from "@components/tables";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiHelp, buildApiSpec } from "@contexts/ApiHelpContext";

export type LibraryRecord = { id: number; name: string };

export type LibraryApi = {
  list: () => Promise<{ data: { data?: (LibraryRecord & Record<string, unknown>)[] } }>;
  create: (payload: Record<string, unknown>) => Promise<unknown>;
  update: (id: number, payload: Record<string, unknown>) => Promise<unknown>;
  delete: (id: number) => Promise<unknown>;
};

const NAME_KEYS = ["name", "type_name", "zone_name", "group_name"] as const;
type NameKey = (typeof NAME_KEYS)[number];

export default function LibraryCrudPage({ title, api, queryKey, fieldName = "name", apiPath }: { title: string; api: LibraryApi; queryKey: string; fieldName?: NameKey; apiPath?: string }) {
  const qc = useQueryClient();
  const { setApiHelp } = useApiHelp();
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (apiPath) setApiHelp(buildApiSpec(title, apiPath, { [fieldName]: "string", active: true }));
    return () => setApiHelp(null);
  }, [title, apiPath, fieldName, setApiHelp]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");

  const { data = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => (await api.list()).data?.data ?? [],
  });
  const create = useMutation({ mutationFn: (d: Record<string, string>) => api.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setOpened(false); notifications.show({ message: "Created", color: "green" }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, string> }) => api.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setOpened(false); setEditingId(null); notifications.show({ message: "Updated", color: "green" }); } });
  const remove = useMutation({ mutationFn: (id: number) => api.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); notifications.show({ message: "Deleted", color: "green" }); } });

  const rows = (Array.isArray(data) ? data : []) as (LibraryRecord & Record<string, unknown>)[];
  const getDisplayName = (r: Record<string, unknown>) => String(NAME_KEYS.map((k) => r[k]).find(Boolean) ?? "—");
  const openCreate = () => { setEditingId(null); setName(""); setOpened(true); };
  const openEdit = (row: Record<string, unknown>) => { setEditingId(row.id as number); setName(getDisplayName(row)); setOpened(true); };
  const handleSave = () => {
    const n = name.trim();
    if (!n) { notifications.show({ message: "Required", color: "red" }); return; }
    const payload = { [fieldName]: n };
    if (editingId !== null) update.mutate({ id: editingId, payload });
    else create.mutate(payload);
  };

  return (
    <Stack gap="xl">
      <PageHeader title={title} subtitle={`Manage ${title.toLowerCase()}`} actionLabel={`Add ${title.slice(0, -1)}`} onAction={openCreate} />
      <DataTable<LibraryRecord & Record<string, unknown>> columns={[{ key: "id", header: "ID" }, { key: "name", header: "Name", render: getDisplayName }]} data={rows} keyExtractor={(r) => r.id} isLoading={isLoading} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate(r.id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? "Update" : "Create"}><TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" radius="md" /></CrudModal>
    </Stack>
  );
}
