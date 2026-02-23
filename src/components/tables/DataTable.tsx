import { Table, Paper, Box, Loader } from "@mantine/core";
import NoRecordsFound from "./NoRecordsFound";

interface Column<T> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
}

export default function DataTable<T>({ columns, data, keyExtractor, isLoading, emptyMessage, actions }: DataTableProps<T>) {
  return (
    <Paper p="lg" withBorder radius="lg" style={{ boxShadow: "0 4px 16px rgba(0,0,0,.06)" }}>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => <Table.Th key={col.key}>{col.header}</Table.Th>)}
            {actions && <Table.Th>Actions</Table.Th>}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length + (actions ? 1 : 0)}>
                <Box py="xl" style={{ display: "flex", justifyContent: "center" }}><Loader size="sm" type="dots" /></Box>
              </Table.Td>
            </Table.Tr>
          ) : data.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length + (actions ? 1 : 0)}>
                {emptyMessage ? <Box py="md" ta="center">{emptyMessage}</Box> : <NoRecordsFound />}
              </Table.Td>
            </Table.Tr>
          ) : (
            data.map((row) => (
              <Table.Tr key={keyExtractor(row)}>
                {columns.map((col) => (
                  <Table.Td key={col.key}>{col.cell ? col.cell(row) : col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "—")}</Table.Td>
                ))}
                {actions && <Table.Td>{actions(row)}</Table.Td>}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
