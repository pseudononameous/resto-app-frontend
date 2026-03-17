import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderOpPublicApi } from "@services/api";
import { Box, Button, Card, Group, Image, Loader, Modal, Paper, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from "@mantine/core";
import { IconArrowLeft, IconPhoto, IconTrash } from "@tabler/icons-react";

const isProbablyDomain = (value: string) => {
  const v = value.trim();
  if (!v) return false;
  if (/\s/.test(v)) return false;
  return v.includes(".");
};

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
  raw_payload?: Record<string, any> | null;
};

type Restaurant = {
  id: number;
  name: string;
  website_url: string | null;
  restaurant_name?: string | null;
  cuisine_type?: string | null;
  location?: string | null;
};

export default function OrderOpPublicMenuItemDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { restaurantId, menuProfileId } = useParams<{ restaurantId: string; menuProfileId: string }>();

  const rid = restaurantId ? Number(restaurantId) : NaN;
  const itemId = menuProfileId ? Number(menuProfileId) : NaN;

  const [imageLinkOpened, setImageLinkOpened] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { data: item, isLoading } = useQuery({
    queryKey: ["public-menu-profile", itemId],
    queryFn: async () => (await orderOpPublicApi.getMenuProfile(itemId)).data?.data as MenuProfile,
    enabled: Number.isFinite(itemId),
  });

  const { data: restaurant } = useQuery({
    queryKey: ["public-restaurant", rid],
    queryFn: async () => (await orderOpPublicApi.getRestaurant(rid)).data?.data as Restaurant,
    enabled: Number.isFinite(rid),
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
      await orderOpPublicApi.updateMenuProfile(itemId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-menu-profile", itemId] });
      queryClient.invalidateQueries({ queryKey: ["public-menu-profiles", rid] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await orderOpPublicApi.deleteMenuProfile(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-menu-profiles", rid] });
      navigate(`/orderop/menu/${rid}`);
    },
  });

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      await orderOpPublicApi.generateMenuProfileImage(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-menu-profile", itemId] });
      queryClient.invalidateQueries({ queryKey: ["public-menu-profiles", rid] });
    },
  });

  if (isLoading || !item) {
    return (
      <Group justify="center" py="xl">
        <Loader />
      </Group>
    );
  }

  const rawName =
    item.raw_payload?.name ??
    item.raw_payload?.["menu name"] ??
    item.raw_payload?.["\ufeffname"];
  const displayName =
    (item.name && isProbablyDomain(item.name) && typeof rawName === "string" && rawName.trim()
      ? rawName.trim()
      : item.name) ||
    (typeof rawName === "string" ? rawName.trim() : "") ||
    `Menu item #${item.id}`;

  const banner = item.menu_item_image ?? null;
  const hasUnsavedChanges =
    form.name !== (item.name ?? "") ||
    form.description !== (item.description ?? "") ||
    form.category !== (item.category ?? "") ||
    form.protein_type !== (item.protein_type ?? "") ||
    form.price !== (item.price != null ? String(item.price) : "") ||
    form.ingredients !== (item.ingredients ?? "");

  return (
    <Box p="md">
      <Group justify="space-between" mb="md">
        <Button variant="subtle" leftSection={<IconArrowLeft size={18} />} onClick={() => navigate(`/orderop/menu/${rid}`)}>
          Back to menu
        </Button>
        <Button color="red" variant="light" leftSection={<IconTrash size={16} />} loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
          Delete
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Stack gap="lg">
          <Paper withBorder radius="md" p={0} style={{ overflow: "hidden" }}>
            {banner ? (
              <Image src={banner} alt={displayName} h={220} fit="cover" />
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
              <Title order={3}>{displayName}</Title>
              <Text size="sm" c="dimmed">
                {item.restaurant_name || "-"} • {item.category || "-"} {item.protein_type ? `• ${item.protein_type}` : ""}
              </Text>
            </Box>
          </Paper>

          <Card withBorder radius="md">
            <Group justify="space-between" mb="sm">
              <Title order={4}>Imagery</Title>
              <Button size="xs" variant="light" loading={generateImageMutation.isPending} onClick={() => generateImageMutation.mutate()}>
                Generate with AI
              </Button>
            </Group>

            <Group justify="space-between" align="center" wrap="wrap">
              <Button
                variant="default"
                onClick={() => {
                  setImageUrl(item.menu_item_image ?? "");
                  setImageLinkOpened(true);
                }}
              >
                Add / Edit image link
              </Button>
              <Button variant="default" onClick={() => updateMutation.mutate({ menu_item_image: null })} disabled={updateMutation.isPending}>
                Clear image
              </Button>
            </Group>
          </Card>

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
              <TextInput label="Name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.currentTarget.value }))} />
              <Textarea label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.currentTarget.value }))} autosize minRows={4} />
              <Group grow>
                <TextInput label="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.currentTarget.value }))} />
                <TextInput label="Protein type" value={form.protein_type} onChange={(e) => setForm((p) => ({ ...p, protein_type: e.currentTarget.value }))} />
              </Group>
              <TextInput label="Price" placeholder="12.50" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.currentTarget.value }))} />
              <Textarea label="Ingredients" value={form.ingredients} onChange={(e) => setForm((p) => ({ ...p, ingredients: e.currentTarget.value }))} autosize minRows={3} />
            </Stack>
          </Card>
        </Stack>

        <Card withBorder radius="md">
          <Title order={4} mb="xs">
            Restaurant Name
          </Title>
          {restaurant ? (
            <Stack gap="xs">
              <Text fw={600}>{restaurant.restaurant_name || restaurant.name}</Text>
              {restaurant.website_url && (
                <Text size="xs" c="dimmed">
                  {restaurant.website_url}
                </Text>
              )}
              <Text size="xs" c="dimmed">
                {restaurant.cuisine_type || "-"}
              </Text>
              <Text size="xs" c="dimmed">
                {restaurant.location || "-"}
              </Text>
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">
              Loading restaurant…
            </Text>
          )}
        </Card>
      </SimpleGrid>

      <Modal opened={imageLinkOpened} onClose={() => setImageLinkOpened(false)} title="Image link" centered>
        <Stack gap="sm">
          <TextInput label="Image URL" placeholder="http://..." value={imageUrl} onChange={(e) => setImageUrl(e.currentTarget.value)} />
          {imageUrl.trim() ? <Image src={imageUrl.trim()} alt="Preview" radius="sm" h={220} fit="contain" /> : null}
          <Group justify="space-between">
            <Button variant="default" onClick={() => updateMutation.mutate({ menu_item_image: null })} disabled={updateMutation.isPending}>
              Clear
            </Button>
            <Button onClick={() => updateMutation.mutate({ menu_item_image: imageUrl.trim() ? imageUrl.trim() : null })} loading={updateMutation.isPending}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

