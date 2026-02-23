import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput, Select, NumberInput, Checkbox } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

export default function OrdersPage() {
  usePageApiHelpSimple("Orders", "orders", { bill_no: "string", order_type_id: 1, customer_id: null, net_amount: 0, paid_status: false });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bill_no, setBillNo] = useState('');
  const [order_type_id, setOrderTypeId] = useState<string | null>(null);
  const [customer_id, setCustomerId] = useState<string | null>(null);
  const [net_amount, setNetAmount] = useState<number | string>('');
  const [paid_status, setPaidStatus] = useState(false);

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: orders = [] } = useQuery({ queryKey: ['orders', storeId], queryFn: async () => (await crudApi.orders.list(listParams)).data?.data ?? [] });
  const { data: orderTypes = [] } = useQuery({ queryKey: ['order-types'], queryFn: async () => (await crudApi.orderTypes.list()).data?.data ?? [] });
  const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: async () => (await crudApi.customers.list()).data?.data ?? [] });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.orders.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.orders.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.orders.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(orders) ? orders : [];
  const typeOpts = (Array.isArray(orderTypes) ? orderTypes : []).map((t: { id: number; type_name: string }) => ({ value: String(t.id), label: t.type_name }));
  const custOpts = (Array.isArray(customers) ? customers : []).map((c: { id: number; customer_code: string }) => ({ value: String(c.id), label: c.customer_code }));
  const openCreate = () => { setEditingId(null); setBillNo(''); setOrderTypeId(null); setCustomerId(null); setNetAmount(''); setPaidStatus(false); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setBillNo(String(r.bill_no ?? '')); setOrderTypeId(r.order_type_id != null ? String(r.order_type_id) : null); setCustomerId(r.customer_id != null ? String(r.customer_id) : null); setNetAmount((r.net_amount as number) ?? ''); setPaidStatus(Boolean(r.paid_status)); setOpened(true); };
  const handleSave = () => { const payload = { bill_no: bill_no || null, order_type_id: order_type_id ? +order_type_id : null, customer_id: customer_id ? +customer_id : null, net_amount: net_amount === '' ? null : Number(net_amount), paid_status, store_id: storeId ?? undefined }; if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Orders" subtitle="Manage orders" actionLabel="Add Order" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'bill_no', header: 'Bill No' }, { key: 'net_amount', header: 'Amount' }, { key: 'paid_status', header: 'Paid', render: (r) => (r as Record<string, unknown>).paid_status ? 'Yes' : 'No' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Order' : 'New Order'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <TextInput label="Bill No" value={bill_no} onChange={(e) => setBillNo(e.target.value)} />
          <Select label="Order Type" data={typeOpts} value={order_type_id} onChange={setOrderTypeId} required />
          <Select label="Customer" data={custOpts} value={customer_id} onChange={setCustomerId} clearable />
          <NumberInput label="Net Amount" value={net_amount} onChange={setNetAmount} min={0} decimalScale={2} />
          <Checkbox label="Paid" checked={paid_status} onChange={(e) => setPaidStatus(e.currentTarget.checked)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
