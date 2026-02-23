import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Paper, Table, Group, ActionIcon, Modal, TextInput, Checkbox, Stack, Title, Select, NumberInput, Badge } from '@mantine/core';
import { LibBadge } from '@components/ui/LibBadge';
import { LibBadge } from '@components/ui/LibBadge';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

type Product = { id: number; name: string; sku?: string; price?: number; qty?: number; availability?: boolean; category?: { name: string }; brand?: { name: string }; store?: { name: string } };

export default function ProductsPage() {
  usePageApiHelpSimple("Products", "products", { name: "string", sku: "string", price: 0, category_id: null, brand_id: null, store_id: null, availability: true });
  const storeIdFromContext = useStoreId();
  const qc = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [qty, setQty] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);

  const listParams = storeIdFromContext ? { store_id: storeIdFromContext } : undefined;
  const { data: products = [] } = useQuery({
    queryKey: ['products', storeIdFromContext],
    queryFn: async () => (await crudApi.products.list(listParams)).data?.data ?? [],
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await crudApi.categories.list()).data?.data ?? [],
  });
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await crudApi.brands.list()).data?.data ?? [],
  });
  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => (await crudApi.stores.list()).data?.data ?? [],
  });

  const list: Product[] = Array.isArray(products) ? products : [];

  const openCreate = () => { setEditing(null); setName(''); setSku(''); setPrice(''); setQty(0); setAvailability(true); setCategoryId(null); setBrandId(null); setStoreId(storeIdFromContext != null ? String(storeIdFromContext) : null); open(); };
  const openEdit = (row: Product) => {
    setEditing(row); setName(row.name); setSku(row.sku ?? ''); setPrice(row.price ?? ''); setQty(row.qty ?? 0); setAvailability(row.availability ?? true);
    setCategoryId((row as { category_id?: number })?.category_id ? String((row as { category_id?: number }).category_id) : null);
    setBrandId((row as { brand_id?: number })?.brand_id ? String((row as { brand_id?: number }).brand_id) : null);
    setStoreId((row as { store_id?: number })?.store_id ? String((row as { store_id?: number }).store_id) : null);
    open();
  };

  const createMu = useMutation({
    mutationFn: () => crudApi.products.create({ name, sku: sku || null, price: price === '' ? null : Number(price), qty, availability, category_id: categoryId ? +categoryId : null, brand_id: brandId ? +brandId : null, store_id: storeId ? +storeId : storeIdFromContext ?? null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); close(); notifications.show({ message: 'Created', color: 'green' }); },
  });
  const updateMu = useMutation({
    mutationFn: () => editing ? crudApi.products.update(editing.id, { name, sku: sku || null, price: price === '' ? null : Number(price), qty, availability, category_id: categoryId ? +categoryId : null, brand_id: brandId ? +brandId : null, store_id: storeId ? +storeId : storeIdFromContext ?? null }) : Promise.reject(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); close(); setEditing(null); notifications.show({ message: 'Updated', color: 'green' }); },
  });
  const deleteMu = useMutation({
    mutationFn: (id: number) => crudApi.products.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); notifications.show({ message: 'Deleted', color: 'green' }); },
  });

  const catOpts = (Array.isArray(categories) ? categories : []).map((c: { id: number; name: string }) => ({ value: String(c.id), label: c.name }));
  const brandOpts = (Array.isArray(brands) ? brands : []).map((b: { id: number; name: string }) => ({ value: String(b.id), label: b.name }));
  const storeOpts = (Array.isArray(stores) ? stores : []).map((s: { id: number; name: string }) => ({ value: String(s.id), label: s.name }));

  return (
    <Paper p="xl" radius="md" shadow="sm">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Products</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>Add</Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr><Table.Th>Name</Table.Th><Table.Th>SKU</Table.Th><Table.Th>Category</Table.Th><Table.Th>Brand</Table.Th><Table.Th>Store</Table.Th><Table.Th>Price</Table.Th><Table.Th>Qty</Table.Th><Table.Th>Availability</Table.Th><Table.Th>Actions</Table.Th></Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {list.map((row) => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.name}</Table.Td>
              <Table.Td>{row.sku ?? '-'}</Table.Td>
              <Table.Td><LibBadge value={row.category?.name} /></Table.Td>
              <Table.Td><LibBadge value={row.brand?.name} /></Table.Td>
              <Table.Td><LibBadge value={row.store?.name} /></Table.Td>
              <Table.Td>{row.price != null ? row.price : '-'}</Table.Td>
              <Table.Td>{row.qty ?? 0}</Table.Td>
              <Table.Td><Badge size="sm" variant="light" color={row.availability ? 'green' : 'gray'}>{row.availability ? 'Yes' : 'No'}</Badge></Table.Td>
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
      <Modal opened={opened} onClose={close} title={editing ? 'Edit product' : 'Create product'}>
        <Stack>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextInput label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
          <NumberInput label="Price" value={price} onChange={setPrice} min={0} decimalScale={2} />
          <NumberInput label="Qty" value={qty} onChange={(v) => setQty(Number(v) || 0)} min={0} />
          <Select label="Category" data={catOpts} value={categoryId} onChange={setCategoryId} clearable />
          <Select label="Brand" data={brandOpts} value={brandId} onChange={setBrandId} clearable />
          <Select label="Store" data={storeOpts} value={storeId} onChange={setStoreId} clearable />
          <Checkbox label="Availability" checked={availability} onChange={(e) => setAvailability(e.currentTarget.checked)} />
          <Button onClick={() => editing ? updateMu.mutate() : createMu.mutate()} loading={createMu.isPending || updateMu.isPending}>{editing ? 'Update' : 'Create'}</Button>
        </Stack>
      </Modal>
    </Paper>
  );
}
