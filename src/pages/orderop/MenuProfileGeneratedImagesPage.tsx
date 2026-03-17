import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudApi, orderOpUploadApi } from "@services/api";
import { Box, Card, Group, Image, Loader, Table, Text, Title, Badge, FileInput, Button, TextInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

type GeneratedImage = {
  id: number;
  resto_id: number | null;
  name: string | null;
  image_url: string | null;
  image_type: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  format: string | null;
  tags: string[] | null;
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

export default function MenuProfileGeneratedImagesPage() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [imageType, setImageType] = useState("");

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      const res = await crudApi.restaurants.get(restaurantId);
      return res.data?.data as Restaurant;
    },
    enabled: Number.isFinite(restaurantId),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["generated-images", restaurantId],
    queryFn: async () => {
      const res = await crudApi.generatedImages.list({ restaurant_id: restaurantId, per_page: 100 });
      return (res.data?.data ?? []) as GeneratedImage[];
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
        setImageUrl(url);
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await crudApi.generatedImages.create({
        resto_id: restaurantId,
        name: name || null,
        image_url: imageUrl || null,
        image_type: imageType || null,
      });
    },
    onSuccess: () => {
      setFile(null);
      setImageUrl("");
      setName("");
      setImageType("");
      queryClient.invalidateQueries({ queryKey: ["generated-images", restaurantId] });
    },
  });

  return (
    <Box>
      <Title order={3} mb="xs">
        Generated images for {restaurant?.restaurant_name || restaurant?.name || `restaurant #${restaurantId}`}
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        AI-generated dish, interior, or branding images linked to this restaurant.
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
          Add image
        </Text>
        <Group align="flex-end" mb="sm">
          <FileInput
            placeholder="Upload image"
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
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
          <TextInput
            label="Image URL"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>
        <Group align="flex-end">
          <TextInput
            label="Name"
            placeholder="Interior hero image"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <TextInput
            label="Type"
            placeholder="dish / interior / branding"
            value={imageType}
            onChange={(e) => setImageType(e.currentTarget.value)}
          />
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving..." : "Save image"}
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
            No generated images yet for this restaurant.
          </Text>
        ) : (
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Preview</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Format</Table.Th>
                <Table.Th>Tags</Table.Th>
                <Table.Th>Created</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>{row.id}</Table.Td>
                  <Table.Td>
                    {row.image_url ? (
                      <Image src={row.image_url} alt={row.name ?? ""} w={80} radius="sm" />
                    ) : (
                      <Text size="xs" c="dimmed">
                        -
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" lineClamp={2}>
                      {row.name || "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>{row.image_type || "-"}</Table.Td>
                  <Table.Td>
                    <Text size="xs">
                      {row.width && row.height ? `${row.width}×${row.height}` : "-"}
                      {row.file_size ? ` • ${(row.file_size / 1024).toFixed(1)} KB` : ""}
                    </Text>
                  </Table.Td>
                  <Table.Td>{row.format || "-"}</Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      {(row.tags ?? []).map((tag) => (
                        <Badge key={tag} size="xs" variant="light">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
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

