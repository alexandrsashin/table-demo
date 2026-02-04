import { useMemo } from "react";
import {
  MantineProvider,
  Tabs,
  Container,
  Title,
  Text,
  Tooltip,
} from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { IconInfoCircle } from "@tabler/icons-react";
import { TABLE_DATA } from "../constants";

interface TableRow {
  id: number;
  label: string;
  date: string;
}

function AdvancedMantineTable() {
  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableHiding: false, // Блокировка - нельзя скрыть
        enableColumnOrdering: false, // Блокировка - нельзя переместить
        enableResizing: true,
        mantinePaperProps: {
          style: { minWidth: "80px" },
        },
      },
      {
        accessorKey: "label",
        header: "Label",
        size: 200,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
        Header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Label</span>
            <Tooltip label="Это информационная подсказка для колонки Label">
              <IconInfoCircle size={16} style={{ cursor: "help" }} />
            </Tooltip>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
      },
    ],
    [],
  );

  return (
    <MantineReactTable
      columns={columns}
      data={TABLE_DATA}
      enableColumnOrdering // Изменение порядка колонок
      enableColumnResizing // Изменение ширины колонок
      enablePinning // Фиксация колонок
      enableSorting // Сортировка
      enableColumnActions // Действия с колонками
      enableHiding // Скрытие колонок
      initialState={{
        density: "xs",
        pagination: { pageSize: 20, pageIndex: 0 },
        columnPinning: {
          left: ["id"], // ID зафиксирован слева по умолчанию
        },
      }}
      mantineTableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        striped: true,
      }}
      mantineTableContainerProps={{
        sx: { maxHeight: "600px" },
      }}
      mantinePaginationProps={{
        showRowsPerPage: true,
        rowsPerPageOptions: ["10", "20", "50", "100"],
      }}
      enableColumnDragging // Перетаскивание колонок для изменения порядка
      columnResizeMode="onChange" // Изменение размера в реальном времени
    />
  );
}

export function ExamplesPage() {
  return (
    <MantineProvider>
      <Container size="xl" py="xl">
        <Title order={1} ta="center" mb="xs">
          Блок примеров
        </Title>
        <Text ta="center" c="dimmed" mb="xl">
          Дополнительные примеры и демонстрации
        </Text>

        <Tabs defaultValue="table1">
          <Tabs.List>
            <Tabs.Tab value="table1">Продвинутая таблица</Tabs.Tab>
            <Tabs.Tab value="example2">Пример 2</Tabs.Tab>
            <Tabs.Tab value="example3">Пример 3</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="table1" pt="md">
            <Title order={3} mb="sm">
              Mantine React Table с расширенными возможностями
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              • Скрытие/отображение колонок (кнопка с глазом справа)
              <br />
              • Изменение порядка колонок (перетаскивание)
              <br />
              • Изменение ширины колонок (перетаскивание разделителей)
              <br />
              • Сортировка по колонкам (клик на заголовок)
              <br />
              • Фиксация колонок слева/справа (кнопка с пином в меню колонки)
              <br />
              • Колонка ID заблокирована (нельзя скрыть или переместить)
              <br />• Колонка Label имеет информационную иконку в заголовке
            </Text>
            <AdvancedMantineTable />
          </Tabs.Panel>

          <Tabs.Panel value="example2" pt="md">
            <Title order={3} mb="sm">
              Пример 2
            </Title>
            <Text c="dimmed">Здесь будет размещен второй пример</Text>
          </Tabs.Panel>

          <Tabs.Panel value="example3" pt="md">
            <Title order={3} mb="sm">
              Пример 3
            </Title>
            <Text c="dimmed">Здесь будет размещен третий пример</Text>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </MantineProvider>
  );
}
