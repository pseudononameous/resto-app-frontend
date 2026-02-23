import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput, Select } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

export default function CartsPage() {
  usePageApiHelpSimple("Carts", "carts", { cart_code: "string", table_number: "string", status: "active", total: 0 });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cart_code, setCartCode] = useState('');
  const [table_number, setTableNumber] = useState('');
  const [status, setStatus] = useState('active');
  const [total, setTotal] = useState(0);

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data = [], isLoading } = useQuery({ queryKey: ['carts', storeId], queryFn: async () => (await crudApi.carts.list(listParams)).data?.data ?? [] });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.carts.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['carts'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.carts.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['carts'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.carts.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['carts'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(data) ? data : [];
  const openCreate = () => { setEditingId(null); setCartCode(''); setTableNumber(''); setStatus('active'); setTotal(0); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setCartCode(String(r.cart_code ?? '')); setTableNumber(String(r.table_number ?? '')); setStatus(String(r.status ?? 'active')); setTotal(Number(r.total ?? 0)); setOpened(true); };
  const handleSave = () => { const payload = { cart_code: cart_code.trim(), table_number: table_number || null, status, total, store_id: storeId ?? undefined }; if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Carts" subtitle="Manage carts" actionLabel="Add Cart" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'cart_code', header: 'Code' }, { key: 'table_number', header: 'Table' }, { key: 'status', header: 'Status' }, { key: 'total', header: 'Total' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} isLoading={isLoading} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Cart' : 'New Cart'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <TextInput label="Cart Code" value={cart_code} onChange={(e) => setCartCode(e.target.value)} required />
          <TextInput label="Table Number" value={table_number} onChange={(e) => setTableNumber(e.target.value)} />
          <Select label="Status" data={[{ value: 'active', label: 'Active' }, { value: 'checked_out', label: 'Checked Out' }, { value: 'cancelled', label: 'Cancelled' }]} value={status} onChange={(v) => v && setStatus(v)} />
          <TextInput label="Total" type="number" value={total} onChange={(e) => setTotal(Number(e.target.value) || 0)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
