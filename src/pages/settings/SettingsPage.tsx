import { Tabs, Stack } from '@mantine/core';
import {
  IconUser,
  IconPlug,
  IconMapPin,
  IconUsers,
  IconBell,
  IconCreditCard,
  IconWallet,
  IconReceiptTax,
  IconFileInvoice,
  IconTruck,
  IconPalette,
} from '@tabler/icons-react';
import PageHeader from '@components/ui/PageHeader';
import UserManagementTab from './UserManagementTab';
import AccountSettingsTab from './AccountSettingsTab';
import IntegrationsSettingsTab from './IntegrationsSettingsTab';
import LocationsSettingsTab from './LocationsSettingsTab';
import NotificationsSettingsTab from './NotificationsSettingsTab';
import PaymentMethodsSettingsTab from './PaymentMethodsSettingsTab';
import PayoutsSettingsTab from './PayoutsSettingsTab';
import TaxCenterSettingsTab from './TaxCenterSettingsTab';
import BillingSettingsTab from './BillingSettingsTab';
import CourierLogisticsSettingsTab from './CourierLogisticsSettingsTab';
import ThemeOptionsTab from './ThemeOptionsTab';
import ThemeCustomizationTab from './ThemeCustomizationTab';

const TABS = [
  { value: 'account', label: 'Account', icon: IconUser },
  { value: 'themes', label: 'Themes', icon: IconPalette },
  { value: 'integrations', label: 'Integrations', icon: IconPlug },
  { value: 'locations', label: 'Locations', icon: IconMapPin },
  { value: 'user-management', label: 'User Management', icon: IconUsers },
  { value: 'notifications', label: 'Notifications', icon: IconBell },
  { value: 'payment-methods', label: 'Payment Methods', icon: IconCreditCard },
  { value: 'payouts', label: 'Payouts', icon: IconWallet },
  { value: 'tax-center', label: 'Tax Center', icon: IconReceiptTax },
  { value: 'billing', label: 'Billing', icon: IconFileInvoice },
  { value: 'courier-logistics', label: 'Courier & Logistics', icon: IconTruck },
] as const;

export default function SettingsPage() {
  return (
    <Stack gap="lg">
      <PageHeader title="Settings" subtitle="Manage your restaurant account and preferences" />
      <Tabs defaultValue="account" keepMounted={false}>
        <Tabs.List
          style={{
            flexWrap: 'wrap',
            gap: 4,
            borderBottom: '1px solid var(--mantine-color-default-border)',
            paddingBottom: 0,
          }}
        >
          {TABS.map(({ value, label, icon: Icon }) => (
            <Tabs.Tab key={value} value={value} leftSection={<Icon size={16} />}>
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="account" pt="md">
          <AccountSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="themes" pt="md">
          <ThemeOptionsTab />
          <ThemeCustomizationTab />
        </Tabs.Panel>
        <Tabs.Panel value="integrations" pt="md">
          <IntegrationsSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="locations" pt="md">
          <LocationsSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="user-management" pt="md">
          <UserManagementTab />
        </Tabs.Panel>
        <Tabs.Panel value="notifications" pt="md">
          <NotificationsSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="payment-methods" pt="md">
          <PaymentMethodsSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="payouts" pt="md">
          <PayoutsSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="tax-center" pt="md">
          <TaxCenterSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="billing" pt="md">
          <BillingSettingsTab />
        </Tabs.Panel>
        <Tabs.Panel value="courier-logistics" pt="md">
          <CourierLogisticsSettingsTab />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
