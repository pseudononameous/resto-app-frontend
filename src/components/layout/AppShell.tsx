import { AppShell as MantineAppShell, Burger, Group, Stack, NavLink, UnstyledButton, Box, Text, ThemeIcon, Menu, Button, Tooltip, Select, Paper } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { IconLogout, IconUser, IconLayoutDashboard, IconBooks, IconCode, IconMapPin, IconPackage, IconMenu2, IconClipboardList, IconUsers, IconTruckDelivery, IconCalendar, IconCategory, IconStack2, IconDeviceDesktop, IconTicket } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useApiHelp } from "@contexts/ApiHelpContext";
import { useStoreContext, StoreProvider } from "@contexts/StoreContext";
import ApiHelpSidebar from "./ApiHelpSidebar";
import { useAuthStore } from "@stores/useAuthStore";
import { authApi, crudApi } from "@services/api";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { to: "/dashboard/libraries", label: "Libraries", icon: IconBooks },
  {
    label: "Products",
    icon: IconPackage,
    children: [
      { to: "/dashboard/products/collections", label: "Collections", icon: IconCategory },
      { to: "/dashboard/products/inventory", label: "Inventory", icon: IconStack2 },
    ],
  },
  { to: "/dashboard/menu-items", label: "Menu Items", icon: IconMenu2 },
  { to: "/dashboard/kiosk", label: "Kiosk", icon: IconDeviceDesktop },
  { to: "/dashboard/orders", label: "Orders", icon: IconClipboardList },
  { to: "/dashboard/kitchen-tickets", label: "Kitchen tickets", icon: IconTicket },
  { to: "/dashboard/customers", label: "Customers", icon: IconUsers },
  { to: "/dashboard/deliveries", label: "Deliveries", icon: IconTruckDelivery },
  { to: "/dashboard/reservations", label: "Reservations", icon: IconCalendar },
];

function NavItem({ to, label, icon: Icon, isActive, large }: { to: string; label: string; icon: React.ComponentType<{ size?: number }>; isActive: boolean; large: boolean }) {
  const link = <NavLink component={Link} to={to} label={large ? label : null} leftSection={<Icon size={large ? 18 : 22} />} active={isActive} variant="light" style={{ borderRadius: "var(--mantine-radius-md)", fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? "var(--mantine-color-primary-0)" : undefined }} />;
  return large ? link : <Tooltip key={to} label={label} position="right" offset={8}>{link}</Tooltip>;
}

function NavParent({ item, isChildActive, large }: { item: { label: string; icon: React.ComponentType<{ size?: number }>; children: { to: string; label: string; icon: React.ComponentType<{ size?: number }> }[] }; isChildActive: boolean; large: boolean }) {
  const location = useLocation();
  const Icon = item.icon;
  return (
    <NavLink
      defaultOpened={isChildActive}
      leftSection={<Icon size={large ? 18 : 22} />}
      label={large ? item.label : null}
      variant="light"
      style={{ borderRadius: "var(--mantine-radius-md)" }}
    >
      {item.children.map((child) => {
        const ChildIcon = child.icon;
        const active = location.pathname === child.to || (child.to !== "/dashboard" && location.pathname.startsWith(child.to));
        const link = <NavLink component={Link} to={child.to} label={large ? child.label : null} leftSection={large ? <ChildIcon size={16} /> : null} active={active} variant="light" style={{ borderRadius: "var(--mantine-radius-md)", fontWeight: active ? 600 : 500, backgroundColor: active ? "var(--mantine-color-primary-0)" : undefined }} />;
        return large ? link : <Tooltip key={child.to} label={child.label} position="right" offset={8}>{link}</Tooltip>;
      })}
    </NavLink>
  );
}

