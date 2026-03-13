import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button, Title, Paper, Stack, Text, Group, SimpleGrid } from '@mantine/core';
import { useAuthStore } from '@stores/useAuthStore';
import { authApi } from '@services/api';
import { useApiHelp } from '@contexts/ApiHelpContext';

export default function DashboardPage() {
  const { setApiHelp } = useApiHelp();
  useEffect(() => { setApiHelp(null); return () => setApiHelp(null); }, [setApiHelp]);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <Paper p="xl" withBorder radius="lg" shadow="sm">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2}>Dashboard</Title>
          <Button variant="light" color="red" onClick={handleLogout}>Log out</Button>
        </Group>
        <Text size="sm" c="dimmed">Welcome, {user?.name ?? user?.email ?? 'User'}.</Text>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
          <Button component={Link} to="/dashboard/brands" variant="light" color="orange">Brands</Button>
          <Button component={Link} to="/dashboard/categories" variant="light" color="orange">Categories</Button>
          <Button component={Link} to="/dashboard/stores" variant="light" color="orange">Stores</Button>
          <Button component={Link} to="/dashboard/products" variant="light" color="orange">Products</Button>
          <Button component={Link} to="/dashboard/menu-categories" variant="light" color="orange">Menu Categories</Button>
          <Button component={Link} to="/dashboard/menu-items" variant="light" color="orange">Menu Items</Button>
          <Button component={Link} to="/dashboard/delivery-zones" variant="light" color="orange">Delivery Zones</Button>
          <Button component={Link} to="/dashboard/order-types" variant="light" color="orange">Order Types</Button>
          <Button component={Link} to="/dashboard/groups" variant="light" color="orange">Groups</Button>
          <Button component={Link} to="/dashboard/customers" variant="light" color="orange">Customers</Button>
          <Button component={Link} to="/dashboard/combo-meals" variant="light" color="orange">Combo Meals</Button>
          <Button component={Link} to="/dashboard/orders" variant="light" color="orange">Orders</Button>
          <Button component={Link} to="/dashboard/stock-movements" variant="light" color="orange">Stock Movements</Button>
          <Button component={Link} to="/dashboard/stock-batches" variant="light" color="orange">Stock Batches</Button>
          <Button component={Link} to="/dashboard/reservations" variant="light" color="orange">Reservations</Button>
          <Button component={Link} to="/dashboard/waste-logs" variant="light" color="orange">Waste Logs</Button>
          <Button component={Link} to="/dashboard/deliveries" variant="light" color="orange">Deliveries</Button>
          <Button component={Link} to="/dashboard/kiosk" variant="light" color="orange">Order Kiosk</Button>
          <Button component={Link} to="/dashboard/shop" variant="light" color="orange">Shop</Button>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
