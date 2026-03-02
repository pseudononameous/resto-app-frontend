import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, ActionButtons, CrudModal } from '@components/ui';
import { DataTable } from '@components/tables';
import {
  Stack,
  Tabs,
  TextInput,
  PasswordInput,
  MultiSelect,
  Checkbox,
  Group,
  Text,
  Badge,
  Modal,
  Button,
  ScrollArea,
  Box,
} from '@mantine/core';
import { useState, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { usersApi, rolesApi, permissionsApi } from '@services/api';

type UserRow = {
  id: number;
  name: string;
  email: string;
  roles: { id: number; name: string; slug: string }[];
};

type RoleRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  permissions?: { id: number; name: string; slug: string; group: string | null }[];
};

type PermissionRow = { id: number; name: string; slug: string; group: string | null };

function UsersSection() {
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [roleIds, setRoleIds] = useState<string[]>([]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await usersApi.list()).data?.data ?? [],
  });
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await rolesApi.list()).data?.data ?? [],
  });

  const roleOptions = useMemo(
    () => (Array.isArray(roles) ? roles : []).map((r: RoleRow) => ({ value: String(r.id), label: r.name })),
    [roles]
  );

  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => usersApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setOpened(false);
      notifications.show({ message: 'User created', color: 'green' });
    },
    onError: (err: { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }) => {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Failed to create user';
      notifications.show({ message: msg, color: 'red' });
    },
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
      usersApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setOpened(false);
      setEditingId(null);
      notifications.show({ message: 'User updated', color: 'green' });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      notifications.show({ message: err.response?.data?.message || 'Failed to update', color: 'red' });
    },
  });
  const remove = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      notifications.show({ message: 'User deleted', color: 'green' });
    },
  });

  const rows = Array.isArray(users) ? users : [];
  const openCreate = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setRoleIds([]);
    setOpened(true);
  };
  const openEdit = (r: UserRow) => {
    setEditingId(r.id);
    setName(r.name);
    setEmail(r.email);
    setPassword('');
    setPasswordConfirmation('');
    setRoleIds((r.roles || []).map((role) => String(role.id)));
    setOpened(true);
  };
  const handleSave = () => {
    const payload: Record<string, unknown> = {
      name: name.trim(),
      email: email.trim(),
      role_ids: roleIds.map(Number),
    };
    if (editingId) {
      if (password.trim()) {
        payload.password = password;
        payload.password_confirmation = passwordConfirmation;
      }
      update.mutate({ id: editingId, payload });
    } else {
      if (!password.trim()) {
        notifications.show({ message: 'Password is required', color: 'red' });
        return;
      }
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
      create.mutate(payload);
    }
  };

  return (
    <Stack gap="xl">
      <PageHeader
        title="Users"
        subtitle="Manage team members and their roles"
        actionLabel="Add User"
        onAction={openCreate}
      />
      <DataTable
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'roles',
            header: 'Roles',
            render: (r) => (
              <Group gap={4}>
                {((r as UserRow).roles || []).map((role) => (
                  <Badge key={role.id} size="sm" variant="light" color="orange">
                    {role.name}
                  </Badge>
                ))}
                {((r as UserRow).roles || []).length === 0 && <Text size="sm" c="dimmed">—</Text>}
              </Group>
            ),
          },
        ]}
        data={rows}
        keyExtractor={(r) => (r as UserRow).id}
        isLoading={isLoading}
        actions={(r) => (
          <ActionButtons
            onEdit={() => openEdit(r as UserRow)}
            onDelete={() => remove.mutate((r as UserRow).id)}
          />
        )}
      />
      <CrudModal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editingId ? 'Edit User' : 'New User'}
        onSave={handleSave}
        isSaving={create.isPending || update.isPending}
        submitLabel={editingId ? 'Update' : 'Create'}
      >
        <Stack>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!editingId && (
            <>
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordInput
                label="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </>
          )}
          {editingId && (
            <>
              <PasswordInput
                label="New Password (leave blank to keep current)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                label="Confirm New Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </>
          )}
          <MultiSelect
            label="Roles"
            placeholder="Select roles"
            data={roleOptions}
            value={roleIds}
            onChange={setRoleIds}
          />
        </Stack>
      </CrudModal>
    </Stack>
  );
}

