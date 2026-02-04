import { useMemo, useState } from "react";
import { Badge, ActionIcon, Box, Text } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { IconTrash } from "@tabler/icons-react";

interface HierarchicalRow {
  id: number;
  name: string;
  category: string;
  status: string;
  subRows?: HierarchicalRow[];
}

// Данные для иерархической таблицы
const hierarchicalData: HierarchicalRow[] = [
  {
    id: 1,
    name: "Электроника",
    category: "Категория",
    status: "Активна",
    subRows: [
      {
        id: 11,
        name: "Смартфоны",
        category: "Подкатегория",
        status: "Активна",
        subRows: [
          { id: 111, name: "iPhone", category: "Товар", status: "В наличии" },
          { id: 112, name: "Samsung", category: "Товар", status: "В наличии" },
        ],
      },
      {
        id: 12,
        name: "Ноутбуки",
        category: "Подкатегория",
        status: "Активна",
        subRows: [
          { id: 121, name: "MacBook", category: "Товар", status: "В наличии" },
          { id: 122, name: "ThinkPad", category: "Товар", status: "Заказ" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Мебель",
    category: "Категория",
    status: "Активна",
    subRows: [
      {
        id: 21,
        name: "Столы",
        category: "Подкатегория",
        status: "Активна",
        subRows: [
          {
            id: 211,
            name: "Письменный стол",
            category: "Товар",
            status: "В наличии",
          },
          {
            id: 212,
            name: "Компьютерный стол",
            category: "Товар",
            status: "В наличии",
          },
        ],
      },
      {
        id: 22,
        name: "Стулья",
        category: "Подкатегория",
        status: "Активна",
        subRows: [
          {
            id: 221,
            name: "Офисное кресло",
            category: "Товар",
            status: "В наличии",
          },
          {
            id: 222,
            name: "Стул обеденный",
            category: "Товар",
            status: "Заказ",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Книги",
    category: "Категория",
    status: "Активна",
    subRows: [
      {
        id: 31,
        name: "Программирование",
        category: "Подкатегория",
        status: "Активна",
        subRows: [
          {
            id: 311,
            name: "JavaScript",
            category: "Товар",
            status: "В наличии",
          },
          { id: 312, name: "Python", category: "Товар", status: "В наличии" },
        ],
      },
    ],
  },
];

export function HierarchicalTable() {
  const [data, setData] = useState<HierarchicalRow[]>(hierarchicalData);

  // Рекурсивное удаление элемента по id
  const deleteRow = (idToDelete: number) => {
    const removeFromTree = (items: HierarchicalRow[]): HierarchicalRow[] => {
      return items
        .filter((item) => item.id !== idToDelete)
        .map((item) => ({
          ...item,
          subRows: item.subRows ? removeFromTree(item.subRows) : undefined,
        }));
    };
    setData(removeFromTree(data));
  };

  const columns = useMemo<MRT_ColumnDef<HierarchicalRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Название",
        size: 250,
      },
      {
        accessorKey: "category",
        header: "Тип",
        size: 150,
        Cell: ({ cell }) => (
          <Badge
            color={
              cell.getValue<string>() === "Категория"
                ? "blue"
                : cell.getValue<string>() === "Подкатегория"
                  ? "cyan"
                  : "gray"
            }
            variant="light"
          >
            {cell.getValue<string>()}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Статус",
        size: 150,
        Cell: ({ cell }) => (
          <Badge
            color={
              cell.getValue<string>() === "В наличии"
                ? "green"
                : cell.getValue<string>() === "Активна"
                  ? "blue"
                  : "orange"
            }
            variant="filled"
          >
            {cell.getValue<string>()}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableExpanding
      enableExpandAll
      enableRowSelection
      enableRowActions
      positionActionsColumn="first"
      getSubRows={(row) => row.subRows}
      renderRowActionMenuItems={({ row }) => [
        <Box
          key="delete"
          p="xs"
          style={{ cursor: "pointer" }}
          onClick={() => deleteRow(row.original.id)}
        >
          <ActionIcon color="red" variant="subtle">
            <IconTrash size={18} />
          </ActionIcon>
        </Box>,
      ]}
      initialState={{
        expanded: true,
        density: "xs",
      }}
      mantineTableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
      }}
      mantineTableContainerProps={{
        sx: { maxHeight: "600px" },
      }}
    />
  );
}
