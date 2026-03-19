import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudApi, orderOpUploadApi } from "@services/api";
import {
  Box,
  Button,
  Card,
  FileInput,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconPhoto, IconTrash, IconUpload } from "@tabler/icons-react";

type MenuProfile = {
  id: number;
  restaurant_id: number | null;
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

export default function MenuProfileMenuItemDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { restaurantId, menuProfileId } = useParams<{ restaurantId: string; menuProfileId: string }>();

  const restoId = restaurantId ? Number(restaurantId) : NaN;
  const itemId = menuProfileId ? Number(menuProfileId) : NaN;

  const [imageLinkOpened, setImageLinkOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: item, isLoading } = useQuery({
    queryKey: ["menu-profile", itemId],
    queryFn: async () => {
      const res = await crudApi.menuProfiles.get(itemId);
      return res.data?.data as MenuProfile;
    },
    enabled: Number.isFinite(itemId),
  });

  const initialForm = useMemo(() => {
    const v = item;
    return {
      name: v?.name ?? "",
      description: v?.description ?? "",
      category: v?.category ?? "",
      protein_type: v?.protein_type ?? "",
      price: v?.price != null ? String(v.price) : "",
      ingredients: v?.ingredients ?? "",
    };
  }, [item]);

  const [form, setForm] = useState(initialForm);
  const [hasHydratedForm, setHasHydratedForm] = useState(false);

  useEffect(() => {
    if (!item) return;
    if (hasHydratedForm) return;
    setForm(initialForm);
    setHasHydratedForm(true);
  }, [item, initialForm, hasHydratedForm]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<MenuProfile>) => {
      await crudApi.menuProfiles.update(itemId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-profile", itemId] });
      queryClient.invalidateQueries({ queryKey: ["menu-profile-menu", restoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await crudApi.menuProfiles.delete(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-profile-menu", restoId] });
      navigate(`/dashboard/orderop-manual-ai/menu/${restoId}`);
    },
  });

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      await crudApi.menuProfiles.generateImage(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-profile", itemId] });
      queryClient.invalidateQueries({ queryKey: ["menu-profile-menu", restoId] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile) return null;
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await orderOpUploadApi.uploadImage(fd);
      return res.data.data.url as string;
    },
    onSuccess: (url) => {
      if (!url) return;
      updateMutation.mutate({ menu_item_image: url });
      setUploadFile(null);
    },
  });

  if (isLoading || !item) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  const banner = item.menu_item_image ?? null;
  const hasUnsavedChanges =
    form.name !== (item.name ?? "") ||
    form.description !== (item.description ?? "") ||
    form.category !== (item.category ?? "") ||
    form.protein_type !== (item.protein_type ?? "") ||
    form.price !== (item.price != null ? String(item.price) : "") ||
    form.ingredients !== (item.ingredients ?? "");

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Button variant="subtle" leftSection={<IconArrowLeft size={18} />} onClick={() => navigate(`/dashboard/orderop-manual-ai/menu/${restoId}`)}>
          Back to menu list
        </Button>

        <Button
          color="red"
          variant="light"
          leftSection={<IconTrash size={16} />}
          loading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
        >
          Delete
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {/* Left column: banner + item info */}
        <Stack gap="lg">
          {/* Banner image (same width as item info) */}
          <Paper withBorder radius="md" p={0} style={{ overflow: "hidden" }}>
            {banner ? (
              <Image src={banner} alt={item.name ?? ""} h={220} fit="cover" />
            ) : (
              <Box
                h={220}
                style={{
                  background: "var(--mantine-color-gray-1)",
                  borderBottom: "1px solid var(--mantine-color-gray-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Stack gap={6} align="center">
                  <IconPhoto size={28} style={{ opacity: 0.6 }} />
                  <Text size="sm" c="dimmed">
                    No image yet
                  </Text>
                </Stack>
              </Box>
            )}

            <Box p="md">
              <Title order={3}>{item.name || `Menu item #${item.id}`}</Title>
              <Text size="sm" c="dimmed">
                {item.restaurant_name || "-"} • {item.category || "-"} {item.protein_type ? `• ${item.protein_type}` : ""}
              </Text>
            </Box>
          </Paper>

          {/* Item info (editable) */}
          <Card withBorder radius="md">
            <Group justify="space-between" mb="sm">
              <Title order={4}>Item info</Title>
              <Button
                size="xs"
                onClick={() => {
                  const price = form.price.trim() ? Number(form.price.trim()) : null;
                  updateMutation.mutate({
                    name: form.name.trim() || null,
                    description: form.description.trim() || null,
                    category: form.category.trim() || null,
                    protein_type: form.protein_type.trim() || null,
                    price: price != null && Number.isFinite(price) ? price : null,
                    ingredients: form.ingredients.trim() || null,
                  });
                }}
                loading={updateMutation.isPending}
                disabled={!hasUnsavedChanges}
              >
                Save
              </Button>
            </Group>

            <Stack gap="sm">
              <TextInput
                label="Name"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.currentTarget.value }))}
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.currentTarget.value }))}
                autosize
                minRows={4}
              />
              <Group grow>
                <TextInput
                  label="Category"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.currentTarget.value }))}
                />
                <TextInput
                  label="Protein type"
                  value={form.protein_type}
                  onChange={(e) => setForm((p) => ({ ...p, protein_type: e.currentTarget.value }))}
                />
              </Group>
              <TextInput
                label="Price"
                placeholder="12.50"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.currentTarget.value }))}
              />
              <Textarea
                label="Ingredients"
                description="Pipe-delimited is supported (e.g. tomato|cheese|basil)"
                value={form.ingredients}
                onChange={(e) => setForm((p) => ({ ...p, ingredients: e.currentTarget.value }))}
                autosize
                minRows={3}
              />
            </Stack>
          </Card>
        </Stack>

        {/* Imagery */}
        <Card withBorder radius="md">
          <Group justify="space-between" mb="sm">
            <Title order={4}>Imagery</Title>
            <Button
              size="xs"
              variant="light"
              loading={generateImageMutation.isPending}
              onClick={() => generateImageMutation.mutate()}
            >
              Generate with AI
            </Button>
          </Group>

          <Stack gap="sm">
            {/* Current image preview row */}
            <Paper withBorder radius="md" p="sm">
              <Group justify="space-between" align="flex-start">
                <Group gap="sm" wrap="nowrap">
                  {banner ? (
                    <Image src={banner} alt={item.name ?? ""} w={88} h={64} radius="sm" fit="cover" />
                  ) : (
                    <Box
                      w={88}
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
                      <IconPhoto size={18} style={{ opacity: 0.55 }} />
                    </Box>
                  )}
                  <Box>
                    <Text fw={600} size="sm">
                      {banner ? "Current image" : "No image yet"}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {banner || "Add a link or upload an image"}
                    </Text>
                  </Box>
                </Group>
                <Button
                  size="xs"
                  variant="default"
                  onClick={() => {
                    setImageUrl(item.menu_item_image ?? "");
                    setImageLinkOpened(true);
                  }}
                >
                  Add / Edit link
                </Button>
              </Group>
            </Paper>

            <Paper withBorder radius="md" p="sm">
              <Text fw={600} size="sm" mb="xs">
                Upload image
              </Text>
              <Group align="flex-end">
                <FileInput
                  placeholder="Select image"
                  accept="image/*"
                  value={uploadFile}
                  onChange={setUploadFile}
                  leftSection={<IconUpload size={16} />}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="light"
                  leftSection={<IconUpload size={16} />}
                  onClick={() => uploadMutation.mutate()}
                  disabled={!uploadFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </Group>
            </Paper>
          </Stack>
        </Card>
      </SimpleGrid>

      <Modal
        opened={imageLinkOpened}
        onClose={() => {
          if (updateMutation.isPending) return;
          setImageLinkOpened(false);
        }}
        title="Image link"
        centered
      >
        <Stack gap="sm">
          <TextInput
            label="Image URL"
            placeholder="http://orderop.com/api/v1/media/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.currentTarget.value)}
          />
          {imageUrl.trim() ? <Image src={imageUrl.trim()} alt="Preview" radius="sm" h={220} fit="contain" /> : null}
          <Group justify="space-between">
            <Button
              variant="default"
              onClick={() => updateMutation.mutate({ menu_item_image: null })}
              disabled={updateMutation.isPending}
            >
              Clear
            </Button>
            <Button
              onClick={() => updateMutation.mutate({ menu_item_image: imageUrl.trim() ? imageUrl.trim() : null })}
              loading={updateMutation.isPending}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

