import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudApi } from "@services/api";
import { Anchor, Box, Button, Card, Group, Loader, Stack, Table, Text, TextInput, Title } from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type Restaurant = {
  id: number;
  name: string;
  website_url: string | null;
  cuisine_type: string | null;
  location: string | null;
  created_at: string;
};

export default function OrderOpManualAiPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [location, setLocation] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = await crudApi.restaurants.list({ per_page: 100 });
      return (res.data?.data ?? []) as Restaurant[];
    },
  });

  const createRestaurantMutation = useMutation({
    mutationFn: async () => {
      await crudApi.restaurants.create({
        name,
        website_url: websiteUrl || null,
        cuisine_type: cuisineType || null,
        location: location || null,
      });
    },
    onSuccess: () => {
      setName("");
      setWebsiteUrl("");
      setCuisineType("");
      setLocation("");
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>OrderOP Manual AI</Title>
          <Text c="dimmed" size="sm">
            Add restaurants, then open each restaurant to import CSV menu items and manage design assets/images.
          </Text>
        </div>
      </Group>

      <Card withBorder radius="md" mb="xl">
        <Stack>
          <Text fw={600}>Add restaurant</Text>
          <Group align="flex-end">
            <TextInput label="Restaurant name" placeholder="Subway" required value={name} onChange={(e) => setName(e.currentTarget.value)} />
            <TextInput label="Website URL" placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.currentTarget.value)} />
            <TextInput label="Cuisine" placeholder="Fast Food" value={cuisineType} onChange={(e) => setCuisineType(e.currentTarget.value)} />
            <TextInput label="Location" placeholder="Philippines" value={location} onChange={(e) => setLocation(e.currentTarget.value)} />
            <Button leftSection={createRestaurantMutation.isPending ? <Loader size={16} color="white" /> : <IconPlus size={16} />} onClick={() => createRestaurantMutation.mutate()} disabled={!name.trim() || createRestaurantMutation.isPending}>
              {createRestaurantMutation.isPending ? "Adding..." : "Add Restaurant"}
            </Button>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md">
        <Group justify="space-between" mb="sm">
          <Text fw={600}>Restaurants</Text>
          <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />} onClick={() => queryClient.invalidateQueries({ queryKey: ["restaurants"] })}>
            Refresh
          </Button>
        </Group>

        {isLoading || isFetching ? (
          <Group justify="center" py="lg"><Loader /></Group>
        ) : !data || data.length === 0 ? (
          <Text size="sm" c="dimmed">No restaurants found yet. Add one to get started.</Text>
        ) : (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Restaurant</Table.Th>
                <Table.Th>Website</Table.Th>
                <Table.Th>Cuisine</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>{row.name || <Text c="dimmed">Untitled</Text>}</Table.Td>
                  <Table.Td>{row.website_url || "-"}</Table.Td>
                  <Table.Td>{row.cuisine_type || "-"}</Table.Td>
                  <Table.Td>{row.location || "-"}</Table.Td>
                  <Table.Td><Text size="xs" c="dimmed">{row.created_at ? new Date(row.created_at).toLocaleString() : "-"}</Text></Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <Anchor size="xs" onClick={() => navigate(`/dashboard/orderop-manual-ai/menu/${row.id}`)}>Open / Import menu</Anchor>
                      <Anchor size="xs" onClick={() => navigate(`/dashboard/orderop-manual-ai/design-assets/${row.id}`)}>Design assets</Anchor>
                      <Anchor size="xs" onClick={() => navigate(`/dashboard/orderop-manual-ai/generated-images/${row.id}`)}>Images</Anchor>
                    </Group>
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

