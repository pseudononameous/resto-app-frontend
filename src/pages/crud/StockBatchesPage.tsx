import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, NumberInput, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

export default function StockBatchesPage() {
  usePageApiHelpSimple("Stock Batches", "stock-batches", { product_id: 1, quantity: 0, prepared_date: null, expiry_date: null });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [product_id, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [prepared_date, setPreparedDate] = useState('');
  const [expiry_date, setExpiryDate] = useState('');

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: list = [] } = useQuery({ queryKey: ['stock-batches', storeId], queryFn: async () => (await crudApi.stockBatches.list(listParams)).data?.data ?? [] });
  const { data: products = [] } = useQuery({ queryKey: ['products', storeId], queryFn: async () => { const r = (await crudApi.products.list(listParams)).data as { data?: unknown[] }; return Array.isArray(r?.data) ? r.data : []; } });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.stockBatches.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-batches'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.stockBatches.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-batches'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.stockBatches.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-batches'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(list) ? list : [];
  const prodOpts = (Array.isArray(products) ? products : []).map((p: { id: number; name: string }) => ({ value: String(p.id), label: p.name }));
  const openCreate = () => { setEditingId(null); setProductId(null); setQuantity(0); setPreparedDate(''); setExpiryDate(''); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setProductId(r.product_id != null ? String(r.product_id) : null); setQuantity(Number(r.quantity ?? 0)); setPreparedDate(r.prepared_date ? String(r.prepared_date).slice(0, 10) : ''); setExpiryDate(r.expiry_date ? String(r.expiry_date).slice(0, 10) : ''); setOpened(true); };
  const handleSave = () => { const payload = { product_id: product_id ? +product_id : null, quantity, prepared_date: prepared_date || null, expiry_date: expiry_date || null }; if (!payload.product_id) { notifications.show({ message: 'Product required', color: 'red' }); return; } if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Stock Batches" subtitle="Manage stock batches" actionLabel="Add Batch" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'quantity', header: 'Qty' }, { key: 'prepared_date', header: 'Prepared' }, { key: 'expiry_date', header: 'Expiry' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Batch' : 'New Batch'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <Select label="Product" data={prodOpts} value={product_id} onChange={setProductId} required />
          <NumberInput label="Quantity" value={quantity} onChange={(v) => setQuantity(Number(v) || 0)} min={0} />
          <TextInput label="Prepared Date" type="date" value={prepared_date} onChange={(e) => setPreparedDate(e.target.value)} />
          <TextInput label="Expiry Date" type="date" value={expiry_date} onChange={(e) => setExpiryDate(e.target.value)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
