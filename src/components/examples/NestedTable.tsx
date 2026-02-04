import { useMemo } from "react";
import { Badge, Box, Title, Text } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";

interface RowWithDetails {
  id: number;
  product: string;
  price: number;
  stock: number;
  orders?: {
    orderId: string;
    customer: string;
    quantity: number;
    date: string;
  }[];
}

// Данные для таблицы с вложенной таблицей
const detailsData: RowWithDetails[] = [
  {
    id: 1,
    product: "Ноутбук Dell XPS 15",
    price: 89990,
    stock: 15,
    orders: [
      {
        orderId: "ORD-001",
        customer: "Иван Петров",
        quantity: 2,
        date: "2024-01-15",
      },
      {
        orderId: "ORD-002",
        customer: "Мария Сидорова",
        quantity: 1,
        date: "2024-01-18",
      },
      {
        orderId: "ORD-003",
        customer: "Алексей Смирнов",
        quantity: 1,
        date: "2024-01-20",
      },
    ],
  },
  {
    id: 2,
    product: "iPhone 15 Pro",
    price: 119990,
    stock: 8,
    orders: [
      {
        orderId: "ORD-004",
        customer: "Елена Иванова",
        quantity: 1,
        date: "2024-01-16",
      },
      {
        orderId: "ORD-005",
        customer: "Дмитрий Козлов",
        quantity: 3,
        date: "2024-01-19",
      },
    ],
  },
  {
    id: 3,
    product: "Samsung Galaxy S24",
    price: 79990,
    stock: 22,
    orders: [
      {
        orderId: "ORD-006",
        customer: "Ольга Новикова",
        quantity: 1,
        date: "2024-01-17",
      },
      {
        orderId: "ORD-007",
        customer: "Сергей Волков",
        quantity: 2,
        date: "2024-01-21",
      },
      {
        orderId: "ORD-008",
        customer: "Анна Морозова",
        quantity: 1,
        date: "2024-01-22",
      },
    ],
  },
  {
    id: 4,
    product: "MacBook Pro 16",
    price: 249990,
    stock: 5,
    orders: [
      {
        orderId: "ORD-009",
        customer: "Павел Соколов",
        quantity: 1,
        date: "2024-01-23",
      },
    ],
  },
];

export function NestedTable() {
  const columns = useMemo<MRT_ColumnDef<RowWithDetails>[]>(
    () => [
      {
        accessorKey: "product",
        header: "Товар",
        size: 250,
      },
      {
        accessorKey: "price",
        header: "Цена",
        size: 120,
        Cell: ({ cell }) =>
          `₽${cell.getValue<number>().toLocaleString("ru-RU")}`,
      },
      {
        accessorKey: "stock",
        header: "На складе",
        size: 120,
        Cell: ({ cell }) => (
          <Badge color={cell.getValue<number>() > 10 ? "green" : "orange"}>
            {cell.getValue<number>()} шт.
          </Badge>
        ),
      },
    ],
    [],
  );

  const orderColumns = useMemo<
    MRT_ColumnDef<{
      orderId: string;
      customer: string;
      quantity: number;
      date: string;
    }>[]
  >(
    () => [
      {
        accessorKey: "orderId",
        header: "Номер заказа",
        size: 120,
      },
      {
        accessorKey: "customer",
        header: "Покупатель",
        size: 200,
      },
      {
        accessorKey: "quantity",
        header: "Количество",
        size: 100,
        Cell: ({ cell }) => `${cell.getValue<number>()} шт.`,
      },
      {
        accessorKey: "date",
        header: "Дата",
        size: 120,
      },
    ],
    [],
  );

  return (
    <MantineReactTable
      columns={columns}
      data={detailsData}
      enableExpanding
      renderDetailPanel={({ row }) => (
        <Box p="md" style={{ backgroundColor: "#f8f9fa" }}>
          <Title order={5} mb="sm">
            История заказов: {row.original.product}
          </Title>
          {row.original.orders && row.original.orders.length > 0 ? (
            <MantineReactTable
              columns={orderColumns}
              data={row.original.orders}
              enableTopToolbar={false}
              enableBottomToolbar={false}
              enableColumnActions={false}
              enableSorting={false}
              mantineTableProps={{
                striped: true,
                withColumnBorders: true,
              }}
            />
          ) : (
            <Text c="dimmed">Нет заказов</Text>
          )}
        </Box>
      )}
      initialState={{
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
