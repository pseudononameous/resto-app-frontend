import { useNavigate } from 'react-router-dom';
import { Button, Title, Paper, Stack, Text } from '@mantine/core';
import { useAuthStore } from '@stores/useAuthStore';
import { authApi } from '@services/api';

export default function DashboardPage() {
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
        <Title order={2}>Dashboard</Title>
        <Text size="sm" c="dimmed">
          Welcome, {user?.name ?? user?.email ?? 'User'}.
        </Text>
        <Button variant="light" color="red" onClick={handleLogout}>
          Log out
        </Button>
      </Stack>
    </Paper>
  );
}
