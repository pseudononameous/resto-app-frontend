import { Drawer, Title, Text, Stack, Code, Paper, Divider, Group } from "@mantine/core";
import { useApiHelp } from "@contexts/ApiHelpContext";
import { API_HOST } from "@config/api";

export default function ApiHelpSidebar() {
  const { apiHelp, sidebarOpened, closeSidebar } = useApiHelp();
  const baseUrl = API_HOST.replace(/\/+$/, "");

  return (
    <Drawer
      opened={sidebarOpened}
      onClose={closeSidebar}
      position="right"
      size="md"
      title="API Help"
      styles={{
        header: { fontWeight: 700, fontSize: "1.1rem" },
        body: { padding: "var(--mantine-spacing-lg)" },
      }}
    >
      {apiHelp ? (
        <Stack gap="lg">
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Resource</Text>
            <Title order={4}>{apiHelp.resourceName}</Title>
            <Text size="sm" c="dimmed" mt={4}>Base path: {apiHelp.basePath}</Text>
          </div>
          <Divider />
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="sm">How to use</Text>
            <Text size="sm" c="dimmed" mb="md">
              All requests require authentication. Send the session cookie or Bearer token. Base URL: <Code block>{baseUrl}</Code>
            </Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb="sm">Endpoints</Text>
            <Stack gap="md">
              {apiHelp.endpoints.map((ep, i) => (
                <Paper key={i} p="md" withBorder radius="md">
                  <Group gap="xs" mb={4}>
                    <Code color={ep.method === "GET" ? "green" : ep.method === "POST" ? "blue" : ep.method === "PUT" ? "orange" : "red"}>{ep.method}</Code>
                    <Code variant="light" style={{ wordBreak: "break-all" }}>{ep.path}</Code>
                  </Group>
                  <Text size="sm" c="dimmed" mb={ep.bodyExample ? "sm" : 0}>{ep.description}</Text>
                  {ep.bodyExample && (
                    <>
                      <Text size="xs" fw={600} mt="xs" mb={4}>Example body:</Text>
                      <Code block>{JSON.stringify(ep.bodyExample, null, 2)}</Code>
                    </>
                  )}
                </Paper>
              ))}
            </Stack>
          </div>
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">No API info for this page. Navigate to a CRUD page to see its API guide.</Text>
      )}
    </Drawer>
  );
}

