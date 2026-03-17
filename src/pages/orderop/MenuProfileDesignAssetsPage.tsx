import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudApi, orderOpUploadApi } from "@services/api";
import { Box, Card, Group, Loader, Table, Text, Title, Badge, FileInput, Button, TextInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

type DesignAsset = {
  id: number;
  menu_id: number | null;
  restaurant_id: number | null;
  logo_url: string | null;
  color_1: string | null;
  color_2: string | null;
  color_3: string | null;
  theme: string | null;
  font_family: string | null;
  notes: string | null;
  created_at: string;
};

type Restaurant = {
  id: number;
  name: string;
  website_url: string | null;
  restaurant_name?: string | null;
  cuisine_type?: string | null;
  location?: string | null;
};

export default function MenuProfileDesignAssetsPage() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [color3, setColor3] = useState("");
  const [theme, setTheme] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [notes, setNotes] = useState("");

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      const res = await crudApi.restaurants.get(restaurantId);
      return res.data?.data as Restaurant;
    },
    enabled: Number.isFinite(restaurantId),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["design-assets", restaurantId],
    queryFn: async () => {
      const res = await crudApi.designAssets.list({ restaurant_id: restaurantId, per_page: 100 });
      return (res.data?.data ?? []) as DesignAsset[];
    },
    enabled: Number.isFinite(restaurantId),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) return null;
      const fd = new FormData();
      fd.append("file", file);
      const res = await orderOpUploadApi.uploadImage(fd);
      return res.data.data.url;
    },
    onSuccess: (url) => {
      if (url) {
        setLogoUrl(url);
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await crudApi.designAssets.create({
        restaurant_id: restaurantId,
        logo_url: logoUrl || null,
        color_1: color1 || null,
        color_2: color2 || null,
        color_3: color3 || null,
        theme: theme || null,
        font_family: fontFamily || null,
        notes: notes || null,
      });
    },
    onSuccess: () => {
      setFile(null);
      setLogoUrl("");
      setColor1("");
      setColor2("");
      setColor3("");
      setTheme("");
      setFontFamily("");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["design-assets", restaurantId] });
    },
  });

  return (
    <Box>
      <Title order={3} mb="xs">
        Design assets for {restaurant?.restaurant_name || restaurant?.name || `restaurant #${restaurantId}`}
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Logos, color palettes, and typography captured or generated for this restaurant.
      </Text>

      {restaurant && (
        <Card withBorder radius="md" mb="md">
          <Group justify="space-between" align="flex-start">
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
        </Card>
      )}

      <Card withBorder radius="md" mb="md">
        <Text fw={600} mb="xs">
          Create design asset
        </Text>
        <Group align="flex-end" mb="sm">
          <FileInput
            placeholder="Upload logo image"
            accept="image/*"
            value={file}
            onChange={setFile}
            leftSection={<IconUpload size={16} />}
          />
          <Button
            variant="light"
            leftSection={<IconUpload size={16} />}
            onClick={() => uploadMutation.mutate()}
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload logo"}
          </Button>
          <TextInput
            label="Logo URL"
            placeholder="https://..."
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>
        <Group align="flex-end" mb="sm">
          <TextInput label="Color 1" placeholder="#00FF00" value={color1} onChange={(e) => setColor1(e.currentTarget.value)} />
          <TextInput label="Color 2" placeholder="#FFFF00" value={color2} onChange={(e) => setColor2(e.currentTarget.value)} />
          <TextInput label="Color 3" placeholder="#000000" value={color3} onChange={(e) => setColor3(e.currentTarget.value)} />
          <TextInput label="Theme" placeholder="light/dark" value={theme} onChange={(e) => setTheme(e.currentTarget.value)} />
          <TextInput label="Font family" placeholder="Inter, Poppins" value={fontFamily} onChange={(e) => setFontFamily(e.currentTarget.value)} />
        </Group>
        <TextInput
          label="Notes"
          placeholder="Branding notes..."
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />
        <Group justify="flex-end" mt="sm">
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving..." : "Save design asset"}
          </Button>
        </Group>
      </Card>

      <Card withBorder radius="md">
        {isLoading || !data ? (
          <Group justify="center" py="lg">
            <Loader />
          </Group>
        ) : data.length === 0 ? (
          <Text size="sm" c="dimmed">
            No design assets yet for this restaurant.
          </Text>
        ) : (
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Logo</Table.Th>
                <Table.Th>Colors</Table.Th>
                <Table.Th>Theme</Table.Th>
                <Table.Th>Font</Table.Th>
                <Table.Th>Notes</Table.Th>
                <Table.Th>Created</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>
                    {row.logo_url ? (
                      <Text size="xs" lineClamp={2}>
                        {row.logo_url}
                      </Text>
                    ) : (
                      <Text size="xs" c="dimmed">
                        -
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {row.color_1 && <Badge size="xs">{row.color_1}</Badge>}
                      {row.color_2 && <Badge size="xs">{row.color_2}</Badge>}
                      {row.color_3 && <Badge size="xs">{row.color_3}</Badge>}
                    </Group>
                  </Table.Td>
                  <Table.Td>{row.theme || "-"}</Table.Td>
                  <Table.Td>{row.font_family || "-"}</Table.Td>
                  <Table.Td>
                    <Text size="xs" lineClamp={3}>
                      {row.notes || "-"}
                    </Text>
                  </Table.Td>
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

