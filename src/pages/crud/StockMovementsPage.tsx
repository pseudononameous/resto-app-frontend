import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, NumberInput, Select } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

const MOVEMENT_TYPES = ['prepared', 'sold', 'waste', 'adjustment', 'purchase'];

export default function StockMovementsPage() {
  usePageApiHelpSimple("Stock Movements", "stock-movements", { product_id: 1, movement_type: "adjustment", quantity: 0 });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [product_id, setProductId] = useState<string | null>(null);
  const [movement_type, setMovementType] = useState('adjustment');
  const [quantity, setQuantity] = useState(0);

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: list = [] } = useQuery({ queryKey: ['stock-movements', storeId], queryFn: async () => (await crudApi.stockMovements.list(listParams)).data?.data ?? [] });
  const { data: products = [] } = useQuery({ queryKey: ['products', storeId], queryFn: async () => { const r = (await crudApi.products.list(listParams)).data as { data?: unknown[] }; return Array.isArray(r?.data) ? r.data : []; } });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.stockMovements.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-movements'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.stockMovements.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-movements'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.stockMovements.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['stock-movements'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(list) ? list : [];
  const prodOpts = (Array.isArray(products) ? products : []).map((p: { id: number; name: string }) => ({ value: String(p.id), label: p.name }));
  const openCreate = () => { setEditingId(null); setProductId(null); setMovementType('adjustment'); setQuantity(0); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setProductId(r.product_id != null ? String(r.product_id) : null); setMovementType(String(r.movement_type ?? 'adjustment')); setQuantity(Number(r.quantity ?? 0)); setOpened(true); };
  const handleSave = () => { const payload = { product_id: product_id ? +product_id : null, movement_type, quantity }; if (!payload.product_id) { notifications.show({ message: 'Product required', color: 'red' }); return; } if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Stock Movements" subtitle="Manage stock movements" actionLabel="Add Movement" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'movement_type', header: 'Type' }, { key: 'quantity', header: 'Qty' }, { key: 'product_id', header: 'Product ID' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Movement' : 'New Movement'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <Select label="Product" data={prodOpts} value={product_id} onChange={setProductId} required />
          <Select label="Type" data={MOVEMENT_TYPES.map((t) => ({ value: t, label: t }))} value={movement_type} onChange={(v) => v && setMovementType(v)} />
          <NumberInput label="Quantity" value={quantity} onChange={(v) => setQuantity(Number(v) || 0)} min={0} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
