import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';

export default function CustomersPage() {
  usePageApiHelpSimple("Customers", "customers", { customer_code: "string", first_name: "string", last_name: "string", phone: "string", email: "string" });
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customer_code, setCustomerCode] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { data = [], isLoading } = useQuery({ queryKey: ['customers'], queryFn: async () => (await crudApi.customers.list()).data?.data ?? [] });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.customers.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.customers.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.customers.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(data) ? data : [];
  const openCreate = () => { setEditingId(null); setCustomerCode(''); setFirstName(''); setLastName(''); setPhone(''); setEmail(''); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setCustomerCode(String(r.customer_code ?? '')); setFirstName(String(r.first_name ?? '')); setLastName(String(r.last_name ?? '')); setPhone(String(r.phone ?? '')); setEmail(String(r.email ?? '')); setOpened(true); };
  const handleSave = () => {
    const payload = { customer_code: customer_code.trim(), first_name: first_name.trim() || null, last_name: last_name.trim() || null, phone: phone.trim(), email: email.trim() || null };
    if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload);
  };

  return (
    <Stack gap="xl">
      <PageHeader title="Customers" subtitle="Manage customers" actionLabel="Add Customer" onAction={openCreate} />
      <DataTable
        columns={[{ key: 'id', header: 'ID' }, { key: 'customer_code', header: 'Code' }, { key: 'first_name', header: 'First' }, { key: 'last_name', header: 'Last' }, { key: 'phone', header: 'Phone' }, { key: 'email', header: 'Email' }]}
        data={rows}
        keyExtractor={(r) => (r as { id: number }).id}
        isLoading={isLoading}
        actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />}
      />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Customer' : 'New Customer'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <TextInput label="Customer Code" value={customer_code} onChange={(e) => setCustomerCode(e.target.value)} required />
          <TextInput label="First Name" value={first_name} onChange={(e) => setFirstName(e.target.value)} />
          <TextInput label="Last Name" value={last_name} onChange={(e) => setLastName(e.target.value)} />
          <TextInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
