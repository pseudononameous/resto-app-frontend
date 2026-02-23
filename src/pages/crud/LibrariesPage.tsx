import { Stack, Tabs, Text } from "@mantine/core";
import { PageHeader } from "@components/ui";
import LibraryCrudPage from "@components/libraries/LibraryCrudPage";
import { crudApi } from "@services/api";

type LibraryConfig = { title: string; api: typeof crudApi.brands; queryKey: string; fieldName?: "name" | "type_name" | "zone_name" | "group_name"; apiPath: string };

const GROUPS: { label: string; libraries: LibraryConfig[] }[] = [
  {
    label: "Inventory",
    libraries: [
      { title: "Brands", api: crudApi.brands, queryKey: "brands", apiPath: "brands" },
      { title: "Categories", api: crudApi.categories, queryKey: "categories", apiPath: "categories" },
    ],
  },
  {
    label: "Menu",
    libraries: [
      { title: "Menu Categories", api: crudApi.menuCategories, queryKey: "menu-categories", apiPath: "menu-categories" },
      { title: "Combo Meals", api: crudApi.comboMeals, queryKey: "combo-meals", apiPath: "combo-meals" },
    ],
  },
  {
    label: "Orders & POS",
    libraries: [
      { title: "Order Types", api: crudApi.orderTypes, queryKey: "order-types", fieldName: "type_name", apiPath: "order-types" },
    ],
  },
  {
    label: "Delivery Management",
    libraries: [
      { title: "Stores", api: crudApi.stores, queryKey: "stores", apiPath: "stores" },
      { title: "Delivery Zones", api: crudApi.deliveryZones, queryKey: "delivery-zones", fieldName: "zone_name", apiPath: "delivery-zones" },
    ],
  },
  {
    label: "Customer and Loyalty",
    libraries: [
      { title: "Groups", api: crudApi.groups, queryKey: "groups", fieldName: "group_name", apiPath: "groups" },
    ],
  },
  { label: "Cart & Checkout", libraries: [] },
  { label: "Stock Tracking & Waste", libraries: [] },
  { label: "Notifications", libraries: [] },
  { label: "Table & Reservation", libraries: [] },
];

export default function LibrariesPage() {
  return (
    <Stack gap="xl">
      <PageHeader title="Libraries" subtitle="Manage library data by category" />
      <Tabs defaultValue={GROUPS[0].label}>
        <Tabs.List>
          {GROUPS.map((g) => (
            <Tabs.Tab key={g.label} value={g.label}>{g.label}</Tabs.Tab>
          ))}
        </Tabs.List>
        {GROUPS.map((g) => (
          <Tabs.Panel key={g.label} value={g.label} pt="md">
            <Stack gap="xl">
              {g.libraries.length === 0 ? (
                <Text c="dimmed" size="sm">No libraries in this group yet.</Text>
              ) : null}
              {g.libraries.map((lib) => (
                <LibraryCrudPage
                  key={lib.queryKey}
                  title={lib.title}
                  api={lib.api}
                  queryKey={lib.queryKey}
                  fieldName={lib.fieldName}
                  apiPath={lib.apiPath}
                />
              ))}
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
}
