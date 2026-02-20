import { Stack, Paper, Title, Text, Box } from "@mantine/core";
import { useStoreId } from "@contexts/StoreContext";
import ProductsPage from "./ProductsPage";
import StockBatchesPage from "./StockBatchesPage";
import StockMovementsPage from "./StockMovementsPage";
import WasteLogsPage from "./WasteLogsPage";
import MenuItemsPage from "./MenuItemsPage";
import OrdersPage from "./OrdersPage";
import CustomersPage from "./CustomersPage";
import DeliveriesPage from "./DeliveriesPage";
import ReservationsPage from "./ReservationsPage";

const SECTIONS = [
  { key: "products", Component: ProductsPage },
  { key: "stock-batches", Component: StockBatchesPage },
  { key: "stock-movements", Component: StockMovementsPage },
  { key: "waste-logs", Component: WasteLogsPage },
  { key: "menu-items", Component: MenuItemsPage },
  { key: "orders", Component: OrdersPage },
  { key: "customers", Component: CustomersPage },
  { key: "deliveries", Component: DeliveriesPage },
  { key: "reservations", Component: ReservationsPage },
];

export default function ModulesPage() {
  const storeId = useStoreId();

  return (
    <Stack gap="xl">
      <Paper p="lg" radius="lg" withBorder style={{ borderColor: "var(--mantine-color-orange-2)", background: "linear-gradient(135deg, var(--mantine-color-white) 0%, var(--mantine-color-orange-0) 100%)" }}>
        <Title order={2} fw={700} c="dark.7" mb={4}>Modules</Title>
        <Text size="sm" c="dimmed" maw={560}>
          All store-scoped data in one view. Use the <strong>Location</strong> filter in the sidebar to show products, menu items, orders, and more for a specific store.
        </Text>
        {storeId != null && (
          <Text size="xs" c="orange.7" fw={500} mt="sm">Filtering by selected location</Text>
        )}
      </Paper>

      <Stack gap="xl">
        {SECTIONS.map(({ key, Component }) => (
          <Box key={key}>
            <Component />
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
