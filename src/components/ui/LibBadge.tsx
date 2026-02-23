import { Badge } from '@mantine/core';

export function LibBadge({ value, variant = 'light' }: { value: string | null | undefined; variant?: 'light' | 'filled' | 'outline' }) {
  if (value == null || value === '') return <>—</>;
  return <Badge size="sm" variant={variant} radius="sm">{value}</Badge>;
}