function RolesSection() {
  const qc = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [permOpened, setPermOpened] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [roleIdForPerm, setRoleIdForPerm] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermIds, setSelectedPermIds] = useState<number[]>([]);

  const { data: rolesData = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await rolesApi.list()).data?.data ?? [],
  });
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await permissionsApi.list()).data?.data ?? [],
  });

  const roles = Array.isArray(rolesData) ? rolesData : [];
  const perms = Array.isArray(permissions) ? permissions : [];

  const create = useMutation({
    mutationFn: (d: Record<string, unknown>) => rolesApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      setOpened(false);
      notifications.show({ message: 'Role created', color: 'green' });
    },
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
      rolesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      setOpened(false);
      setEditingId(null);
      notifications.show({ message: 'Role updated', color: 'green' });
    },
  });
  const remove = useMutation({
    mutationFn: (id: number) => rolesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      notifications.show({ message: 'Role deleted', color: 'green' });
    },
  });
  const syncPerms = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: number; permissionIds: number[] }) =>
      rolesApi.syncPermissions(roleId, permissionIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      setPermOpened(false);
      setRoleIdForPerm(null);
      notifications.show({ message: 'Permissions updated', color: 'green' });
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setOpened(true);
  };
  const openEdit = (r: RoleRow) => {
    setEditingId(r.id);
    setName(r.name);
    setSlug(r.slug);
    setDescription(r.description || '');
    setOpened(true);
  };
  const openPermissions = (r: RoleRow) => {
    setRoleIdForPerm(r.id);
    setSelectedPermIds((r.permissions || []).map((p) => p.id));
    setPermOpened(true);
  };
  const handleSaveRole = () => {
    const payload: Record<string, unknown> = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || null,
    };
    if (editingId) update.mutate({ id: editingId, payload });
    else create.mutate(payload);
  };
  const handleSavePermissions = () => {
    if (roleIdForPerm == null) return;
    syncPerms.mutate({ roleId: roleIdForPerm, permissionIds: selectedPermIds });
  };

  const permissionsByGroup = useMemo(() => {
    const map = new Map<string | null, PermissionRow[]>();
    for (const p of perms as PermissionRow[]) {
      const g = p.group ?? 'Other';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a ?? '').localeCompare(b ?? ''));
  }, [perms]);

  return (
    <Stack gap="xl">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Define roles and assign permissions"
        actionLabel="Add Role"
        onAction={openCreate}
      />
      <DataTable
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'name', header: 'Name' },
          { key: 'slug', header: 'Slug' },
          {
            key: 'description',
            header: 'Description',
            render: (r) => (r as RoleRow).description || '—',
          },
          {
            key: 'permissions',
            header: 'Permissions',
            render: (r) => (
              <Text size="sm">
                {((r as RoleRow).permissions || []).length} permission(s)
              </Text>
            ),
          },
        ]}
        data={roles}
        keyExtractor={(r) => (r as RoleRow).id}
        isLoading={isLoading}
        actions={(r) => (
          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              color="orange"
              onClick={() => openPermissions(r as RoleRow)}
            >
              Permissions
            </Button>
            <ActionButtons
              onEdit={() => openEdit(r as RoleRow)}
              onDelete={() => remove.mutate((r as RoleRow).id)}
            />
          </Group>
        )}
      />
      <CrudModal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editingId ? 'Edit Role' : 'New Role'}
        onSave={handleSaveRole}
        isSaving={create.isPending || update.isPending}
        submitLabel={editingId ? 'Update' : 'Create'}
      >
        <Stack>
          <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextInput
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. manager"
          />
          <TextInput
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </CrudModal>

      <Modal
        opened={permOpened}
        onClose={() => { setPermOpened(false); setRoleIdForPerm(null); }}
        title="Assign Permissions"
        size="md"
        radius="lg"
      >
        <ScrollArea h={400}>
          <Stack gap="md">
            {permissionsByGroup.map(([group, groupPerms]) => (
              <Box key={group || 'other'}>
                <Text size="sm" fw={600} mb="xs" c="dimmed">{group}</Text>
                <Stack gap={4}>
                  {groupPerms.map((p) => (
                    <Checkbox
                      key={p.id}
                      label={p.name}
                      checked={selectedPermIds.includes(p.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPermIds((prev) => [...prev, p.id]);
                        else setSelectedPermIds((prev) => prev.filter((id) => id !== p.id));
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </ScrollArea>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => { setPermOpened(false); setRoleIdForPerm(null); }}>
            Cancel
          </Button>
          <Button color="orange" onClick={handleSavePermissions} loading={syncPerms.isPending}>
            Save Permissions
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}

export default function UserManagementTab() {
  return (
    <Stack gap="lg">
      <Tabs defaultValue="users">
        <Tabs.List>
          <Tabs.Tab value="users">Users</Tabs.Tab>
          <Tabs.Tab value="roles">Roles & Permissions</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="users" pt="md">
          <UsersSection />
        </Tabs.Panel>
        <Tabs.Panel value="roles" pt="md">
          <RolesSection />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
