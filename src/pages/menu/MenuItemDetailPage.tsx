import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Title, Paper, Stack, Group, Text, Table, Button, Badge, Box, Loader } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { crudApi } from '@services/api';

type Ingredient = { id: number; product_id: number; quantity_per_serving: number; product?: { id: number; name: string } };
type MenuItemDetail = {
  id: number;
  display_name: string;
  base_price?: number;
  image_path?: string | null;
  is_available?: boolean;
  menu_category?: { name: string };
  ingredients?: Ingredient[];
};

export default function MenuItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const menuId = id ? parseInt(id, 10) : NaN;

  const { data: item, isLoading } = useQuery({
    queryKey: ['menu-item', menuId],
    queryFn: async () => (await crudApi.menuItems.get(menuId)).data?.data as MenuItemDetail,
    enabled: Number.isInteger(menuId),
  });

  if (isLoading || !item) {
    return (
      <Box py="xl" style={{ display: 'flex', justifyContent: 'center' }}>
        <Loader size="md" type="dots" />
      </Box>
    );
  }

  const ingredients = item.ingredients ?? [];

  return (
    <Stack gap="xl" p="xs">
      <Button variant="subtle" leftSection={<IconArrowLeft size={18} />} onClick={() => navigate(-1)} style={{ alignSelf: 'flex-start' }} radius="md">
        Back
      </Button>
      <Paper p="lg" radius="lg" withBorder>
        <Stack gap="md">
          <Group wrap="nowrap" align="flex-start">
            {item.image_path && (
              <Box w={120} h={120} style={{ borderRadius: 8, overflow: 'hidden', background: 'var(--mantine-color-gray-1)' }}>
                <img src={item.image_path} alt={item.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            )}
            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={3}>{item.display_name}</Title>
              <Group gap="xs">
                <Text size="sm" c="dimmed">{item.menu_category?.name ?? '—'}</Text>
                {item.base_price != null && <Text fw={600}>₱{Number(item.base_price).toFixed(2)}</Text>}
                {item.is_available !== false ? <Badge color="green">Available</Badge> : <Badge color="gray">Unavailable</Badge>}
              </Group>
            </Stack>
          </Group>
          <div>
            <Title order={4} mb="sm">Ingredients / Products</Title>
            <Text size="sm" c="dimmed" mb="sm">These products are deducted from inventory when this menu item is ordered.</Text>
            {ingredients.length === 0 ? (
              <Text c="dimmed">No ingredients linked. Add products in the menu item edit form.</Text>
            ) : (
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Qty per serving</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {ingredients.map((ing: Ingredient) => (
                    <Table.Tr key={ing.id}>
                      <Table.Td>{ing.product?.name ?? `Product #${ing.product_id}`}</Table.Td>
                      <Table.Td>{Number(ing.quantity_per_serving)}</Table.Td>
                      <Table.Td>
                        <Button variant="subtle" size="xs" onClick={() => navigate(`/dashboard/products/${ing.product_id}`)}>View product / inventory</Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>
        </Stack>
      </Paper>
    </Stack>
  );
}
