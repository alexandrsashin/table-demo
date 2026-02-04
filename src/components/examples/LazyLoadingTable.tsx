import { useMemo, useState, useRef, useEffect } from "react";
import { Button, Group, Text, Loader } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { TABLE_DATA } from "../../constants";

interface Product {
  id: number;
  label: string;
  category: string;
  subcategory: string;
  price: number;
}

const ITEMS_PER_PAGE = 15;
const STREAMING_INTERVAL = 150; // мс между записями при стриминге
const TOTAL_DATA = TABLE_DATA.slice(0, 100); // Используем 100 записей для демонстрации

export function LazyLoadingTable() {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef<number>(0);

  // Очистка интервала при размонтировании
  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "label",
        header: "Товар",
        size: 200,
      },
      {
        accessorKey: "category",
        header: "Категория",
        size: 150,
      },
      {
        accessorKey: "subcategory",
        header: "Подкатегория",
        size: 150,
      },
      {
        accessorKey: "price",
        header: "Цена",
        size: 120,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return value !== undefined && value !== null
            ? `₽${value.toFixed(2)}`
            : "—";
        },
      },
    ],
    [],
  );

  const startStreaming = () => {
    if (isStreaming) return;

    setIsStreaming(true);
    currentIndexRef.current = data.length;

    streamingIntervalRef.current = setInterval(() => {
      if (currentIndexRef.current >= TOTAL_DATA.length) {
        // Достигли конца данных
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setIsStreaming(false);
        setHasMore(false);
        return;
      }

      // Добавляем одну запись
      const newItem = TOTAL_DATA[currentIndexRef.current];
      setData((prev) => [...prev, newItem]);
      currentIndexRef.current += 1;
    }, STREAMING_INTERVAL);
  };

  const stopStreaming = () => {
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setIsStreaming(false);
  };

  const loadMoreData = () => {
    setIsLoading(true);

    // Имитируем задержку сети
    setTimeout(() => {
      const startIndex = data.length; // Используем текущую длину данных
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newData = TOTAL_DATA.slice(startIndex, endIndex);

      setData((prev) => [...prev, ...newData]);
      setHasMore(endIndex < TOTAL_DATA.length);
      setIsLoading(false);
    }, 800);
  };

  const resetData = () => {
    stopStreaming();
    setData([]);
    currentIndexRef.current = 0;
    setHasMore(true);
  };

  return (
    <div>
      <Group mb="md" justify="space-between">
        <Group>
          <Button
            onClick={isStreaming ? stopStreaming : startStreaming}
            disabled={!hasMore}
            color={isStreaming ? "red" : "blue"}
          >
            {isStreaming ? (
              <>
                <Loader size="xs" mr={8} color="white" />
                Остановить стриминг
              </>
            ) : hasMore ? (
              "Начать стриминг"
            ) : (
              "Все данные загружены"
            )}
          </Button>
          <Button
            onClick={loadMoreData}
            disabled={!hasMore || isLoading || isStreaming}
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader size="xs" mr={8} />
                Загрузка...
              </>
            ) : (
              "Загрузить порцию"
            )}
          </Button>
          <Button variant="outline" onClick={resetData} disabled={isLoading}>
            Сбросить
          </Button>
        </Group>
        <Text size="sm" c="dimmed">
          Загружено: {data.length} / {TOTAL_DATA.length}
          {isStreaming && " (стриминг...)"}
        </Text>
      </Group>

      <MantineReactTable
        columns={columns}
        data={data}
        enablePagination={false}
        enableBottomToolbar={false}
        enableSorting={true}
        mantineTableContainerProps={{
          sx: { maxHeight: "500px" },
        }}
        state={{
          showProgressBars: isLoading,
          sorting: [{ id: "id", desc: true }],
        }}
        initialState={{
          sorting: [{ id: "id", desc: true }],
        }}
      />
    </div>
  );
}
