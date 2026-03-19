import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { orderOpPublicApi } from "@services/api";
import { Anchor, Box, Card, Group, Image, Loader, Stack, Table, Text, Title } from "@mantine/core";

type MenuItemRow = {
  id: number;
  name: string | null;
  description: string | null;
  category: string | null;
  protein_type: string | null;
  price: number | null;
  ingredients: string | null;
  menu_item_image?: string | null;
  created_at: string;
};

export default function OrderOpPublicMenuListPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const rid = restaurantId ? Number(restaurantId) : NaN;

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ["public-restaurant", rid],
    queryFn: async () => (await orderOpPublicApi.getRestaurant(rid)).data?.data as Record<string, any>,
    enabled: Number.isFinite(rid),
  });

  const { data: rows, isLoading } = useQuery({
    queryKey: ["public-menu-profiles", rid],
    queryFn: async () => {
      const res = await orderOpPublicApi.listMenuProfilesByRestaurant(rid, { per_page: 300 });
      return (res.data?.data ?? []) as MenuItemRow[];
    },
    enabled: Number.isFinite(rid),
  });

  const title = restaurant?.restaurant_name || restaurant?.name || (Number.isFinite(rid) ? `Restaurant #${rid}` : "Restaurant");

  return (
    <Box p="md">
      <Title order={3} mb="xs">
        Menu items for {title}
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Live menu preview (public).
      </Text>

      <Card withBorder radius="md">
        {isLoading || isLoadingRestaurant || !rows ? (
          <Group justify="center" py="lg">
            <Loader />
          </Group>
        ) : rows.length === 0 ? (
          <Text size="sm" c="dimmed">
            No menu rows found yet.
          </Text>
        ) : (
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Image</Table.Th>
                <Table.Th>Menu item</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Protein</Table.Th>
                <Table.Th>Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    {row.menu_item_image ? (
                      <Image src={row.menu_item_image} alt={row.name ?? ""} w={64} h={64} radius="sm" fit="cover" />
                    ) : (
                      <Stack gap={6} align="center">
                        <Box
                          w={64}
                          h={64}
                          style={{
                            borderRadius: 8,
                            background: "var(--mantine-color-gray-1)",
                            border: "1px solid var(--mantine-color-gray-3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            No image
                          </Text>
                        </Box>
                      </Stack>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Anchor
                      size="sm"
                      fw={600}
                      onClick={() => navigate(`/orderop/menu/${rid}/item/${row.id}`)}
                    >
                      {row.name || `Menu item #${row.id}`}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2}>
                      {row.description || "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>{row.category || "-"}</Table.Td>
                  <Table.Td>{row.protein_type || "-"}</Table.Td>
                  <Table.Td>{row.price != null ? Number(row.price).toFixed(2) : "-"}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Box>
  );
}

