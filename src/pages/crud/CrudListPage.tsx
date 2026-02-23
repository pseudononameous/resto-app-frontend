import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Paper, Table, Group, ActionIcon, Modal, TextInput, Checkbox, Stack, Title, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useState, useCallback } from 'react';
type Row = { id: number; name: string; active?: boolean };

type CrudApi = { list: () => Promise<{ data: { data?: Row[] } }>; get: (id: number) => Promise<unknown>; create: (d: object) => Promise<unknown>; update: (id: number, d: object) => Promise<unknown>; delete: (id: number) => Promise<unknown> };

type Props = {
  title: string;
  api: CrudApi;
  columns?: { key: keyof Row | string; label: string }[];
};

export default function CrudListPage({ title, api, columns = [{ key: 'name', label: 'Name' }, { key: 'active', label: 'Active' }] }: Props) {
  const qc = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: [title, 'list'],
    queryFn: async () => (await api.list()).data?.data ?? [],
  });
  const list: Row[] = Array.isArray(data) ? data : [];

  const openCreate = useCallback(() => {
    setEditing(null);
    setName('');
    setActive(true);
    open();
  }, [open]);
  const openEdit = useCallback((row: Row) => {
    setEditing(row);
    setName(row.name);
    setActive(row.active ?? true);
    open();
  }, [open]);

  const createMu = useMutation({
    mutationFn: () => api.create({ name, active }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [title] }); close(); notifications.show({ message: 'Created', color: 'green' }); },
    onError: () => { },
  });
  const updateMu = useMutation({
    mutationFn: () => (editing ? api.update(editing.id, { name, active }) : Promise.reject()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [title] }); close(); setEditing(null); notifications.show({ message: 'Updated', color: 'green' }); },
  });
  const deleteMu = useMutation({
    mutationFn: (id: number) => api.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [title] }); notifications.show({ message: 'Deleted', color: 'green' }); },
  });

  const submit = () => {
    if (editing) updateMu.mutate(undefined);
    else createMu.mutate(undefined);
  };

  return (
    <Paper p="xl" radius="md" shadow="sm">
      <Group justify="space-between" mb="lg">
        <Title order={3}>{title}</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>Add</Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((c) => <Table.Th key={String(c.key)}>{c.label}</Table.Th>)}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {list.map((row) => (
            <Table.Tr key={row.id}>
              {columns.map((c) => (
                <Table.Td key={String(c.key)}>
                  {c.key === 'active' ? (row.active ? 'Yes' : 'No') : String((row as Record<string, unknown>)[c.key as string] ?? '')}
                </Table.Td>
              ))}
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" onClick={() => openEdit(row)}><IconEdit size={16} /></ActionIcon>
                  <ActionIcon color="red" variant="subtle" onClick={() => deleteMu.mutate(row.id)}><IconTrash size={16} /></ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editing ? 'Edit' : 'Create'}>
        <Stack>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Checkbox label="Active" checked={active} onChange={(e) => setActive(e.currentTarget.checked)} />
          <Button onClick={submit} loading={createMu.isPending || updateMu.isPending}>{editing ? 'Update' : 'Create'}</Button>
        </Stack>
      </Modal>
    </Paper>
  );
}
