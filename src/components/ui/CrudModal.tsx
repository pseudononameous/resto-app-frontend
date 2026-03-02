import { Modal, Stack, Button, Group } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

interface CrudModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isSaving?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export default function CrudModal({
  opened, onClose, title, children, onSave, isSaving,
  submitLabel = "Save", cancelLabel = "Cancel",
}: CrudModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} size="md" radius="lg" centered padding={0}
      styles={{
        overlay: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.45)" },
        content: { borderRadius: 12, overflow: "hidden", boxShadow: "var(--mantine-shadow-lg)", border: "1px solid var(--mantine-color-default-border)" },
        header: { padding: "20px 24px", background: "linear-gradient(135deg, var(--mantine-color-orange-0), var(--mantine-color-orange-1))", borderBottom: "1px solid var(--mantine-color-default-border)", margin: 0, flex: 1 },
        title: { fontWeight: 700, fontSize: "1.125rem" },
        body: { padding: 0 },
      }}
    >
      <Stack gap={0}>
        <div style={{ padding: "var(--mantine-spacing-xl)", backgroundColor: "var(--mantine-color-body)" }}>{children}</div>
        <div style={{ padding: "var(--mantine-spacing-lg)", backgroundColor: "var(--mantine-color-default)", borderTop: "1px solid var(--mantine-color-default-border)" }}>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={onClose} radius="md">{cancelLabel}</Button>
            <Button leftSection={<IconCheck size={18} />} onClick={onSave} loading={isSaving} radius="md" color="orange">{submitLabel}</Button>
          </Group>
        </div>
      </Stack>
    </Modal>
  );
}
