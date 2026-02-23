import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput, Select, NumberInput } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

export default function WasteLogsPage() {
  usePageApiHelpSimple("Waste Logs", "waste-logs", { product_id: 1, quantity: 0, reason: "string", date: "2025-01-01" });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [product_id, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: list = [] } = useQuery({ queryKey: ['waste-logs', storeId], queryFn: async () => (await crudApi.wasteLogs.list(listParams)).data?.data ?? [] });
  const { data: products = [] } = useQuery({ queryKey: ['products', storeId], queryFn: async () => { const r = (await crudApi.products.list(listParams)).data as { data?: unknown[] }; return Array.isArray(r?.data) ? r.data : []; } });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.wasteLogs.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['waste-logs'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.wasteLogs.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['waste-logs'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.wasteLogs.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['waste-logs'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(list) ? list : [];
  const prodOpts = (Array.isArray(products) ? products : []).map((p: { id: number; name: string }) => ({ value: String(p.id), label: p.name }));
  const openCreate = () => { setEditingId(null); setProductId(null); setQuantity(0); setReason(''); setDate(''); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setProductId(r.product_id != null ? String(r.product_id) : null); setQuantity(Number(r.quantity ?? 0)); setReason(String(r.reason ?? '')); setDate(r.date ? String(r.date).slice(0, 10) : ''); setOpened(true); };
  const handleSave = () => { const payload = { product_id: product_id ? +product_id : null, quantity, reason: reason || null, date: date || null }; if (!payload.product_id) { notifications.show({ message: 'Product required', color: 'red' }); return; } if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Waste Logs" subtitle="Manage waste logs" actionLabel="Add Waste Log" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'product_id', header: 'Product ID' }, { key: 'quantity', header: 'Qty' }, { key: 'reason', header: 'Reason' }, { key: 'date', header: 'Date' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Waste Log' : 'New Waste Log'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <Select label="Product" data={prodOpts} value={product_id} onChange={setProductId} required />
          <NumberInput label="Quantity" value={quantity} onChange={(v) => setQuantity(Number(v) || 0)} min={0} />
          <TextInput label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          <TextInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
