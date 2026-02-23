import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Title, Stack, Group, Text, Table, Button, Breadcrumbs, Loader, Box, Anchor, Badge } from '@mantine/core';
import { IconArrowLeft, IconCategory } from '@tabler/icons-react';
import { LibBadge } from '@components/ui/LibBadge';
import { crudApi } from '@services/api';
import { useStoreId } from '@contexts/StoreContext';

type Category = { id: number; name: string; products_count?: number };
type Product = {
  id: number;
  name: string;
  sku?: string;
  price?: number;
  qty?: number;
  category?: { name: string };
  availability?: boolean;
};

export default function CollectionsPage() {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const navigate = useNavigate();
  const storeId = useStoreId();

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['categories', 'with_count'],
    queryFn: async () =>
      (await crudApi.categories.list({ with_product_count: true })).data?.data ?? [],
  });

  const { data: categoryProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'category', categoryId, storeId],
    queryFn: async () => {
      const params: Record<string, unknown> = { per_page: 0 };
      if (categoryId) params.category_id = categoryId;
      if (storeId) params.store_id = storeId;
      const res = await crudApi.products.list(params);
      return (res.data?.data ?? []) as Product[];
    },
    enabled: !!categoryId,
  });

  const catList = Array.isArray(categories) ? categories : [];
  const selectedCategory = categoryId ? catList.find((c: Category) => String(c.id) === categoryId) : null;
  const productList = Array.isArray(categoryProducts) ? categoryProducts : [];

  if (catLoading && !categoryId) {
    return (
      <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
        <Loader size="md" type="dots" />
      </Box>
    );
  }

  return (
    <Stack gap="md">
      {categoryId ? (
        <Group gap="xs">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate('/dashboard/products/collections')}
          >
            Back
          </Button>
          <Breadcrumbs>
            <Anchor size="sm" onClick={() => navigate('/dashboard/products/collections')}>
              Collections
            </Anchor>
            <Text size="sm" c="dimmed">
              {selectedCategory?.name ?? categoryId}
            </Text>
          </Breadcrumbs>
        </Group>
      ) : null}

      <Paper p="md" radius="md" shadow="sm" withBorder>
        <Title order={4} mb="md">
          {categoryId ? (
            <Group gap="xs">
              <IconCategory size={20} />
              {selectedCategory?.name ?? 'Category'} — {productList.length} product(s)
            </Group>
          ) : (
            'Collections'
          )}
        </Title>

        {!categoryId ? (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Category</Table.Th>
                <Table.Th>Products</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {catList.map((cat: Category) => (
                <Table.Tr
                  key={cat.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/dashboard/products/collections/${cat.id}`)}
                >
                  <Table.Td><LibBadge value={cat.name} /></Table.Td>
                  <Table.Td><Badge size="sm" variant="light">{cat.products_count ?? 0}</Badge></Table.Td>
                  <Table.Td>
                    <Button variant="light" size="xs" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/products/collections/${cat.id}`); }}>
                      View
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <>
            {productsLoading ? (
              <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader size="sm" type="dots" />
              </Box>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Qty</Table.Th>
                    <Table.Th>Availability</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {productList.map((p: Product) => (
                    <Table.Tr
                      key={p.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/dashboard/products/${p.id}`)}
                    >
                      <Table.Td fw={500}>{p.name}</Table.Td>
                      <Table.Td>{p.sku ?? '—'}</Table.Td>
                      <Table.Td><LibBadge value={p.category?.name} /></Table.Td>
                      <Table.Td>{p.price != null ? Number(p.price).toFixed(2) : '—'}</Table.Td>
                      <Table.Td>{p.qty ?? 0}</Table.Td>
                      <Table.Td><Badge size="sm" variant="light" color={p.availability ? 'green' : 'gray'}>{p.availability ? 'Yes' : 'No'}</Badge></Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
            {productList.length === 0 && !productsLoading && (
              <Text c="dimmed" py="lg" ta="center">
                No products in this category.
              </Text>
            )}
          </>
        )}

        {!categoryId && catList.length === 0 && (
          <Text c="dimmed" py="lg" ta="center">
            No categories. Add categories in Libraries.
          </Text>
        )}
      </Paper>
    </Stack>
  );
}
