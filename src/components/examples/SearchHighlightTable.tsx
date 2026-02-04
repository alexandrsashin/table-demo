import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Button, Group, TextInput, Stack } from "@mantine/core";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Virtualizer,
} from "mantine-react-table";

interface Product {
  id: number;
  label: string;
  category: string;
  subcategory: string;
  price: number;
}

const initialData: Product[] = [
  {
    id: 1,
    label: "Смартфон Samsung Galaxy",
    category: "Электроника",
    subcategory: "Телефоны",
    price: 45000,
  },
  {
    id: 2,
    label: "Ноутбук Lenovo ThinkPad",
    category: "Компьютеры",
    subcategory: "Ноутбуки",
    price: 75000,
  },
  {
    id: 3,
    label: "Наушники Sony WH-1000XM4",
    category: "Аудио",
    subcategory: "Наушники",
    price: 25000,
  },
  {
    id: 4,
    label: "Клавиатура Logitech MX Keys",
    category: "Периферия",
    subcategory: "Клавиатуры",
    price: 8500,
  },
  {
    id: 5,
    label: "Монитор Dell UltraSharp",
    category: "Компьютеры",
    subcategory: "Мониторы",
    price: 32000,
  },
];

export function SearchHighlightTable() {
  const [data, setData] = useState<Product[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_Virtualizer>(null);

  useEffect(() => {
    if (highlightedRowId !== null) {
      const timer = setTimeout(() => {
        setHighlightedRowId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightedRowId]);

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightText = useCallback(
    (text: string | number | null | undefined, query: string) => {
      if (!text || !query.trim()) {
        return <span>{text?.toString() || ""}</span>;
      }

      const textStr = text.toString();
      const escapedQuery = escapeRegExp(query);
      const parts = textStr.split(new RegExp(`(${escapedQuery})`, "gi"));
      return (
        <span>
          {parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark
                key={index}
                style={{
                  backgroundColor: "#ffd700",
                  padding: "0 2px",
                  borderRadius: "2px",
                }}
              >
                {part}
              </mark>
            ) : (
              part
            ),
          )}
        </span>
      );
    },
    [],
  );

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        Cell: ({ cell }) => highlightText(cell.getValue<number>(), searchQuery),
      },
      {
        accessorKey: "label",
        header: "Товар",
        size: 250,
        Cell: ({ cell }) => highlightText(cell.getValue<string>(), searchQuery),
      },
      {
        accessorKey: "category",
        header: "Категория",
        size: 150,
        Cell: ({ cell }) => highlightText(cell.getValue<string>(), searchQuery),
      },
      {
        accessorKey: "subcategory",
        header: "Подкатегория",
        size: 150,
        Cell: ({ cell }) => highlightText(cell.getValue<string>(), searchQuery),
      },
      {
        accessorKey: "price",
        header: "Цена",
        size: 120,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          const priceText =
            value !== undefined && value !== null
              ? `₽${value.toFixed(2)}`
              : "—";
          return highlightText(priceText, searchQuery);
        },
      },
    ],
    [searchQuery, highlightText],
  );

  const addNewRow = () => {
    const newId = Math.max(...data.map((item) => item.id)) + 1;
    const newRow: Product = {
      id: newId,
      label: `Новый товар ${newId}`,
      category: "Электроника",
      subcategory: "Гаджеты",
      price: Math.random() * 10000,
    };

    setData((prev) => [...prev, newRow]);

    // Устанавливаем подсветку сразу
    setTimeout(() => {
      setHighlightedRowId(newId);

      // Скроллим к новой строке
      const newRowIndex = data.length;
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(newRowIndex, {
        align: "center",
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <Stack spacing="md">
      <Group>
        <TextInput
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
        />
        <Button onClick={addNewRow}>Добавить запись</Button>
      </Group>

      <MantineReactTable
        columns={columns}
        data={data}
        enableRowVirtualization
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
        rowVirtualizerProps={{
          overscan: 10,
        }}
        mantineTableContainerProps={{
          sx: { maxHeight: "500px" },
        }}
        mantineTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor:
              row.original.id === highlightedRowId
                ? "#90EE90 !important"
                : undefined,
            transition: "background-color 0.5s ease-in-out",
          },
        })}
        enablePagination={false}
        enableBottomToolbar={false}
      />
    </Stack>
  );
}
