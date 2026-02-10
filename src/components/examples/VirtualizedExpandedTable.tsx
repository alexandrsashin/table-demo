import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { Badge, Box, Text, Table } from "@mantine/core";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Virtualizer,
  type MRT_ExpandedState,
} from "mantine-react-table";

interface OrderDetail {
  orderId: string;
  customer: string;
  quantity: number;
  total: number;
  date: string;
  status: string;
}

interface ProductRow {
  id: number;
  product: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  orders: OrderDetail[];
}

// Генерируем большой набор данных для демонстрации виртуализации
function generateData(count: number): ProductRow[] {
  const categories = [
    "Электроника",
    "Одежда",
    "Книги",
    "Мебель",
    "Спорт",
    "Игрушки",
    "Продукты",
    "Авто",
  ];
  const products = [
    "Ноутбук",
    "Телефон",
    "Планшет",
    "Наушники",
    "Монитор",
    "Клавиатура",
    "Мышь",
    "Камера",
    "Колонка",
    "Роутер",
    "Принтер",
    "Сканер",
    "Проектор",
    "Микрофон",
    "Веб-камера",
  ];
  const customers = [
    "Иван Петров",
    "Мария Сидорова",
    "Алексей Смирнов",
    "Елена Иванова",
    "Дмитрий Козлов",
    "Ольга Новикова",
    "Сергей Волков",
    "Анна Морозова",
    "Павел Соколов",
    "Наталья Лебедева",
  ];
  const statuses = ["Доставлен", "В пути", "Обработка", "Отменён"];

  return Array.from({ length: count }, (_, i) => {
    const orderCount = Math.floor(Math.random() * 5) + 1;
    const price = Math.floor(Math.random() * 150000) + 1000;

    return {
      id: i + 1,
      product: `${products[i % products.length]} ${Math.floor(i / products.length) + 1}`,
      category: categories[i % categories.length],
      price,
      stock: Math.floor(Math.random() * 100),
      rating: +(Math.random() * 4 + 1).toFixed(1),
      orders: Array.from({ length: orderCount }, (_, j) => ({
        orderId: `ORD-${String(i * 10 + j + 1).padStart(4, "0")}`,
        customer: customers[Math.floor(Math.random() * customers.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        total: price * (Math.floor(Math.random() * 3) + 1),
        date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      })),
    };
  });
}

const LARGE_DATA = generateData(500);

const statusColor: Record<string, string> = {
  Доставлен: "green",
  "В пути": "blue",
  Обработка: "yellow",
  Отменён: "red",
};

function DetailPanel({ row }: { row: ProductRow }) {
  return (
    <Box p="md" style={{ backgroundColor: "#f8f9fa" }}>
      <Text fw={600} mb="xs">
        Заказы по товару: {row.product}
      </Text>
      <Table
        striped
        highlightOnHover
        withBorder
        withColumnBorders
        fontSize="sm"
      >
        <thead>
          <tr>
            <th>Номер заказа</th>
            <th>Покупатель</th>
            <th>Кол-во</th>
            <th>Сумма</th>
            <th>Дата</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {row.orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.customer}</td>
              <td>{order.quantity} шт.</td>
              <td>₽{order.total.toLocaleString("ru-RU")}</td>
              <td>{order.date}</td>
              <td>
                <Badge
                  color={statusColor[order.status] ?? "gray"}
                  variant="filled"
                  size="sm"
                >
                  {order.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

export function VirtualizedExpandedTable() {
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  // Первые 20 строк раскрыты по умолчанию
  const initialExpanded: Record<string, boolean> = {};
  for (let i = 0; i < 20; i++) {
    initialExpanded[String(i)] = true;
  }

  const [expanded, setExpanded] = useState<MRT_ExpandedState>(initialExpanded);

  // При изменении expanded пересчитываем все размеры виртуализатора,
  // чтобы он корректно учитывал высоту раскрытых detail panel
  const handleExpandedChange = useCallback(
    (
      updater:
        | MRT_ExpandedState
        | ((old: MRT_ExpandedState) => MRT_ExpandedState),
    ) => {
      setExpanded(updater);
    },
    [],
  );

  useEffect(() => {
    const inst = rowVirtualizerInstanceRef.current;
    const virtualizer = inst as unknown as { measure?: () => void } | null;
    if (virtualizer && typeof virtualizer.measure === "function") {
      // Даём DOM обновиться, затем пересчитываем высоты
      requestAnimationFrame(() => {
        virtualizer.measure!();
      });
    }
  }, [expanded]);

  const columns = useMemo<MRT_ColumnDef<ProductRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 70,
      },
      {
        accessorKey: "product",
        header: "Товар",
        size: 220,
      },
      {
        accessorKey: "category",
        header: "Категория",
        size: 140,
        Cell: ({ cell }) => (
          <Badge variant="light" color="violet">
            {cell.getValue<string>()}
          </Badge>
        ),
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
        size: 110,
        Cell: ({ cell }) => {
          const val = cell.getValue<number>();
          return (
            <Badge color={val > 50 ? "green" : val > 10 ? "yellow" : "red"}>
              {val} шт.
            </Badge>
          );
        },
      },
      {
        accessorKey: "rating",
        header: "Рейтинг",
        size: 100,
        Cell: ({ cell }) => {
          const val = cell.getValue<number>();
          return (
            <Text
              fw={600}
              color={val >= 4 ? "green" : val >= 3 ? "yellow" : "red"}
            >
              ★ {val}
            </Text>
          );
        },
      },
    ],
    [],
  );

  return (
    <MantineReactTable
      columns={columns}
      data={LARGE_DATA}
      enableExpanding
      enablePagination={false}
      enableRowVirtualization
      enableColumnActions={false}
      renderDetailPanel={({ row }) => <DetailPanel row={row.original} />}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerProps={{
        overscan: 5,
        measureElement:
          typeof window !== "undefined" &&
          navigator.userAgent.indexOf("Firefox") === -1
            ? (element) => element?.getBoundingClientRect().height
            : undefined,
      }}
      onExpandedChange={handleExpandedChange}
      state={{
        expanded,
        density: "xs",
      }}
      mantineTableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
        striped: true,
      }}
      mantineTableContainerProps={{
        sx: { maxHeight: "700px", minHeight: "700px" },
      }}
    />
  );
}
