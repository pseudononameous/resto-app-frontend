import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { authApi, usersApi } from '@services/api';
import { useAuthStore } from '@stores/useAuthStore';

export default function AccountSettingsTab() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [email] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
  }, [user?.name]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await usersApi.update(user.id, { name: name.trim() || user.name });
      notifications.show({ message: 'Profile updated', color: 'green' });
    } catch (e) {
      console.error(e);
      notifications.show({ message: 'Failed to update profile', color: 'red' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notifications.show({ message: 'Fill in all password fields', color: 'red' });
      return;
    }
    setSavingPassword(true);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      notifications.show({ message: 'Password updated', color: 'green' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.error(e);
      notifications.show({ message: 'Failed to update password', color: 'red' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
      <Paper p="lg" withBorder radius="md">
        <Stack gap="md">
          <Title order={4}>Profile</Title>
          <Text size="sm" c="dimmed">
            Update your basic account information.
          </Text>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextInput label="Email" value={email} disabled />
          {user?.email_verified_at && (
            <Group gap="xs">
              <Badge color="green" size="sm" variant="light">
                Verified email
              </Badge>
              <Text size="xs" c="dimmed">
                {user.email_verified_at}
              </Text>
            </Group>
          )}
          <Group justify="flex-end" mt="sm">
            <Button onClick={handleSaveProfile} loading={savingProfile} radius="md">
              Save profile
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Paper p="lg" withBorder radius="md">
        <Stack gap="md">
          <Title order={4}>Change password</Title>
          <Text size="sm" c="dimmed">
            Use a strong password that you do not reuse on other sites.
          </Text>
          <PasswordInput
            label="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <PasswordInput
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Group justify="flex-end" mt="sm">
            <Button color="orange" onClick={handleChangePassword} loading={savingPassword} radius="md">
              Update password
            </Button>
          </Group>
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}

