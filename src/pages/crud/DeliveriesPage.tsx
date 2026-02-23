import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, Select, TextInput } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

const STATUS_OPTS = ['pending', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => ({ value: s, label: s }));

export default function DeliveriesPage() {
  usePageApiHelpSimple("Deliveries", "deliveries", { order_id: 1, address_id: 1, zone_id: null, status: "pending" });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [order_id, setOrderId] = useState<string | null>(null);
  const [address_id, setAddressId] = useState<string | null>(null);
  const [zone_id, setZoneId] = useState<string | null>(null);
  const [status, setStatus] = useState('pending');

  const orderListParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: list = [] } = useQuery({ queryKey: ['deliveries', storeId], queryFn: async () => (await crudApi.deliveries.list()).data?.data ?? [] });
  const { data: orders = [] } = useQuery({ queryKey: ['orders', storeId], queryFn: async () => (await crudApi.orders.list(orderListParams)).data?.data ?? [] });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.deliveries.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['deliveries'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.deliveries.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['deliveries'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.deliveries.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['deliveries'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(list) ? list : [];
  const orderOpts = (Array.isArray(orders) ? orders : []).map((o: { id: number; bill_no: string }) => ({ value: String(o.id), label: o.bill_no || `Order #${o.id}` }));
  const { data: zones = [] } = useQuery({ queryKey: ['delivery-zones'], queryFn: async () => (await crudApi.deliveryZones.list()).data?.data ?? [] });
  const zoneOpts = (Array.isArray(zones) ? zones : []).map((z: { id: number; zone_name: string }) => ({ value: String(z.id), label: z.zone_name || `Zone ${z.id}` }));
  const openCreate = () => { setEditingId(null); setOrderId(null); setAddressId(null); setZoneId(null); setStatus('pending'); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setOrderId(r.order_id != null ? String(r.order_id) : null); setAddressId(r.address_id != null ? String(r.address_id) : null); setZoneId(r.zone_id != null ? String(r.zone_id) : null); setStatus(String(r.status ?? 'pending')); setOpened(true); };
  const handleSave = () => { const payload = { order_id: order_id ? +order_id : null, address_id: address_id ? +address_id : null, zone_id: zone_id ? +zone_id : null, status }; if (!payload.order_id || !payload.address_id) { notifications.show({ message: 'Order and Address required', color: 'red' }); return; } if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Deliveries" subtitle="Manage deliveries" actionLabel="Add Delivery" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'order_id', header: 'Order ID' }, { key: 'status', header: 'Status' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Delivery' : 'New Delivery'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <Select label="Order" data={orderOpts} value={order_id} onChange={setOrderId} required />
          <TextInput label="Address ID" value={address_id || ''} onChange={(e) => setAddressId(e.target.value || null)} required />
          <Select label="Zone" data={zoneOpts} value={zone_id} onChange={setZoneId} clearable />
          <Select label="Status" data={STATUS_OPTS} value={status} onChange={(v) => v && setStatus(v)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
