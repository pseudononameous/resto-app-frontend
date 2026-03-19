import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudApi } from "@services/api";
import { Anchor, Box, Button, Card, FileInput, Group, Image, Loader, Stack, Table, Text, Title } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

type MenuItemRow = {
  id: number;
  restaurant_name: string | null;
  name: string | null;
  description: string | null;
  category: string | null;
  protein_type: string | null;
  price: number | null;
  ingredients: string | null;
  menu_item_image?: string | null;
  created_at: string;
};

type Restaurant = {
  id: number;
  name: string;
  website_url: string | null;
  restaurant_name?: string | null;
  cuisine_type?: string | null;
  location?: string | null;
  brand_style?: string | null;
  price_range?: string | null;
  service_style?: string | null;
  plating_style?: string | null;
  common_ingredients?: string[] | null;
  common_proteins?: string[] | null;
  menu_categories?: string[] | null;
  signature_dishes?: string[] | null;
  known_allergens_or_dietary_styles?: string[] | null;
  source_urls?: string[] | null;
};

export default function MenuProfileMenuListPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      const res = await crudApi.restaurants.get(restaurantId);
      return res.data?.data as Restaurant;
    },
    enabled: Number.isFinite(restaurantId),
  });

  const { data: rows, isLoading } = useQuery({
    queryKey: ["menu-profile-menu", restaurantId],
    queryFn: async () => {
      const res = await crudApi.menuProfiles.list({ restaurant_id: restaurantId, per_page: 300 });
      return (res.data?.data ?? []) as MenuItemRow[];
    },
    enabled: Number.isFinite(restaurantId),
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const fd = new FormData();
      fd.append("file", file);
      await crudApi.menuProfiles.importByRestaurant(restaurantId, fd);
    },
    onSuccess: () => {
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ["menu-profile-menu", restaurantId] });
    },
  });

  return (
    <Box>
      <Title order={3} mb="xs">
        Menu items for {restaurant?.restaurant_name || restaurant?.name || `Restaurant #${restaurantId}`}
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Import CSV for this restaurant and view each menu item as one row.
      </Text>

      {restaurant && (
        <Card withBorder radius="md" mb="md">
          <Group justify="space-between" align="flex-start" mb="xs">
            <Box>
              <Text fw={600}>{restaurant.restaurant_name || restaurant.name}</Text>
              {restaurant.website_url && (
                <Text size="xs" c="dimmed">
                  {restaurant.website_url}
                </Text>
              )}
            </Box>
            <Box ta="right">
              <Text size="xs" c="dimmed">
                {restaurant.cuisine_type || '-'}
              </Text>
              <Text size="xs" c="dimmed">
                {restaurant.location || '-'}
              </Text>
            </Box>
          </Group>
          <Group align="flex-start" gap="lg">
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Brand style
              </Text>
              <Text size="xs" c="dimmed">
                {restaurant.brand_style || '-'}
              </Text>
            </Box>
            <Box>
              <Text size="xs" fw={500}>
                Price / Service
              </Text>
              <Text size="xs" c="dimmed">
                {restaurant.price_range || '-'}
              </Text>
              <Text size="xs" c="dimmed">
                {restaurant.service_style || '-'}
              </Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Plating style
              </Text>
              <Text size="xs" c="dimmed">
                {restaurant.plating_style || '-'}
              </Text>
            </Box>
          </Group>
          <Group align="flex-start" gap="lg" mt="sm">
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Common ingredients
              </Text>
              <Text size="xs" c="dimmed">
                {(restaurant.common_ingredients ?? []).join(', ') || '-'}
              </Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Common proteins
              </Text>
              <Text size="xs" c="dimmed">
                {(restaurant.common_proteins ?? []).join(', ') || '-'}
              </Text>
            </Box>
          </Group>
          <Group align="flex-start" gap="lg" mt="sm">
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Menu categories
              </Text>
              <Text size="xs" c="dimmed">
                {(restaurant.menu_categories ?? []).join(', ') || '-'}
              </Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Signature dishes
              </Text>
              <Text size="xs" c="dimmed">
                {(restaurant.signature_dishes ?? []).join(', ') || '-'}
              </Text>
            </Box>
          </Group>
          <Group align="flex-start" gap="lg" mt="sm">
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Allergens / dietary styles
              </Text>
              <Text size="xs" c="dimmed">
                {(restaurant.known_allergens_or_dietary_styles ?? []).join(', ') || '-'}
              </Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={500}>
                Source URLs
              </Text>
              <Text size="xs" c="dimmed">
                {(restaurant.source_urls ?? []).join(', ') || '-'}
              </Text>
            </Box>
          </Group>
        </Card>
      )}

      <Card withBorder radius="md" mb="md">
        <Group align="flex-end">
          <FileInput placeholder="Select CSV file" accept=".csv,text/csv" value={file} onChange={setFile} leftSection={<IconUpload size={16} />} />
          <Button leftSection={importMutation.isPending ? <Loader size={16} color="white" /> : <IconUpload size={16} />} onClick={() => importMutation.mutate()} disabled={!file || importMutation.isPending}>
            {importMutation.isPending ? "Importing..." : "Import CSV in this restaurant"}
          </Button>
        </Group>
      </Card>

      <Card withBorder radius="md">
        {isLoading || !rows ? (
          <Group justify="center" py="lg">
            <Loader />
          </Group>
        ) : rows.length === 0 ? (
          <Text size="sm" c="dimmed">
            No menu rows found for this restaurant.
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
                <Table.Th>Ingredients</Table.Th>
                <Table.Th>Created</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    {row.menu_item_image ? (
                      <Image src={row.menu_item_image} alt={row.name ?? ""} w={72} h={72} radius="sm" fit="cover" />
                    ) : (
                      <Stack gap={6} align="center">
                        <Box
                          w={72}
                          h={72}
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
                      onClick={() => navigate(`/dashboard/orderop-manual-ai/menu/${restaurantId}/item/${row.id}`)}
                    >
                      {row.name || `Menu item #${row.id}`}
                    </Anchor>
                  </Table.Td>
                  <Table.Td><Text size="sm" lineClamp={3}>{row.description || "-"}</Text></Table.Td>
                  <Table.Td>{row.category || "-"}</Table.Td>
                  <Table.Td>{row.protein_type || "-"}</Table.Td>
                  <Table.Td>{row.price != null ? Number(row.price).toFixed(2) : "-"}</Table.Td>
                  <Table.Td><Text size="sm" lineClamp={3}>{row.ingredients || "-"}</Text></Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {row.created_at ? new Date(row.created_at).toLocaleString() : "-"}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Box>
  );
}

