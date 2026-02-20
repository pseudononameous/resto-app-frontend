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
    <Paper p="xl" m="xl" radius="md" shadow="sm">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2}>Dashboard</Title>
          <Button variant="light" color="red" onClick={handleLogout}>Log out</Button>
        </Group>
        <Text size="sm" c="dimmed">Welcome, {user?.name ?? user?.email ?? 'User'}.</Text>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
          <Button component={Link} to="/dashboard/brands" variant="light">Brands</Button>
          <Button component={Link} to="/dashboard/categories" variant="light">Categories</Button>
          <Button component={Link} to="/dashboard/stores" variant="light">Stores</Button>
          <Button component={Link} to="/dashboard/products" variant="light">Products</Button>
          <Button component={Link} to="/dashboard/menu-categories" variant="light">Menu Categories</Button>
          <Button component={Link} to="/dashboard/menu-items" variant="light">Menu Items</Button>
          <Button component={Link} to="/dashboard/delivery-zones" variant="light">Delivery Zones</Button>
          <Button component={Link} to="/dashboard/order-types" variant="light">Order Types</Button>
          <Button component={Link} to="/dashboard/groups" variant="light">Groups</Button>
          <Button component={Link} to="/dashboard/customers" variant="light">Customers</Button>
          <Button component={Link} to="/dashboard/combo-meals" variant="light">Combo Meals</Button>
          <Button component={Link} to="/dashboard/orders" variant="light">Orders</Button>
          <Button component={Link} to="/dashboard/stock-movements" variant="light">Stock Movements</Button>
          <Button component={Link} to="/dashboard/stock-batches" variant="light">Stock Batches</Button>
          <Button component={Link} to="/dashboard/reservations" variant="light">Reservations</Button>
          <Button component={Link} to="/dashboard/waste-logs" variant="light">Waste Logs</Button>
          <Button component={Link} to="/dashboard/deliveries" variant="light">Deliveries</Button>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
}
