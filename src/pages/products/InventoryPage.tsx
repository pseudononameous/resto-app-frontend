import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, Table, Button, Group, Text, Loader, Box, FileInput, Badge } from '@mantine/core';
import { LibBadge } from '@components/ui/LibBadge';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { crudApi } from '@services/api';
import { useStoreId } from '@contexts/StoreContext';
import { notifications } from '@mantine/notifications';

type Product = { id: number; name: string; sku?: string; price?: number; qty?: number; availability?: boolean; category?: { name: string }; store_id?: number };
type Batch = { id: number; product_id: number; quantity?: number; remaining_quantity?: number };
type Waste = { id: number; product_id: number; quantity?: number };

function downloadCsv(rows: string[][], filename: string) {
  const BOM = '\uFEFF';
  const csv = BOM + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function InventoryPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const storeId = useStoreId();
  const listParams = storeId ? { store_id: storeId, per_page: 0 } : { per_page: 0 };
  const batchParams = storeId ? { store_id: storeId } : undefined;
  const [importFile, setImportFile] = useState<File | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'inventory', storeId],
    queryFn: async () => (await crudApi.products.list(listParams)).data?.data ?? [],
  });
  const { data: batches = [] } = useQuery({
    queryKey: ['stock-batches', 'all', storeId],
    queryFn: async () => (await crudApi.stockBatches.list(batchParams)).data?.data ?? [],
  });
  const { data: wastes = [] } = useQuery({
    queryKey: ['waste-logs', 'all', storeId],
    queryFn: async () => (await crudApi.wasteLogs.list(batchParams)).data?.data ?? [],
  });

  const list = Array.isArray(products) ? products : [];
  const batchList = Array.isArray(batches) ? batches : [];
  const wasteList = Array.isArray(wastes) ? wastes : [];

  const stockWasteByProduct = useMemo(() => {
    const map: Record<number, { stock: number; batches: number; wasteQty: number; wasteCount: number }> = {};
    batchList.forEach((b: Batch) => {
      if (!map[b.product_id]) map[b.product_id] = { stock: 0, batches: 0, wasteQty: 0, wasteCount: 0 };
      map[b.product_id].stock += b.remaining_quantity ?? b.quantity ?? 0;
      map[b.product_id].batches += 1;
    });
    wasteList.forEach((w: Waste) => {
      if (!map[w.product_id]) map[w.product_id] = { stock: 0, batches: 0, wasteQty: 0, wasteCount: 0 };
      map[w.product_id].wasteQty += w.quantity ?? 0;
      map[w.product_id].wasteCount += 1;
    });
    return map;
  }, [batchList, wasteList]);

  const importMu = useMutation({
    mutationFn: async () => {
      if (!importFile) throw new Error('No file');
      const form = new FormData();
      form.append('file', importFile);
      if (storeId != null) form.append('store_id', String(storeId));
      return crudApi.products.import(form);
    },
    onSuccess: (res) => {
      const d = res.data?.data as { created?: number; errors?: { row: number; message: string }[] } | undefined;
      qc.invalidateQueries({ queryKey: ['products'] });
      setImportFile(null);
      notifications.show({ message: `Imported ${d?.created ?? 0} product(s).`, color: (d?.errors?.length ?? 0) > 0 ? 'yellow' : 'green' });
    },
    onError: () => { notifications.show({ message: 'Import failed', color: 'red' }); },
  });

  const handleExport = () => {
    const header = ['id', 'name', 'sku', 'price', 'qty', 'stock', 'batches', 'waste_qty', 'category', 'availability'];
    const rows = [header, ...list.map((p) => {
      const sw = stockWasteByProduct[p.id];
      return [p.id, p.name ?? '', p.sku ?? '', p.price ?? '', p.qty ?? '', sw?.stock ?? '', sw?.batches ?? '', sw?.wasteQty ?? '', p.category?.name ?? '', p.availability ? '1' : '0'];
    })];
    downloadCsv(rows, `inventory-${new Date().toISOString().slice(0, 10)}.csv`);
    notifications.show({ message: 'Export started', color: 'green' });
  };

  const lowThreshold = 10;

  return (
    <Paper p="xl" radius="md" shadow="sm">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Inventory</Title>
        <Group>
          <Button leftSection={<IconDownload size={16} />} variant="light" onClick={handleExport}>Export</Button>
          <FileInput placeholder="Import CSV" accept=".csv,.txt" value={importFile} onChange={(f) => setImportFile(f ?? null)} leftSection={<IconUpload size={16} />} style={{ width: 200 }} />
          <Button leftSection={<IconUpload size={16} />} onClick={() => importMu.mutate()} loading={importMu.isPending} disabled={!importFile}>Import</Button>
        </Group>
      </Group>

      {isLoading ? (
        <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}><Loader size="md" type="dots" /></Box>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>Batches</Table.Th>
              <Table.Th>Waste</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Availability</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {list.map((row) => {
              const sw = stockWasteByProduct[row.id];
              const stock = sw?.stock ?? row.qty ?? 0;
              const isLow = stock <= lowThreshold;
              return (
                <Table.Tr key={row.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/products/${row.id}`)}>
                  <Table.Td fw={500}>{row.name}</Table.Td>
                  <Table.Td>{row.sku ?? '—'}</Table.Td>
                  <Table.Td><LibBadge value={row.category?.name} /></Table.Td>
                  <Table.Td>{row.price != null ? Number(row.price).toFixed(2) : '—'}</Table.Td>
                  <Table.Td>{stock}</Table.Td>
                  <Table.Td>{sw?.batches ?? 0}</Table.Td>
                  <Table.Td>{sw?.wasteQty ? `${sw.wasteQty} (${sw.wasteCount})` : '—'}</Table.Td>
                  <Table.Td>{isLow ? <Badge size="sm" color="red">Low stock</Badge> : stock === 0 ? <Badge size="sm" color="gray">Out</Badge> : <Badge size="sm" color="green">OK</Badge>}</Table.Td>
                  <Table.Td><Badge size="sm" variant="light" color={row.availability ? 'green' : 'gray'}>{row.availability ? 'Yes' : 'No'}</Badge></Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
      {list.length === 0 && !isLoading && (
        <Text c="dimmed" ta="center" py="xl">No products. Use Import or add via Products.</Text>
      )}
    </Paper>
  );
}
