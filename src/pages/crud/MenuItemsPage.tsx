import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput, NumberInput, Select, Checkbox, Group, Button, Box } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';
import { IconPlus, IconTrash } from '@tabler/icons-react';

type IngredientRow = { product_id: string; quantity_per_serving: number };

export default function MenuItemsPage() {
  usePageApiHelpSimple("Menu Items", "menu-items", { display_name: "string", base_price: 0, menu_category_id: null, image_path: null, ingredients: [], is_available: true });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [display_name, setDisplayName] = useState('');
  const [base_price, setBasePrice] = useState<number | string>('');
  const [image_path, setImagePath] = useState('');
  const [menu_category_id, setMenuCategoryId] = useState<string | null>(null);
  const [is_available, setIsAvailable] = useState(true);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);

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

  const openCreate = () => {
    setEditingId(null); setDisplayName(''); setBasePrice(''); setImagePath(''); setMenuCategoryId(null); setIsAvailable(true);
    setIngredients([{ product_id: '', quantity_per_serving: 1 }]);
    setOpened(true);
  };
  const openEdit = (r: Record<string, unknown>) => {
    setEditingId(r.id as number);
    setDisplayName(String(r.display_name ?? ''));
    setBasePrice((r.base_price as number) ?? '');
    setImagePath(String(r.image_path ?? ''));
    setMenuCategoryId(r.menu_category_id != null ? String(r.menu_category_id) : null);
    setIsAvailable(Boolean(r.is_available));
    const ing = (r.ingredients as { product_id: number; quantity_per_serving: number }[] | undefined) ?? [];
    setIngredients(ing.length ? ing.map((i) => ({ product_id: String(i.product_id), quantity_per_serving: Number(i.quantity_per_serving) || 1 })) : [{ product_id: '', quantity_per_serving: 1 }]);
    setOpened(true);
  };

  const addIngredient = () => setIngredients((prev) => [...prev, { product_id: '', quantity_per_serving: 1 }]);
  const updateIngredient = (idx: number, field: keyof IngredientRow, value: string | number) => {
    setIngredients((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };
  const removeIngredient = (idx: number) => setIngredients((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    const ingPayload = ingredients.filter((i) => i.product_id).map((i) => ({ product_id: +i.product_id, quantity_per_serving: i.quantity_per_serving }));
    const payload = {
      display_name: display_name.trim() || null,
      base_price: base_price === '' ? null : Number(base_price),
      image_path: image_path.trim() || null,
      menu_category_id: menu_category_id ? +menu_category_id : null,
      is_available: is_available,
      store_id: storeId ?? undefined,
      ingredients: ingPayload,
    };
    if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload);
  };

  return (
    <Stack gap="xl">
      <PageHeader title="Menu Items" subtitle="Manage menu items and their ingredient products" actionLabel="Add Menu Item" onAction={openCreate} />
      <DataTable
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'display_name', header: 'Display Name' },
          { key: 'base_price', header: 'Price' },
          { key: 'is_available', header: 'Available', render: (r) => (r as Record<string, unknown>).is_available ? 'Yes' : 'No' },
        ]}
        data={rows}
        keyExtractor={(r) => (r as { id: number }).id}
        actions={(r) => (
          <ActionButtons
            viewTo={`/dashboard/menu-items/${(r as { id: number }).id}`}
            viewTitle="View details"
            onEdit={() => openEdit(r)}
            onDelete={() => remove.mutate((r as { id: number }).id)}
          />
        )}
      />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Menu Item' : 'New Menu Item'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <TextInput label="Display Name" value={display_name} onChange={(e) => setDisplayName(e.target.value)} />
          <NumberInput label="Base Price" value={base_price} onChange={setBasePrice} min={0} decimalScale={2} />
          <TextInput label="Image URL" placeholder="https://..." value={image_path} onChange={(e) => setImagePath(e.target.value)} />
          <Select label="Menu Category" data={catOpts} value={menu_category_id} onChange={setMenuCategoryId} clearable />
          <div>
            <Group justify="space-between" mb="xs">
              <span style={{ fontWeight: 600, fontSize: 14 }}>Ingredients (products to deduct when ordered)</span>
              <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={addIngredient}>Add</Button>
            </Group>
            {ingredients.map((row, idx) => (
              <Group key={idx} gap="xs" mb="xs" align="flex-end">
                <Select data={prodOpts} value={row.product_id} onChange={(v) => updateIngredient(idx, 'product_id', v ?? '')} placeholder="Product" style={{ flex: 1 }} clearable />
                <NumberInput placeholder="Qty" value={row.quantity_per_serving} onChange={(v) => updateIngredient(idx, 'quantity_per_serving', Number(v) || 0)} min={0} decimalScale={2} style={{ width: 100 }} />
                <Button size="xs" variant="subtle" color="red" onClick={() => removeIngredient(idx)}><IconTrash size={14} /></Button>
              </Group>
            ))}
          </div>
          <Checkbox label="Available" checked={is_available} onChange={(e) => setIsAvailable(e.currentTarget.checked)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
