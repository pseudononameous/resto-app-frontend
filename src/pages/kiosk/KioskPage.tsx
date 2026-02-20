import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  Title,
  SimpleGrid,
  ActionIcon,
  Divider,
  ThemeIcon,
  RingProgress,
} from '@mantine/core';
import { IconShoppingCart, IconTrash, IconReceipt, IconPlus, IconMug } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { useStoreId } from '@contexts/StoreContext';

type MenuItem = { id: number; display_name: string; base_price?: number; image_path?: string | null; is_available?: boolean };
type CartItem = { id: number; menu_item_id: number; quantity: number; total_price?: number; menu_item?: MenuItem };
type Cart = { id: number; cart_code: string; total?: number; status: string; items?: CartItem[] };

const KIOSK_CART_KEY = 'kiosk_cart_id';

export default function KioskPage() {
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderTypeId, setOrderTypeId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState<{ bill_no: string; order_id: number } | null>(null);

  const listParams = storeId != null ? { store_id: storeId } : undefined;

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menu-items', storeId],
    queryFn: async () => (await crudApi.menuItems.list(listParams)).data?.data ?? [],
  });

  const { data: activeCarts = [] } = useQuery({
    queryKey: ['carts', storeId, 'active'],
    queryFn: async () => (await crudApi.carts.list({ ...listParams, status: 'active' })).data?.data ?? [],
  });

  const createCart = useMutation({
    mutationFn: () =>
      crudApi.carts.create({
        cart_code: 'KIOSK-' + Date.now(),
        status: 'active',
        total: 0,
        store_id: storeId ?? undefined,
      }),
    onSuccess: (res) => {
      const cart = res.data?.data as Cart;
      if (cart?.id) {
        sessionStorage.setItem(KIOSK_CART_KEY, String(cart.id));
        setCartIdInvalid(false);
        qc.invalidateQueries({ queryKey: ['carts'] });
      }
    },
  });

  const [cartIdInvalid, setCartIdInvalid] = useState(false);
  const cartId =
    typeof window !== 'undefined' && !cartIdInvalid
      ? Number(sessionStorage.getItem(KIOSK_CART_KEY)) || (activeCarts as Cart[])[0]?.id
      : (activeCarts as Cart[])[0]?.id;
  const needCart = !cartId && activeCarts.length === 0 && !createCart.isPending;

  const clearStoredCart = () => {
    sessionStorage.removeItem(KIOSK_CART_KEY);
    setCartIdInvalid(true);
    qc.invalidateQueries({ queryKey: ['carts'] });
  };

  const { data: cart, isLoading: cartLoading, isError: cartError } = useQuery({
    queryKey: ['cart', cartId],
    queryFn: async () => (await crudApi.carts.get(cartId)).data?.data as Cart,
    enabled: !!cartId,
    retry: false,
    onError: clearStoredCart,
    onSuccess: () => setCartIdInvalid(false),
  });

  if (needCart && !createCart.isSuccess) {
    createCart.mutate();
  }
  if (cartId && !sessionStorage.getItem(KIOSK_CART_KEY)) {
    sessionStorage.setItem(KIOSK_CART_KEY, String(cartId));
  }

  const addToCart = useMutation({
    mutationFn: ({ menu_item_id, quantity }: { menu_item_id: number; quantity: number }) =>
      crudApi.carts.addItem(cartId, { menu_item_id, quantity }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart', cartId] });
      notifications.show({ message: 'Added to cart', color: 'green' });
    },
    onError: () => {
      clearStoredCart();
      notifications.show({ message: 'Cart expired. Please try again.', color: 'yellow' });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (itemId: number) => crudApi.carts.removeItem(cartId, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart', cartId] }),
    onError: () => { clearStoredCart(); notifications.show({ message: 'Cart expired.', color: 'yellow' }); },
  });

  const checkout = useMutation({
    mutationFn: () =>
      crudApi.checkout({
        cart_id: cartId,
        order_type_id: Number(orderTypeId),
        customer_id: customerId ? Number(customerId) : undefined,
        store_id: storeId ?? undefined,
        address_id: addressId ? Number(addressId) : undefined,
        zone_id: zoneId ? Number(zoneId) : undefined,
      }),
    onSuccess: (res) => {
      const order = (res.data?.data as { order?: { id: number; bill_no: string } })?.order;
      if (order) {
        setOrderPlaced({ bill_no: order.bill_no, order_id: order.id });
        sessionStorage.removeItem(KIOSK_CART_KEY);
        qc.invalidateQueries({ queryKey: ['carts'] });
        setCheckoutOpen(false);
        notifications.show({ message: 'Order placed!', color: 'green' });
      }
    },
    onError: () => {
      notifications.show({ message: 'Checkout failed. Cart may have expired.', color: 'red' });
      clearStoredCart();
    },
  });

  const { data: orderTypes = [] } = useQuery({
    queryKey: ['order-types'],
    queryFn: async () => (await crudApi.orderTypes.list()).data?.data ?? [],
  });
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => (await crudApi.customers.list()).data?.data ?? [],
  });
  const { data: zones = [] } = useQuery({
    queryKey: ['delivery-zones'],
    queryFn: async () => (await crudApi.deliveryZones.list()).data?.data ?? [],
  });

  const items = (cart?.items ?? []) as CartItem[];
  const total = Number(cart?.total ?? 0);
  const menu = (Array.isArray(menuItems) ? menuItems : []).filter((m: MenuItem) => m.is_available !== false);
  const itemCount = items.reduce((sum, l) => sum + l.quantity, 0);

  const typeOpts = (orderTypes as { id: number; type_name: string }[]).map((t) => ({ value: String(t.id), label: t.type_name }));
  const custOpts = (customers as { id: number; customer_code?: string; name?: string }[]).map((c) => ({ value: String(c.id), label: c.customer_code || c.name || `#${c.id}` }));
  const zoneOpts = (zones as { id: number; name?: string }[]).map((z) => ({ value: String(z.id), label: z.name || `Zone ${z.id}` }));

  if (orderPlaced) {
    return (
      <Box
        p="xl"
        maw={480}
        mx="auto"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          p="xl"
          radius="xl"
          shadow="lg"
          style={{
            textAlign: 'center',
            background: 'linear-gradient(145deg, #fff9f0 0%, #fff 50%)',
            border: '1px solid var(--mantine-color-orange-2)',
          }}
        >
          <ThemeIcon size={80} radius="xl" variant="gradient" gradient={{ from: 'orange.4', to: 'orange.7' }} mb="lg">
            <IconReceipt size={44} stroke={1.5} />
          </ThemeIcon>
          <Title order={1} size="h2" fw={700} c="dark.7" mb="xs">
            Thank you!
          </Title>
          <Text size="lg" c="dimmed" mb="md">
            Your order has been placed.
          </Text>
          <Paper p="md" radius="md" withBorder mb="xl" style={{ background: 'var(--mantine-color-orange-0)' }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Order number</Text>
            <Text size="xl" fw={800} c="orange.8" style={{ letterSpacing: 2 }}>{orderPlaced.bill_no}</Text>
          </Paper>
          <Button
            size="lg"
            radius="xl"
            variant="gradient"
            gradient={{ from: 'orange.5', to: 'orange.7' }}
            onClick={() => setOrderPlaced(null)}
          >
            Start new order
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fef8f3 0%, #f5f5f5 30%)',
      }}
    >
      {/* Header */}
      <Paper
        p="md"
        radius={0}
        style={{
          background: 'linear-gradient(90deg, #2d2d2d 0%, #1a1a1a 100%)',
          borderBottom: '3px solid var(--mantine-color-orange-5)',
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm">
            <ThemeIcon size="lg" radius="md" variant="white" color="orange">
              <IconMug size={22} />
            </ThemeIcon>
            <div>
              <Text size="xl" fw={700} c="white">Order Here</Text>
              <Text size="xs" c="gray.4">Select items and checkout</Text>
            </div>
          </Group>
          {cart?.cart_code && (
            <Text size="xs" c="gray.4" style={{ fontFamily: 'monospace' }}>{cart.cart_code}</Text>
          )}
        </Group>
      </Paper>

      <Grid gutter="lg" p="md" maw={1600} mx="auto">
        {/* Menu */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Text size="sm" c="dimmed" fw={600} tt="uppercase" mb="sm">Menu</Text>
          <ScrollArea h="calc(100vh - 180px)" type="auto" offsetScrollbars>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 3, lg: 4 }} spacing="lg">
              {menu.map((m: MenuItem) => (
                <Card
                  key={m.id}
                  shadow="sm"
                  padding={0}
                  radius="xl"
                  withBorder
                  style={{
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer',
                  }}
                  className="kiosk-menu-card"
                  onClick={() => addToCart.mutate({ menu_item_id: m.id, quantity: 1 })}
                >
                  <Box
                    h={120}
                    style={{
                      background: m.image_path
                        ? `url(${m.image_path}) center/cover`
                        : 'linear-gradient(135deg, var(--mantine-color-orange-1) 0%, var(--mantine-color-orange-2) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {!m.image_path && <IconMug size={40} color="var(--mantine-color-orange-5)" style={{ opacity: 0.8 }} />}
                  </Box>
                  <Box p="sm">
                    <Text fw={600} size="sm" lineClamp={2} c="dark.7">{m.display_name}</Text>
                    <Group justify="space-between" mt="xs">
                      <Text size="md" fw={700} c="orange.7">₱{Number(m.base_price ?? 0).toFixed(2)}</Text>
                      <Button
                        size="xs"
                        radius="xl"
                        color="orange"
                        variant="filled"
                        leftSection={<IconPlus size={14} />}
                        onClick={(e) => { e.stopPropagation(); addToCart.mutate({ menu_item_id: m.id, quantity: 1 }); }}
                        disabled={addToCart.isPending}
                      >
                        Add
                      </Button>
                    </Group>
                  </Box>
                </Card>
              ))}
            </SimpleGrid>
          </ScrollArea>
        </Grid.Col>

        {/* Cart */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper
            p="lg"
            radius="xl"
            shadow="md"
            h="calc(100vh - 180px)"
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              border: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Group justify="space-between" mb="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="md" color="orange">
                  <IconShoppingCart size={18} />
                </ThemeIcon>
                <Title order={4} fw={700}>Your order</Title>
              </Group>
              {itemCount > 0 && (
                <RingProgress size={40} thickness={4} roundCaps sections={[{ value: 100, color: 'orange' }]} label={<Text size="xs" fw={700}>{itemCount}</Text>} />
              )}
            </Group>

            <ScrollArea flex={1} type="auto" viewportProps={{ style: { marginBottom: 8 } }}>
              {cartLoading ? (
                <Text c="dimmed" size="sm">Loading cart...</Text>
              ) : items.length === 0 ? (
                <Box py="xl" style={{ textAlign: 'center' }}>
                  <ThemeIcon size={48} radius="md" color="gray.2" variant="light">
                    <IconShoppingCart size={24} />
                  </ThemeIcon>
                  <Text c="dimmed" size="sm" mt="sm">Your cart is empty</Text>
                  <Text c="dimmed" size="xs">Tap items on the menu to add them</Text>
                </Box>
              ) : (
                <Stack gap="xs">
                  {items.map((line) => (
                    <Paper key={line.id} p="xs" radius="md" withBorder style={{ background: 'var(--mantine-color-gray-0)' }}>
                      <Group justify="space-between" wrap="nowrap" gap="xs">
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Text size="sm" fw={600} truncate>{line.menu_item?.display_name ?? `Item #${line.menu_item_id}`}</Text>
                          <Text size="xs" c="dimmed">×{line.quantity} · ₱{Number(line.total_price ?? 0).toFixed(2)}</Text>
                        </Box>
                        <ActionIcon color="red" variant="light" size="sm" onClick={() => removeFromCart.mutate(line.id)}>
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              )}
            </ScrollArea>

            <Divider my="sm" />
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Subtotal</Text>
                <Text fw={700} size="lg">₱{total.toFixed(2)}</Text>
              </Group>
              <Button
                size="lg"
                radius="xl"
                fullWidth
                disabled={items.length === 0}
                variant="gradient"
                gradient={{ from: 'orange.5', to: 'orange.7' }}
                leftSection={<IconShoppingCart size={20} />}
                onClick={() => setCheckoutOpen(true)}
              >
                Proceed to checkout
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Modal
        opened={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={
          <Group gap="xs">
            <ThemeIcon size="sm" color="orange"><IconReceipt size={16} /></ThemeIcon>
            <span>Checkout</span>
          </Group>
        }
        size="sm"
        radius="lg"
      >
        <Stack gap="md">
          <Select label="Order type" data={typeOpts} value={orderTypeId} onChange={setOrderTypeId} required placeholder="Dine-in, pickup, or delivery" />
          <Select label="Customer (optional)" data={custOpts} value={customerId} onChange={setCustomerId} clearable />
          {orderTypeId && typeOpts.find((o) => o.value === orderTypeId)?.label?.toLowerCase() === 'delivery' && (
            <Select label="Delivery zone" data={zoneOpts} value={zoneId} onChange={setZoneId} clearable />
          )}
          <Button
            size="md"
            radius="xl"
            fullWidth
            variant="gradient"
            gradient={{ from: 'orange.5', to: 'orange.7' }}
            onClick={() => checkout.mutate()}
            loading={checkout.isPending}
            disabled={!orderTypeId}
          >
            Place order · ₱{total.toFixed(2)}
          </Button>
        </Stack>
      </Modal>

      <style>{`
        .kiosk-menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
        }
      `}</style>
    </Box>
  );
}
