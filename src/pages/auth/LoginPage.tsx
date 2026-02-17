import { Link, useNavigate } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Paper,
  Title,
  Center,
  Text,
  Anchor,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@services/api';
import { loginSchema, type LoginFields } from '@lib/schemas/auth';
import { useAuthStore, type User } from '@stores/useAuthStore';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import axios from '@utils/axios';

export default function LoginPage() {
  const { setUser, setToken, user } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFields) => {
      const res = await authApi.login(data.email, data.password);
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

  const onSubmit = (data: LoginFields) => loginMutation.mutate(data);

  useEffect(() => {
    if (user?.id) navigate('/dashboard');
  }, [user?.id, navigate]);

  return (
    <Center h="100vh" bg="gray.0">
      <Paper w={400} p="xl" radius="md" shadow="sm">
        <Title order={2} ta="center" mb="lg">
          {import.meta.env.VITE_APP_NAME ?? 'Resto App'} Login
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
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
            {loginMutation.isError && isAxiosError(loginMutation.error) && (
              <Button variant="light" color="red" size="xs" disabled>
                {(loginMutation.error.response?.data as { message?: string })?.message ?? 'Login failed'}
              </Button>
            )}
            <Button type="submit" loading={loginMutation.isPending} fullWidth>
              Log in
            </Button>
            <Text size="sm" ta="center">
              <Anchor component={Link} to="/forgot-password">Forgot password?</Anchor>
              {' · '}
              <Anchor component={Link} to="/register">Create account</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
