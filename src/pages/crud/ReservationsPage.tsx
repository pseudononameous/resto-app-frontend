import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import { Stack, TextInput, Select, NumberInput } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { crudApi } from '@services/api';
import { usePageApiHelpSimple } from '@hooks/usePageApiHelp';
import { useStoreId } from '@contexts/StoreContext';

const STATUS_OPTS = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'].map((s) => ({ value: s, label: s }));

export default function ReservationsPage() {
  usePageApiHelpSimple("Reservations", "reservations", { reservation_code: "string", guest_name: "string", party_size: 1, reservation_date: "2025-01-01", reservation_time: "12:00", status: "pending" });
  const storeId = useStoreId();
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reservation_code, setReservationCode] = useState('');
  const [customer_id, setCustomerId] = useState<string | null>(null);
  const [guest_name, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [party_size, setPartySize] = useState(1);
  const [reservation_date, setReservationDate] = useState('');
  const [reservation_time, setReservationTime] = useState('');
  const [status, setStatus] = useState('pending');

  const listParams = storeId != null ? { store_id: storeId } : undefined;
  const { data: list = [] } = useQuery({ queryKey: ['reservations', storeId], queryFn: async () => (await crudApi.reservations.list(listParams)).data?.data ?? [] });
  const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: async () => (await crudApi.customers.list()).data?.data ?? [] });
  const create = useMutation({ mutationFn: (d: Record<string, unknown>) => crudApi.reservations.create(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservations'] }); setOpened(false); notifications.show({ message: 'Created', color: 'green' }); } });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) => crudApi.reservations.update(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservations'] }); setOpened(false); setEditingId(null); notifications.show({ message: 'Updated', color: 'green' }); } });
  const remove = useMutation({ mutationFn: (id: number) => crudApi.reservations.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservations'] }); notifications.show({ message: 'Deleted', color: 'green' }); } });

  const rows = Array.isArray(list) ? list : [];
  const custOpts = (Array.isArray(customers) ? customers : []).map((c: { id: number; customer_code: string }) => ({ value: String(c.id), label: c.customer_code }));
  const openCreate = () => { setEditingId(null); setReservationCode(''); setCustomerId(null); setGuestName(''); setPhone(''); setPartySize(1); setReservationDate(''); setReservationTime(''); setStatus('pending'); setOpened(true); };
  const openEdit = (r: Record<string, unknown>) => { setEditingId(r.id as number); setReservationCode(String(r.reservation_code ?? '')); setCustomerId(r.customer_id != null ? String(r.customer_id) : null); setGuestName(String(r.guest_name ?? '')); setPhone(String(r.phone ?? '')); setPartySize(Number(r.party_size ?? 1)); setReservationDate(r.reservation_date ? String(r.reservation_date).slice(0, 10) : ''); setReservationTime(r.reservation_time ? String(r.reservation_time).slice(11, 16) : ''); setStatus(String(r.status ?? 'pending')); setOpened(true); };
  const handleSave = () => { const payload = { reservation_code: reservation_code || null, customer_id: customer_id ? +customer_id : null, guest_name: guest_name || null, phone: phone || null, party_size, reservation_date: reservation_date || null, reservation_time: reservation_time || null, status, store_id: storeId ?? undefined }; if (!reservation_date) { notifications.show({ message: 'Date required', color: 'red' }); return; } if (editingId) update.mutate({ id: editingId, payload }); else create.mutate(payload); };

  return (
    <Stack gap="xl">
      <PageHeader title="Reservations" subtitle="Manage reservations" actionLabel="Add Reservation" onAction={openCreate} />
      <DataTable columns={[{ key: 'id', header: 'ID' }, { key: 'reservation_code', header: 'Code' }, { key: 'guest_name', header: 'Guest' }, { key: 'party_size', header: 'Party' }, { key: 'reservation_date', header: 'Date' }, { key: 'status', header: 'Status' }]} data={rows} keyExtractor={(r) => (r as { id: number }).id} actions={(r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => remove.mutate((r as { id: number }).id)} />} />
      <CrudModal opened={opened} onClose={() => setOpened(false)} title={editingId ? 'Edit Reservation' : 'New Reservation'} onSave={handleSave} isSaving={create.isPending || update.isPending} submitLabel={editingId ? 'Update' : 'Create'}>
        <Stack>
          <TextInput label="Reservation Code" value={reservation_code} onChange={(e) => setReservationCode(e.target.value)} />
          <Select label="Customer" data={custOpts} value={customer_id} onChange={setCustomerId} clearable />
          <TextInput label="Guest Name" value={guest_name} onChange={(e) => setGuestName(e.target.value)} />
          <TextInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <NumberInput label="Party Size" value={party_size} onChange={(v) => setPartySize(Number(v) || 1)} min={1} />
          <TextInput label="Date" type="date" value={reservation_date} onChange={(e) => setReservationDate(e.target.value)} required />
          <TextInput label="Time" type="time" value={reservation_time} onChange={(e) => setReservationTime(e.target.value)} />
          <Select label="Status" data={STATUS_OPTS} value={status} onChange={(v) => v && setStatus(v)} />
        </Stack>
      </CrudModal>
    </Stack>
  );
}