function LocationFilter({ large }: { large: boolean }) {
  const storeContext = useStoreContext();
  const { data: stores = [] } = useQuery({ queryKey: ["stores"], queryFn: async () => (await crudApi.stores.list()).data?.data ?? [] });
  const storeOpts = [{ value: "", label: "All locations" }, ...(Array.isArray(stores) ? stores : []).map((s: { id: number; name: string }) => ({ value: String(s.id), label: s.name || `Store ${s.id}` }))];
  if (!storeContext) return null;
  return (
    <Paper p={large ? "sm" : "xs"} withBorder radius="md" style={{ borderColor: "var(--mantine-color-orange-2)", backgroundColor: "var(--mantine-color-orange-0)" }}>
      <Select
        size="xs"
        leftSection={<IconMapPin size={14} />}
        label={large ? "Location" : undefined}
        placeholder={large ? "Filter by store" : "Store"}
        data={storeOpts}
        value={storeContext.storeId != null ? String(storeContext.storeId) : ""}
        onChange={(v) => storeContext.setStoreId(v ? +v : null)}
        clearable
        styles={{ label: { fontSize: "0.7rem" } }}
      />
    </Paper>
  );
}

export default function AppShellLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { width } = useViewportSize();
  const { user, logout } = useAuthStore();
  const { openSidebar } = useApiHelp();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = async () => { try { await authApi.logout(); } finally { logout(); navigate("/login"); } };
  const large = (width ?? 1200) >= 1338;
  const isActive = (path: string) => location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));

  return (
    <StoreProvider>
      <MantineAppShell header={{ height: 64 }} navbar={{ width: large ? 260 : 72, breakpoint: "sm", collapsed: { mobile: !opened } }} padding="md"
        styles={{ main: { background: "var(--mantine-color-gray-0)", minHeight: "100vh" }, header: { background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--mantine-color-gray-2)" }, navbar: { background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRight: "1px solid var(--mantine-color-gray-2)" } }}
      >
        <MantineAppShell.Header>
          <Group justify="space-between" px="lg" h="100%">
            <Group h="100%" gap="xl">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <UnstyledButton component={Link} to="/dashboard"><Group px={12} gap="sm">
                <ThemeIcon size={42} radius="md" style={{ background: "linear-gradient(135deg, var(--mantine-color-orange-6), var(--mantine-color-red-6))", color: "white" }}><Text fw={700} size="xs">R</Text></ThemeIcon>
                <Box><Text size="lg" fw={700} c="dark.7">Resto App</Text><Text size="xs" c="dimmed" visibleFrom="md">Admin</Text></Box>
              </Group></UnstyledButton>
            </Group>
            <Group gap="sm">
              <Tooltip label="API Help"><Button variant="subtle" size="sm" leftSection={<IconCode size={18} />} onClick={openSidebar}>Developer</Button></Tooltip>
              <Menu shadow="lg" width={220} position="bottom-end" radius="md">
                <Menu.Target><Button variant="light" radius="md" leftSection={<IconUser size={18} />}><Text visibleFrom="sm" span>{user?.name ?? "User"}</Text></Button></Menu.Target>
                <Menu.Dropdown><Menu.Item leftSection={<IconUser size={16} />}>Profile</Menu.Item><Menu.Divider /><Menu.Item leftSection={<IconLogout size={16} />} color="red" onClick={handleLogout}>Logout</Menu.Item></Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </MantineAppShell.Header>
        <MantineAppShell.Navbar p={large ? "md" : "xs"}>
          <MantineAppShell.Section>
            <Stack gap={4}>
              <NavItem to="/dashboard" label="Dashboard" icon={IconLayoutDashboard} isActive={isActive("/dashboard")} large={large} />
            </Stack>
          </MantineAppShell.Section>
          <MantineAppShell.Section mt="xs">
            <LocationFilter large={large} />
          </MantineAppShell.Section>
          <MantineAppShell.Section mt="md" grow>
            <Stack gap={4}>
              {NAV.map((entry) =>
                'children' in entry ? (
                  <NavParent key={entry.label} item={entry} isChildActive={entry.children.some((c) => isActive(c.to))} large={large} />
                ) : (
                  <NavItem key={entry.to} to={entry.to} label={entry.label} icon={entry.icon} isActive={isActive(entry.to)} large={large} />
                )
              )}
            </Stack>
          </MantineAppShell.Section>
        </MantineAppShell.Navbar>
        <MantineAppShell.Main><Box p="md"><Outlet /></Box></MantineAppShell.Main>
        <ApiHelpSidebar />
      </MantineAppShell>
    </StoreProvider>
  );
}
