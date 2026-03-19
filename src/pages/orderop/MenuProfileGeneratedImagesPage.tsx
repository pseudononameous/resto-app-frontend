import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudApi, orderOpUploadApi } from "@services/api";
import { ActionIcon, Box, Button, Card, FileInput, Group, Image, Loader, Modal, SimpleGrid, Stack, Text, Title, Badge, TextInput } from "@mantine/core";
import { IconTrash, IconUpload } from "@tabler/icons-react";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
      setIsCreateModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      await crudApi.generatedImages.delete(imageId);
    },
    onSuccess: () => {
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["generated-images", restaurantId] });
    },
    onError: () => {
      setDeletingId(null);
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
        <Group justify="space-between" align="center">
          <Text fw={600}>Images</Text>
          <Button
            variant="light"
            onClick={() => {
              setFile(null);
              setImageUrl("");
              setName("");
              setImageType("");
              setIsCreateModalOpen(true);
            }}
          >
            Add image
          </Button>
        </Group>
      </Card>

      <Modal
        opened={isCreateModalOpen}
        onClose={() => {
          if (uploadMutation.isPending || createMutation.isPending) return;
          setIsCreateModalOpen(false);
        }}
        title="Add image"
        centered
      >
        <Stack gap="md">
          <FileInput
            placeholder="Upload image"
            accept="image/*"
            value={file}
            onChange={setFile}
            leftSection={<IconUpload size={16} />}
          />

          <Group align="flex-end">
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

          <Group grow align="flex-end">
            <TextInput label="Name" placeholder="Interior hero image" value={name} onChange={(e) => setName(e.currentTarget.value)} />
            <TextInput label="Type" placeholder="dish / interior / branding" value={imageType} onChange={(e) => setImageType(e.currentTarget.value)} />
          </Group>

          <Group justify="flex-end">
            <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving..." : "Save image"}
            </Button>
          </Group>
        </Stack>
      </Modal>

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
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {data.map((row) => (
              <Card key={row.id} withBorder radius="md" p="sm">
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Text size="xs" c="dimmed">
                    #{row.id}
                  </Text>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    radius="md"
                    aria-label="Delete image"
                    loading={deletingId === row.id}
                    disabled={deleteMutation.isPending}
                    onClick={() => {
                      const ok = window.confirm("Delete this image? This will also remove the stored file.");
                      if (!ok) return;
                      setDeletingId(row.id);
                      deleteMutation.mutate(row.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>

                <Box
                  style={{
                    height: 160,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "var(--mantine-color-gray-1)",
                    border: "1px solid var(--mantine-color-gray-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {row.image_url ? (
                    <Image src={row.image_url} alt={row.name ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Text size="sm" c="dimmed">
                      No preview
                    </Text>
                  )}
                </Box>

                <Stack mt="sm" gap={6}>
                  <Text fw={600} lineClamp={2}>
                    {row.name || "-"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {row.image_type || "-"}
                  </Text>

                  <Text size="xs">
                    {row.width && row.height ? `${row.width}×${row.height}` : "-"}
                    {row.file_size ? ` • ${(row.file_size / 1024).toFixed(1)} KB` : ""}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {row.format || "-"} • {row.created_at ? new Date(row.created_at).toLocaleString() : "-"}
                  </Text>

                  {(row.tags ?? []).length > 0 ? (
                    <Group gap={6}>
                      {(row.tags ?? []).map((tag) => (
                        <Badge key={tag} size="xs" variant="light">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  ) : null}
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Card>
    </Box>
  );
}

