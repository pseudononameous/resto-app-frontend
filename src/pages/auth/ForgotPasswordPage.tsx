import { Link } from 'react-router-dom';
import { TextInput, Button, Stack, Paper, Title, Text, Center, Anchor } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@services/api';
import { forgotPasswordSchema, type ForgotPasswordFields } from '@lib/schemas/auth';
import { isAxiosError } from 'axios';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordFields) => {
      const res = await authApi.forgotPassword(data.email);
      return res.data;
    },
  });

  return (
    <Center h="100vh" bg="gray.0">
      <Paper w={400} p="xl" radius="md" shadow="sm">
        <Title order={2} ta="center" mb="lg">
          Forgot password
        </Title>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Enter your email and we’ll send you a link to reset your password.
            </Text>
            <TextInput
              {...register('email')}
              label="Email"
              placeholder="your@email.com"
              error={errors.email?.message}
              required
            />
            {mutation.isError && isAxiosError(mutation.error) && (
              <Text size="sm" c="red">
                {(mutation.error.response?.data as { message?: string })?.message ?? 'Request failed'}
              </Text>
            )}
            {mutation.isSuccess && (
              <Text size="sm" c="green">
                If that email exists, we’ve sent a reset link.
              </Text>
            )}
            <Button type="submit" loading={mutation.isPending} fullWidth>
              Send reset link
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
