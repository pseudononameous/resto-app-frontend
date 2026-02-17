import { Link, useSearchParams } from 'react-router-dom';
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
import { resetPasswordSchema, type ResetPasswordFields } from '@lib/schemas/auth';
import { isAxiosError } from 'axios';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, email, password: '', password_confirmation: '' },
  });

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordFields) => {
      const res = await authApi.resetPassword(data);
      return res.data;
    },
  });

  return (
    <Center h="100vh" bg="gray.0">
      <Paper w={400} p="xl" radius="md" shadow="sm">
        <Title order={2} ta="center" mb="lg">
          Reset password
        </Title>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <Stack gap="md">
            <input type="hidden" {...register('token')} />
            <TextInput {...register('email')} label="Email" disabled />
            <PasswordInput
              {...register('password')}
              label="New password"
              placeholder="••••••••"
              error={errors.password?.message}
              required
            />
            <PasswordInput
              {...register('password_confirmation')}
              label="Confirm new password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              required
            />
            {mutation.isError && isAxiosError(mutation.error) && (
              <Text size="sm" c="red">
                {(mutation.error.response?.data as { message?: string })?.message ?? 'Reset failed'}
              </Text>
            )}
            {mutation.isSuccess && (
              <Text size="sm" c="green">
                Password has been reset. You can now log in.
              </Text>
            )}
            <Button type="submit" loading={mutation.isPending} fullWidth>
              Reset password
            </Button>
            <Text size="sm" ta="center">
              <Anchor component={Link} to="/login">Back to login</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
