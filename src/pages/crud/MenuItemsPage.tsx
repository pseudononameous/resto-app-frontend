import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput, NumberInput, Select, Checkbox } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

export default function MenuItemsPage() {
  usePageApiHelpSimple("Menu Items", "menu-items", { display_name: "string", base_price: 0, menu_category_id: null, product_id: null, is_available: true });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [display_name, setDisplayName] = useState('');
  const [base_price, setBasePrice] = useState<number | string>('');
  const [menu_category_id, setMenuCategoryId] = useState<string | null>(null);
  const [product_id, setProductId] = useState<string | null>(null);
  const [is_available, setIsAvailable] = useState(true);

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: items = [] } = useQuery({ queryKey: ['menu-items', storeId], queryFn: async () => (await crudApi.menuItems.list(listParams)).data?.data ?? [] });
  const { data: categories = [] } = useQuery({ queryKey: ['menu-categories', storeId], queryFn: async () => (await crudApi.menuCategories.list(listParams)).data?.data ?? [] });
  const { data: products = [] } = useQuery({ queryKey: ['products', storeId], queryFn: async () => { const r = (await crudApi.products.list(listParams)).data as { data?: unknown[] }; return Array.isArray(r?.data) ? r.data : []; } });

  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.menuItems.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu-items'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.menuItems.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu-items'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.menuItems.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['menu-items'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(items) ? items : [];
  const catOpts = (Array.isArray(categories) ? categories : []).map((c: { id: number; name: string }) => ({ value: String(c.id), label: c.name }));
  const prodOpts = (Array.isArray(products) ? products : []).map((p: { id: number; name: string }) => ({ value: String(p.id), label: p.name }));

  const openCreate = () => { setEditingId(null); setDisplayName(''); setBasePrice(''); setMenuCategoryId(null); setProductId(null); setIsAvailable(true); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setDisplayName(String(r.display_name ?? '')); setBasePrice((r.base_price as number) ?? ''); setMenuCategoryId(r.menu_category_id != null ? String(r.menu_category_id) : null); setProductId(r.product_id != null ? String(r.product_id) : null); setIsAvailable(Boolean(r.is_available)); setOpened(true); };
  const handleSave = () => {
    const payload = { display_name: display_name.trim() || null, base_price: base_price === '' ? null : Number(base_price), menu_category_id: menu_category_id ? +menu_category_id : null, product_id: product_id ? +product_id : null, is_available: is_available, store_id: storeId ?? undefined };
    if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload);
  };

  return (
    <Stack gap="xl">
      <PageHeader title="Menu Items" subtitle="Manage menu items" actionLabel="Add Menu Item" onAction={openCreate} />
      <DataTable
        columns={[{ key: 'id', header: 'ID' }, { key: 'display_name', header: 'Display Name' }, { key: 'base_price', header: 'Price' }, { key: 'is_available', header: 'Available', render: (r) => (r as Record<string, unknown>).is_available ? 'Yes' : 'No' }]}
        data={rows}
        keyExtractor={(r) => (r as { id: number }).id}
        actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />}
      />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Menu Item' : 'New Menu Item'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <TextInput label="Display Name" value={display_name} onChange={(e) => setDisplayName(e.target.value)} />
          <NumberInput label="Base Price" value={base_price} onChange={setBasePrice} min={0} decimalScale={2} />
          <Select label="Menu Category" data={catOpts} value={menu_category_id} onChange={setMenuCategoryId} clearable />
          <Select label="Product" data={prodOpts} value={product_id} onChange={setProductId} clearable />
          <Checkbox label="Available" checked={is_available} onChange={(e) => setIsAvailable(e.currentTarget.checked)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
