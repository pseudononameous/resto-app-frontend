import { Link, useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Paper,
  Title,
  Text,
  Center,
  Anchor,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@services/api';
import { registerSchema, type RegisterFields } from '@lib/schemas/auth';
import { useAuthStore } from '@stores/useAuthStore';
import { isAxiosError } from 'axios';
import axios from '@utils/axios';
import type { User } from '@stores/useAuthStore';

export default function RegisterPage() {
  const { setUser, setToken } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFields) => {
      const res = await authApi.register(data);
      return res.data;
    },
    onSuccess: (data: { data?: { token?: string; user?: User } }) => {
      const token = data?.data?.token;
      const userData = data?.data?.user;
      if (token) {
        setToken(token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      if (userData) setUser(userData);
      navigate('/dashboard');
    },
  });

  return (
    <Center h="100vh" bg="gray.0">
      <Paper w={400} p="xl" radius="md" shadow="sm">
        <Title order={2} ta="center" mb="lg">
          Create account
        </Title>
        <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
          <Stack gap="md">
            <TextInput
              {...register('name')}
              label="Name"
              placeholder="Your name"
              error={errors.name?.message}
              required
            />
            <TextInput
              {...register('email')}
              label="Email"
              placeholder="your@email.com"
              error={errors.email?.message}
              required
            />
            <PasswordInput
              {...register('password')}
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
            />
            <PasswordInput
              {...register('password_confirmation')}
              label="Confirm password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              required
            />
            {registerMutation.isError && isAxiosError(registerMutation.error) && (
              <Text size="sm" c="red">
                {(registerMutation.error.response?.data as { message?: string })?.message ?? 'Registration failed'}
              </Text>
            )}
            <Button type="submit" loading={registerMutation.isPending} fullWidth>
              Register
            </Button>
            <Text size="sm" ta="center">
              Already have an account?{' '}
              <Anchor component={Link} to="/login">Log in</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
