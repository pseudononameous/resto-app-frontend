import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Group,
  Badge,
  Select,
  Text,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Paper,
  Tooltip,
} from '@mantine/core';
import { IconClock, IconTicket, IconChefHat, IconAlertTriangle } from '@tabler/icons-react';
import { PageHeader } from '@components/ui';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';

const RUSH_MINUTES = 15;
const statusOpts = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_preparation', label: 'In preparation' },
  { value: 'ready', label: 'Ready' },
  { value: 'served', label: 'Served' },
];

const statusColor: Record<string, string> = {
  pending: 'blue',
  in_preparation: 'orange',
  ready: 'green',
  served: 'gray',
};

type Ingredient = { id: number; product_id: number; quantity_per_serving: number; product?: { name: string } };
type OrderItem = { id: number; qty: number; amount?: number; menu_item?: { display_name: string; ingredients?: Ingredient[] } };
type Order = { id: number; bill_no?: string; date_time?: string; net_amount?: number; items?: OrderItem[] };
type Ticket = { id: number; ticket_number: string; status: string; order_id: number; order?: Order };

function TicketCard({ ticket, onStatusChange }: { ticket: Ticket; onStatusChange: (id: number, status: string) => void }) {
  const order = ticket.order;
  const orderTime = order?.date_time ? new Date(order.date_time) : null;
  const isRush = ticket.status === 'pending' && orderTime && (Date.now() - orderTime.getTime()) / 60000 > RUSH_MINUTES;
  const timeAgo = orderTime
    ? (() => {
      const m = Math.floor((Date.now() - orderTime.getTime()) / 60000);
      if (m < 1) return 'Just now';
      if (m < 60) return `${m}m ago`;
      return `${Math.floor(m / 60)}h ${m % 60}m ago`;
    })()
    : '—';

  return (
    <Card
      shadow="md"
      radius="lg"
      withBorder
      padding="lg"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: isRush ? 'var(--mantine-color-red-6)' : `var(--mantine-color-${statusColor[ticket.status] || 'gray'}-4)`,
        background: isRush ? 'var(--mantine-color-red-0)' : undefined,
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs">
            <ThemeIcon size="lg" variant="light" color={isRush ? 'red' : statusColor[ticket.status]}>
              <IconTicket size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">{ticket.ticket_number}</Text>
              <Text size="xs" c="dimmed">Bill #{order?.bill_no ?? ticket.order_id}</Text>
            </Box>
          </Group>
          <Group gap="xs">
            {isRush && (
              <Tooltip label="Waiting over 15 min">
                <Badge color="red" leftSection={<IconAlertTriangle size={12} />}>Rush</Badge>
              </Tooltip>
            )}
            <Badge size="lg" color={statusColor[ticket.status]} variant="light">{ticket.status.replace('_', ' ')}</Badge>
          </Group>
        </Group>

        <Group gap="xs" c="dimmed">
          <IconClock size={14} />
          <Text size="sm">{orderTime ? orderTime.toLocaleTimeString() : '—'}</Text>
          <Text size="xs">({timeAgo})</Text>
        </Group>

        <Divider />

        <Box>
          <Text size="xs" fw={600} c="dimmed" mb="xs">Items & ingredients</Text>
          <Stack gap="sm">
            {(order?.items ?? []).map((item: OrderItem) => {
              const name = item.menu_item?.display_name ?? `Item #${item.id}`;
              const ingredients = item.menu_item?.ingredients ?? [];
              const totalQty = item.qty;
              return (
                <Paper key={item.id} p="xs" radius="sm" withBorder>
                  <Text size="sm" fw={600}>×{totalQty} {name}</Text>
                  {ingredients.length > 0 && (
                    <Stack gap={4} mt="xs" pl="sm">
                      {ingredients.map((ing: Ingredient) => (
                        <Text key={ing.id} size="xs" c="dimmed">
                          • {ing.product?.name ?? `Product #${ing.product_id}`}: {(Number(ing.quantity_per_serving) * totalQty).toFixed(1)}
                        </Text>
                      ))}
                    </Stack>
                  )}
                </Paper>
              );
            })}
          </Stack>
        </Box>

        <Select
          label="Update status"
          size="sm"
          data={statusOpts}
          value={ticket.status}
          onChange={(v) => v && onStatusChange(ticket.id, v)}
        />
      </Stack>
    </Card>
  );
}

export default function KitchenTicketsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const listParams = statusFilter ? { status: statusFilter } : undefined;
  const { data: tickets = [] } = useQuery({
    queryKey: ['kitchen-tickets', statusFilter],
    queryFn: async () => (await crudApi.kitchenTickets.list(listParams)).data?.data ?? [],
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => crudApi.kitchenTickets.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['kitchen-tickets'] }); notifications.show({ message: 'Status updated', color: 'green' }); },
  });
  const list = Array.isArray(tickets) ? tickets : [];

  return (
    <Stack gap="xl">
      <PageHeader
        title="Kitchen tickets"
        subtitle="Track preparation. Tickets are created when orders are placed. Update status as you go."
      />
      <Group>
        <Select
          placeholder="Filter by status"
          clearable
          data={statusOpts}
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 180 }}
        />
        <Badge variant="outline" size="lg">{list.length} ticket{list.length !== 1 ? 's' : ''}</Badge>
      </Group>
      {list.length === 0 ? (
        <Paper p="xl" withBorder radius="lg">
          <Stack align="center" gap="sm">
            <ThemeIcon size={48} variant="light" color="gray">
              <IconChefHat size={28} />
            </ThemeIcon>
            <Text c="dimmed">No kitchen tickets. New tickets appear when orders are placed from the Kiosk.</Text>
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {list.map((t: Ticket) => (
            <TicketCard key={t.id} ticket={t} onStatusChange={(id, status) => updateStatus.mutate({ id, status })} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
