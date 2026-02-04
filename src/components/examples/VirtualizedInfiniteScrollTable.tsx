import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Loader, Center, Text } from "@mantine/core";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Virtualizer,
} from "mantine-react-table";
import { TABLE_DATA } from "../../constants";

interface TableRow {
  id: number;
  label: string;
  date: string;
}

export function VirtualizedInfiniteScrollTable() {
  const [data, setData] = useState<TableRow[]>(() => TABLE_DATA.slice(0, 50));
  const [isLoading, setIsLoading] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "label",
        header: "Label",
        size: 200,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
    ],
    [],
  );

  // Функция для загрузки дополнительных данных
  const fetchMoreData = useCallback(() => {
    if (isLoading || data.length >= TABLE_DATA.length) return;

    setIsLoading(true);

    // Симулируем задержку сети
    setTimeout(() => {
      const currentLength = data.length;
      const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
      setData((prev) => [...prev, ...moreData]);
      setIsLoading(false);
    }, 500);
  }, [data.length, isLoading]);

  // Отслеживание скролла для бесконечной загрузки
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      // Загружаем новые данные когда пользователь приближается к концу (за 200px)
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        !isLoading &&
        data.length < TABLE_DATA.length
      ) {
        fetchMoreData();
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      const scrollContainer = tableContainer.querySelector(
        ".mantine-TableContainer-root",
      );
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        return () =>
          scrollContainer.removeEventListener("scroll", handleScroll);
      }
    }
  }, [fetchMoreData, isLoading, data.length]);

  return (
    <>
      <MantineReactTable
        columns={columns}
        data={data}
        enableBottomToolbar={false}
        enableGlobalFilterModes
        enablePagination={false} // Отключаем пагинацию для бесконечного скролла
        enableRowVirtualization // Включаем виртуализацию строк
        mantineTableContainerProps={{
          ref: tableContainerRef,
          sx: { maxHeight: "600px", minHeight: "600px" },
        }}
        mantineTableProps={{
          highlightOnHover: true,
          withColumnBorders: true,
          striped: true,
        }}
        rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
        rowVirtualizerProps={{ overscan: 10 }}
        state={{
          isLoading: false,
        }}
      />
      {isLoading && (
        <Center mt="md">
          <Loader size="sm" />
          <Text size="sm" ml="sm" c="dimmed">
            Загрузка данных... ({data.length} из {TABLE_DATA.length})
          </Text>
        </Center>
      )}
      {data.length >= TABLE_DATA.length && (
        <Center mt="md">
          <Text size="sm" c="dimmed">
            Все данные загружены ({TABLE_DATA.length} записей)
          </Text>
        </Center>
      )}
    </>
  );
}
