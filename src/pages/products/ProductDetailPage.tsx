import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Paper,
  Stack,
  Group,
  Text,
  Table,
  Button,
  Badge,
  Box,
  Loader,
  SimpleGrid,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  ActionIcon,
  Tabs,
  Drawer,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconPencil, IconPlus, IconTrash, IconPackage, IconAdjustments, IconTrashX, IconReport, IconDots } from '@tabler/icons-react';
import { LibBadge } from '@components/ui/LibBadge';
import { useState } from 'react';
import { crudApi } from '@services/api';
import { useStoreId } from '@contexts/StoreContext';
import { notifications } from '@mantine/notifications';

type Product = {
  id: number;
  name: string;
  sku?: string;
  price?: number;
  qty?: number;
  availability?: boolean;
  category?: { id: number; name: string };
  brand?: { name: string };
  store?: { name: string };
  category_id?: number;
  brand_id?: number;
  store_id?: number;
};

function Details({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" fw={600}>{label}</Text>
      <Text size="sm" fw={500}>{value ?? '—'}</Text>
    </Stack>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const storeId = useStoreId();
  const productId = id ? parseInt(id, 10) : NaN;
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [qty, setQty] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [batchModal, setBatchModal] = useState<'add' | { id: number } | null>(null);
  const [batchQty, setBatchQty] = useState(0);
  const [batchPrepared, setBatchPrepared] = useState('');
  const [batchExpiry, setBatchExpiry] = useState('');
  const [movementModal, setMovementModal] = useState<'add' | { id: number } | null>(null);
  const [movementType, setMovementType] = useState<string>('purchase');
  const [movementQty, setMovementQty] = useState(0);
  const [movementRef, setMovementRef] = useState('');
  const [wasteModal, setWasteModal] = useState<'add' | { id: number } | null>(null);
  const [wasteQty, setWasteQty] = useState(0);
  const [wasteReason, setWasteReason] = useState('');
  const [wasteDate, setWasteDate] = useState('');
  const [wasteBatchId, setWasteBatchId] = useState<string | null>(null);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [receiveSupplier, setReceiveSupplier] = useState('');
  const [receiveRef, setReceiveRef] = useState('');
  const [receiveQty, setReceiveQty] = useState(0);
  const [receiveCost, setReceiveCost] = useState<number | string>('');
  const [receiveDate, setReceiveDate] = useState('');
  const [receiveExpiry, setReceiveExpiry] = useState('');
  const [receiveLocation, setReceiveLocation] = useState('');
  const [receiveNotes, setReceiveNotes] = useState('');
  const [saveAndAddAnother, setSaveAndAddAnother] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustBatchId, setAdjustBatchId] = useState<string | null>(null);
  const [adjustType, setAdjustType] = useState<'Increase' | 'Decrease'>('Increase');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [batchDrawerId, setBatchDrawerId] = useState<number | null>(null);
  const [movementTypeFilter, setMovementTypeFilter] = useState<string | null>(null);
  const LOW_STOCK_DAYS = 14;
  const FRESH_DAYS = 30;

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => (await crudApi.products.get(productId)).data?.data as Product,
    enabled: Number.isInteger(productId),
  });

  const { data: stockMovements = [], isLoading: stockLoading } = useQuery({
    queryKey: ['stock-movements', productId],
    queryFn: async () => (await crudApi.stockMovements.list({ product_id: productId })).data?.data ?? [],
    enabled: Number.isInteger(productId),
  });

  const { data: wasteLogs = [], isLoading: wasteLoading } = useQuery({
    queryKey: ['waste-logs', productId],
    queryFn: async () => (await crudApi.wasteLogs.list({ product_id: productId })).data?.data ?? [],
    enabled: Number.isInteger(productId),
  });

  const { data: stockBatches = [], isLoading: batchesLoading } = useQuery({
    queryKey: ['stock-batches', productId],
    queryFn: async () => (await crudApi.stockBatches.list({ product_id: productId })).data?.data ?? [],
    enabled: Number.isInteger(productId),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await crudApi.categories.list()).data?.data ?? [],
  });
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => (await crudApi.brands.list()).data?.data ?? [],
  });

  const openEditModal = () => {
    if (!product) return;
    setName(product.name);
    setSku(product.sku ?? '');
    setPrice(product.price ?? '');
    setQty(product.qty ?? 0);
    setAvailability(product.availability ?? true);
    setCategoryId(product.category_id ? String(product.category_id) : null);
    setBrandId(product.brand_id ? String(product.brand_id) : null);
    openEdit();
  };

  const updateMu = useMutation({
    mutationFn: () =>
      crudApi.products.update(productId, {
        name,
        sku: sku || null,
        price: price === '' ? null : Number(price),
        qty,
        availability,
        category_id: categoryId ? +categoryId : null,
        brand_id: brandId ? +brandId : null,
        store_id: product?.store_id ?? storeId ?? null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product', productId] });
      closeEdit();
      notifications.show({ message: 'Updated', color: 'green' });
    },
  });

  const inv = () => {
    qc.invalidateQueries({ queryKey: ['stock-batches', productId] });
    qc.invalidateQueries({ queryKey: ['stock-movements', productId] });
    qc.invalidateQueries({ queryKey: ['waste-logs', productId] });
  };
  const batchCreate = useMutation({
    mutationFn: (payload: Record<string, unknown>) => crudApi.stockBatches.create(payload),
    onSuccess: (_, variables) => {
      inv();
      if (!saveAndAddAnother) setReceiveOpen(false);
      else {
        setReceiveQty(0); setReceiveRef(''); setReceiveExpiry(''); setReceiveNotes('');
      }
      notifications.show({ message: 'Stock received', color: 'green' });
    },
  });
  const receiveStock = () => {
    const payload = {
      product_id: productId,
      quantity: receiveQty,
      remaining_quantity: receiveQty,
      supplier: receiveSupplier || null,
      reference_no: receiveRef || null,
      unit_cost: receiveCost === '' ? null : Number(receiveCost),
      prepared_date: receiveDate || null,
      expiry_date: receiveExpiry || null,
      storage_location: receiveLocation || null,
      notes: receiveNotes || null,
    };
    batchCreate.mutate(payload as Record<string, unknown>, {
      onSuccess: () => {
        crudApi.stockMovements.create({ product_id: productId, movement_type: 'purchase', quantity: receiveQty, reference_id: receiveRef || null }).then(() => inv());
      },
    });
  };
  const adjustmentMu = useMutation({
    mutationFn: () => crudApi.stockMovements.create({
      product_id: productId,
      batch_id: adjustBatchId ? +adjustBatchId : null,
      movement_type: 'adjustment',
      quantity: adjustType === 'Decrease' ? -adjustQty : adjustQty,
      notes: adjustReason || adjustNotes || null,
    }),
    onSuccess: () => { inv(); setAdjustOpen(false); setAdjustQty(0); setAdjustReason(''); setAdjustNotes(''); notifications.show({ message: 'Adjustment saved', color: 'green' }); },
  });
  const batchUpdate = useMutation({
    mutationFn: (bid: number) => crudApi.stockBatches.update(bid, { product_id: productId, quantity: batchQty, prepared_date: batchPrepared || null, expiry_date: batchExpiry || null }),
    onSuccess: () => { inv(); setBatchModal(null); notifications.show({ message: 'Batch updated', color: 'green' }); },
  });
  const batchDelete = useMutation({
    mutationFn: (bid: number) => crudApi.stockBatches.delete(bid),
    onSuccess: () => { inv(); setBatchModal(null); notifications.show({ message: 'Batch deleted', color: 'green' }); },
  });
  const movementCreate = useMutation({
    mutationFn: () => crudApi.stockMovements.create({ product_id: productId, movement_type: movementType, quantity: movementQty, reference_id: movementRef || null }),
    onSuccess: () => { inv(); setMovementModal(null); setMovementQty(0); setMovementType('purchase'); setMovementRef(''); notifications.show({ message: 'Movement added', color: 'green' }); },
  });
  const movementUpdate = useMutation({
    mutationFn: (mid: number) => crudApi.stockMovements.update(mid, { product_id: productId, movement_type: movementType, quantity: movementQty, reference_id: movementRef || null }),
    onSuccess: () => { inv(); setMovementModal(null); notifications.show({ message: 'Movement updated', color: 'green' }); },
  });
  const movementDelete = useMutation({
    mutationFn: (mid: number) => crudApi.stockMovements.delete(mid),
    onSuccess: () => { inv(); setMovementModal(null); notifications.show({ message: 'Movement deleted', color: 'green' }); },
  });
  const wasteCreate = useMutation({
    mutationFn: () => crudApi.wasteLogs.create({ product_id: productId, batch_id: wasteBatchId ? +wasteBatchId : null, quantity: wasteQty, reason: wasteReason || null, date: wasteDate || null }),
    onSuccess: () => { inv(); setWasteModal(null); setWasteQty(0); setWasteReason(''); setWasteDate(''); setWasteBatchId(null); notifications.show({ message: 'Waste logged', color: 'green' }); },
  });
  const wasteUpdate = useMutation({
    mutationFn: (wid: number) => crudApi.wasteLogs.update(wid, { product_id: productId, batch_id: wasteBatchId ? +wasteBatchId : null, quantity: wasteQty, reason: wasteReason || null, date: wasteDate || null }),
    onSuccess: () => { inv(); setWasteModal(null); notifications.show({ message: 'Waste log updated', color: 'green' }); },
  });
  const wasteDelete = useMutation({
    mutationFn: (wid: number) => crudApi.wasteLogs.delete(wid),
    onSuccess: () => { inv(); setWasteModal(null); notifications.show({ message: 'Waste log deleted', color: 'green' }); },
  });

  const catOpts = (Array.isArray(categories) ? categories : []).map((c: { id: number; name: string }) => ({
    value: String(c.id),
    label: c.name,
  }));
  const brandOpts = (Array.isArray(brands) ? brands : []).map((b: { id: number; name: string }) => ({
    value: String(b.id),
    label: b.name,
  }));

  const movements = Array.isArray(stockMovements) ? stockMovements : [];
  const wastes = Array.isArray(wasteLogs) ? wasteLogs : [];
  const batches = Array.isArray(stockBatches) ? stockBatches : [];
  const totalStock = batches.reduce((s: number, b: { remaining_quantity?: number; quantity?: number }) => s + (b.remaining_quantity ?? b.quantity ?? 0), 0);
  const lowThreshold = product?.qty ?? 10;
  const isLowStock = totalStock <= lowThreshold;
  const getBatchStatus = (b: { remaining_quantity?: number; quantity?: number; expiry_date?: string | null }) => {
    const rem = b.remaining_quantity ?? b.quantity ?? 0;
    if (rem <= 0) return { label: 'Depleted', color: 'blue' };
    const exp = b.expiry_date ? new Date(b.expiry_date) : null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (exp) { exp.setHours(0, 0, 0, 0); const days = Math.ceil((exp.getTime() - today.getTime()) / 86400000); if (days < 0) return { label: 'Expired', color: 'red' }; if (days <= LOW_STOCK_DAYS) return { label: 'Near Expiry', color: 'yellow' }; }
    return { label: 'Fresh', color: 'green' };
  };
  const filteredMovements = movementTypeFilter ? movements.filter((m: { movement_type?: string }) => m.movement_type === movementTypeFilter) : movements;
  const batchOpts = batches.map((b: { id: number; remaining_quantity?: number; quantity?: number; expiry_date?: string }) => ({ value: String(b.id), label: `Batch #${b.id} (${b.remaining_quantity ?? b.quantity ?? 0} left)` }));

  if (productLoading || !product) {
    return (
      <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
        <Loader size="md" type="dots" />
      </Box>
    );
  }

  return (
    <Stack gap="xl" p="xs">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={18} />}
        onClick={() => navigate(-1)}
        style={{ alignSelf: 'flex-start' }}
        radius="md"
      >
        Back
      </Button>

      <Paper p="lg" radius="lg" style={{ background: 'linear-gradient(135deg, var(--mantine-color-orange-0) 0%, var(--mantine-color-orange-1) 100%)', border: '1px solid var(--mantine-color-orange-2)' }}>
        <Stack gap="md">
          <Group justify="space-between" wrap="wrap">
            <Group gap="md">
              <Button variant="subtle" size="xs" leftSection={<IconPencil size={14} />} onClick={openEditModal}>Edit product</Button>
              <Title order={3}>{product.name}</Title>
              <Group gap="xs"><Text size="sm" c="dimmed">{product.sku ?? ''}</Text><LibBadge value={product.category?.name} /><LibBadge value={product.brand?.name} variant="outline" /><LibBadge value={product.store?.name} variant="outline" /></Group>
              {isLowStock && <Badge color="red" size="sm">Low stock</Badge>}
            </Group>
            <Group>
              <Text fw={600}>Total: {totalStock}</Text>
              <Text size="xs" c="dimmed">(threshold: {lowThreshold})</Text>
            </Group>
          </Group>
          <Group gap="xs">
            <Button size="sm" leftSection={<IconPackage size={16} />} onClick={() => { setReceiveOpen(true); setReceiveDate(new Date().toISOString().slice(0, 10)); }}>Receive Stock</Button>
            <Button size="sm" variant="light" leftSection={<IconAdjustments size={16} />} onClick={() => setAdjustOpen(true)}>Adjust Stock</Button>
            <Button size="sm" variant="light" color="red" leftSection={<IconTrashX size={16} />} onClick={() => { setWasteModal('add'); setWasteDate(new Date().toISOString().slice(0, 10)); }}>Log Waste</Button>
            <Button size="sm" variant="subtle" leftSection={<IconReport size={16} />}>View Reports</Button>
          </Group>
        </Stack>
      </Paper>

      <Tabs defaultValue="batches">
        <Tabs.List>
          <Tabs.Tab value="batches">Batches</Tabs.Tab>
          <Tabs.Tab value="movements">Movements</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="batches" pt="md">
          <Paper withBorder radius="md">
            {batchesLoading ? <Box p="xl"><Loader size="sm" /></Box> : batches.length === 0 ? <Text p="lg" c="dimmed">No batches. Use Receive Stock.</Text> : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Batch ID</Table.Th>
                    <Table.Th>Received</Table.Th>
                    <Table.Th>Expiry</Table.Th>
                    <Table.Th>Qty Received</Table.Th>
                    <Table.Th>Remaining</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {batches.map((b: { id: number; quantity?: number; remaining_quantity?: number; prepared_date?: string; expiry_date?: string }) => {
                    const st = getBatchStatus(b);
                    return (
                      <Table.Tr key={b.id} style={st.color === 'red' ? { backgroundColor: 'var(--mantine-color-red-0)' } : undefined} onClick={() => setBatchDrawerId(b.id)}>
                        <Table.Td>{b.id}</Table.Td>
                        <Table.Td>{b.prepared_date ? new Date(b.prepared_date).toLocaleDateString() : '—'}</Table.Td>
                        <Table.Td>{b.expiry_date ? new Date(b.expiry_date).toLocaleDateString() : '—'}</Table.Td>
                        <Table.Td>{b.quantity ?? '—'}</Table.Td>
                        <Table.Td>{b.remaining_quantity ?? b.quantity ?? '—'}</Table.Td>
                        <Table.Td><Badge size="sm" color={st.color}>{st.label}</Badge></Table.Td>
                        <Table.Td onClick={(e) => e.stopPropagation()}>
                          <Menu position="bottom-end">
                            <Menu.Target><ActionIcon variant="subtle"><IconDots size={16} /></ActionIcon></Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item onClick={() => setBatchDrawerId(b.id)}>View Details</Menu.Item>
                              <Menu.Item onClick={() => { setBatchModal({ id: b.id }); setBatchQty(b.quantity ?? 0); setBatchPrepared((b as { prepared_date?: string }).prepared_date?.slice(0, 10) ?? ''); setBatchExpiry(b.expiry_date?.slice(0, 10) ?? ''); }}>Edit Batch</Menu.Item>
                              <Menu.Item onClick={() => { setWasteModal('add'); setWasteBatchId(String(b.id)); }}>Mark Waste</Menu.Item>
                              <Menu.Divider />
                              <Menu.Item color="red" onClick={() => window.confirm('Archive/delete batch?') && batchDelete.mutate(b.id)}>Archive</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </Tabs.Panel>
        <Tabs.Panel value="movements" pt="md">
          <Group mb="sm">
            <Select placeholder="Filter by type" clearable data={[{ value: 'purchase', label: 'IN' }, { value: 'sold', label: 'OUT' }, { value: 'waste', label: 'WASTE' }, { value: 'adjustment', label: 'ADJUSTMENT' }]} value={movementTypeFilter} onChange={setMovementTypeFilter} style={{ width: 140 }} />
            <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => { setMovementModal('add'); setMovementQty(0); setMovementType('purchase'); setMovementRef(''); }}>Add</Button>
          </Group>
          <Paper withBorder radius="md">
            {stockLoading ? <Box p="xl"><Loader size="sm" /></Box> : filteredMovements.length === 0 ? <Text p="lg" c="dimmed">No movements.</Text> : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Batch</Table.Th>
                    <Table.Th>Reference</Table.Th>
                    <Table.Th>Notes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredMovements.map((m: { id: number; created_at?: string; movement_type?: string; quantity?: number; batch_id?: number; reference_id?: number; notes?: string }) => (
                    <Table.Tr key={m.id}>
                      <Table.Td>{m.created_at ? new Date(m.created_at).toLocaleString() : '—'}</Table.Td>
                      <Table.Td>{m.movement_type ?? '—'}</Table.Td>
                      <Table.Td>{m.quantity ?? '—'}</Table.Td>
                      <Table.Td>{m.batch_id ?? '—'}</Table.Td>
                      <Table.Td>{m.reference_id ?? '—'}</Table.Td>
                      <Table.Td>{m.notes ?? '—'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>

      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={4} mb={4} fw={600}>Waste logs</Title>
          <Text size="sm" c="dimmed" fw={500}>Recorded waste for this product</Text>
        </div>
        <Button size="sm" leftSection={<IconPlus size={14} />} onClick={() => { setWasteModal('add'); setWasteQty(0); setWasteReason(''); setWasteDate(''); }}>Add waste log</Button>
      </Group>
      <Paper withBorder radius="lg" style={{ boxShadow: '0 4px 16px rgba(0,0,0,.06)' }}>
        {wasteLoading ? (
          <Box p="xl" style={{ display: 'flex', justifyContent: 'center' }}><Loader size="sm" type="dots" /></Box>
        ) : wastes.length === 0 ? (
          <Text p="lg" c="dimmed" fw={500}>No waste log records.</Text>
        ) : (
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {wastes.map((w: { id: number; quantity?: number; reason?: string; date?: string }) => (
                <Table.Tr key={w.id}>
                  <Table.Td>{w.id}</Table.Td>
                  <Table.Td>{w.quantity ?? '—'}</Table.Td>
                  <Table.Td>{w.reason ?? '—'}</Table.Td>
                  <Table.Td>{w.date ? new Date(w.date).toLocaleDateString() : '—'}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon variant="subtle" size="sm" onClick={() => { setWasteModal({ id: w.id }); setWasteQty(w.quantity ?? 0); setWasteReason(w.reason ?? ''); setWasteDate(w.date ? String(w.date).slice(0, 10) : ''); setWasteBatchId((w as { batch_id?: number }).batch_id != null ? String((w as { batch_id?: number }).batch_id) : null); }}><IconPencil size={14} /></ActionIcon>
                      <ActionIcon color="red" variant="subtle" size="sm" onClick={() => window.confirm('Delete?') && wasteDelete.mutate(w.id)}><IconTrash size={14} /></ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      <Modal opened={editOpened} onClose={closeEdit} title="Edit product">
        <Stack>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextInput label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
          <NumberInput label="Price" value={price} onChange={setPrice} min={0} decimalScale={2} />
          <NumberInput label="Qty" value={qty} onChange={(v) => setQty(Number(v) || 0)} min={0} />
          <Select label="Category" data={catOpts} value={categoryId} onChange={setCategoryId} clearable />
          <Select label="Brand" data={brandOpts} value={brandId} onChange={setBrandId} clearable />
          <Checkbox label="Availability" checked={availability} onChange={(e) => setAvailability(e.currentTarget.checked)} />
          <Button onClick={() => updateMu.mutate()} loading={updateMu.isPending}>Update</Button>
        </Stack>
      </Modal>

      <Modal opened={batchModal !== null} onClose={() => setBatchModal(null)} title={batchModal === 'add' ? 'Add stock batch' : 'Edit stock batch'}>
        <Stack>
          <NumberInput label="Quantity" value={batchQty} onChange={(v) => setBatchQty(Number(v) || 0)} min={0} required />
          <TextInput label="Prepared date" type="date" value={batchPrepared} onChange={(e) => setBatchPrepared(e.target.value)} />
          <TextInput label="Expiry date" type="date" value={batchExpiry} onChange={(e) => setBatchExpiry(e.target.value)} />
          <Group>
            <Button onClick={() => batchModal === 'add' ? batchCreate.mutate() : batchModal.id && batchUpdate.mutate(batchModal.id)} loading={batchCreate.isPending || batchUpdate.isPending}>{batchModal === 'add' ? 'Add' : 'Update'}</Button>
            {batchModal !== 'add' && batchModal?.id != null && <Button color="red" variant="light" onClick={() => batchDelete.mutate(batchModal.id)} loading={batchDelete.isPending}>Delete</Button>}
          </Group>
        </Stack>
      </Modal>

      <Modal opened={movementModal !== null} onClose={() => setMovementModal(null)} title={movementModal === 'add' ? 'Add stock movement' : 'Edit stock movement'}>
        <Stack>
          <Select label="Type" data={[{ value: 'purchase', label: 'Purchase' }, { value: 'sold', label: 'Sold' }, { value: 'prepared', label: 'Prepared' }, { value: 'waste', label: 'Waste' }, { value: 'adjustment', label: 'Adjustment' }]} value={movementType} onChange={(v) => setMovementType(v ?? 'purchase')} />
          <NumberInput label="Quantity" value={movementQty} onChange={(v) => setMovementQty(Number(v) || 0)} min={0} required />
          <TextInput label="Reference ID" value={movementRef} onChange={(e) => setMovementRef(e.target.value)} />
          <Group>
            <Button onClick={() => movementModal === 'add' ? movementCreate.mutate() : movementModal.id && movementUpdate.mutate(movementModal.id)} loading={movementCreate.isPending || movementUpdate.isPending}>{movementModal === 'add' ? 'Add' : 'Update'}</Button>
            {movementModal !== 'add' && movementModal?.id != null && <Button color="red" variant="light" onClick={() => movementDelete.mutate(movementModal.id)} loading={movementDelete.isPending}>Delete</Button>}
          </Group>
        </Stack>
      </Modal>

      <Modal opened={wasteModal !== null} onClose={() => setWasteModal(null)} title={wasteModal === 'add' ? 'Log Waste' : 'Edit waste log'}>
        <Stack>
          <Select label="Batch" data={batchOpts} value={wasteBatchId} onChange={setWasteBatchId} clearable placeholder="Optional" />
          <NumberInput label="Quantity wasted" value={wasteQty} onChange={(v) => setWasteQty(Number(v) || 0)} min={0} required />
          <Select label="Reason" data={[{ value: 'expired', label: 'Expired' }, { value: 'spoiled', label: 'Spoiled' }, { value: 'damaged', label: 'Damaged' }, { value: 'preparation_waste', label: 'Preparation waste' }, { value: 'other', label: 'Other' }]} value={wasteReason || null} onChange={setWasteReason} clearable />
          <TextInput label="Date" type="date" value={wasteDate} onChange={(e) => setWasteDate(e.target.value)} />
          <Group>
            <Button onClick={() => wasteModal === 'add' ? wasteCreate.mutate() : wasteModal.id && wasteUpdate.mutate(wasteModal.id)} loading={wasteCreate.isPending || wasteUpdate.isPending}>Save</Button>
            {wasteModal !== 'add' && wasteModal?.id != null && <Button color="red" variant="light" onClick={() => wasteDelete.mutate(wasteModal.id)} loading={wasteDelete.isPending}>Delete</Button>}
          </Group>
        </Stack>
      </Modal>

      <Modal opened={receiveOpen} onClose={() => setReceiveOpen(false)} title="Receive Stock" size="md">
        <Stack>
          <TextInput label="Supplier" value={receiveSupplier} onChange={(e) => setReceiveSupplier(e.target.value)} />
          <TextInput label="Invoice / Reference No." value={receiveRef} onChange={(e) => setReceiveRef(e.target.value)} />
          <NumberInput label="Quantity Received" value={receiveQty} onChange={(v) => setReceiveQty(Number(v) || 0)} min={0} required />
          <NumberInput label="Unit Cost" value={receiveCost} onChange={setReceiveCost} min={0} decimalScale={2} />
          <TextInput label="Received Date" type="date" value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} />
          <TextInput label="Expiry Date" type="date" value={receiveExpiry} onChange={(e) => setReceiveExpiry(e.target.value)} />
          <TextInput label="Storage Location" value={receiveLocation} onChange={(e) => setReceiveLocation(e.target.value)} />
          <TextInput label="Notes" value={receiveNotes} onChange={(e) => setReceiveNotes(e.target.value)} />
          <Checkbox label="Save & Add Another" checked={saveAndAddAnother} onChange={(e) => setSaveAndAddAnother(e.currentTarget.checked)} />
          <Group>
            <Button onClick={receiveStock} loading={batchCreate.isPending}>Save</Button>
            <Button variant="light" onClick={() => setReceiveOpen(false)}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={adjustOpen} onClose={() => setAdjustOpen(false)} title="Adjust Stock">
        <Stack>
          <Select label="Batch (optional)" data={batchOpts} value={adjustBatchId} onChange={setAdjustBatchId} clearable />
          <Select label="Adjustment Type" data={[{ value: 'Increase', label: 'Increase' }, { value: 'Decrease', label: 'Decrease' }]} value={adjustType} onChange={(v) => setAdjustType(v as 'Increase' | 'Decrease')} />
          <NumberInput label="Quantity" value={adjustQty} onChange={(v) => setAdjustQty(Number(v) || 0)} min={0} required />
          <TextInput label="Reason" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} />
          <TextInput label="Notes" value={adjustNotes} onChange={(e) => setAdjustNotes(e.target.value)} />
          <Button onClick={() => adjustmentMu.mutate()} loading={adjustmentMu.isPending}>Save</Button>
        </Stack>
      </Modal>

      <Drawer opened={batchDrawerId != null} onClose={() => setBatchDrawerId(null)} title="Batch Details" position="right" size="md">
        {batchDrawerId != null && (() => {
          const b = batches.find((x: { id: number }) => x.id === batchDrawerId) as { id: number; quantity?: number; remaining_quantity?: number; prepared_date?: string; expiry_date?: string; supplier?: string; unit_cost?: number; reference_no?: string; notes?: string } | undefined;
          if (!b) return <Text c="dimmed">Batch not found.</Text>;
          return (
            <Stack gap="md">
              <Details label="Batch ID" value={b.id} />
              <Details label="Received" value={b.prepared_date ? new Date(b.prepared_date).toLocaleDateString() : '—'} />
              <Details label="Expiry" value={b.expiry_date ? new Date(b.expiry_date).toLocaleDateString() : '—'} />
              <Details label="Original Qty" value={b.quantity} />
              <Details label="Remaining" value={b.remaining_quantity ?? b.quantity} />
              <Details label="Supplier" value={b.supplier} />
              <Details label="Unit Cost" value={b.unit_cost} />
              <Details label="Reference" value={b.reference_no} />
              <Details label="Notes" value={b.notes} />
              <Button variant="light" size="sm" onClick={() => { setBatchDrawerId(null); setWasteModal('add'); setWasteBatchId(String(b.id)); }}>Log Waste</Button>
            </Stack>
          );
        })()}
      </Drawer>
    </Stack>
  );
}
