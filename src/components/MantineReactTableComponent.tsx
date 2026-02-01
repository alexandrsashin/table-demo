import { useMemo, useState, useEffect, useRef } from "react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { MantineProvider } from "@mantine/core";
import { TABLE_DATA } from "../constants";

interface TableRow {
  id: number;
  label: string;
  date: string;
}

export const MantineReactTableComponent = () => {
  const [data, setData] = useState<TableRow[]>(TABLE_DATA.slice(0, 20));
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
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

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (bottom && !loadingRef.current && data.length < TABLE_DATA.length) {
        loadingRef.current = true;
        setIsLoading(true);

        setTimeout(() => {
          const currentLength = data.length;
          const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
          setData((prev) => [...prev, ...moreData]);
          setIsLoading(false);
          loadingRef.current = false;
        }, 300);
      }
    };

    const findScrollContainer = () => {
      const container = tableContainerRef.current;
      if (!container) return null;

      // Пытаемся найти различные возможные scroll контейнеры
      const selectors = [
        ".mantine-ScrollArea-viewport",
        ".mantine-Table-root",
        "[data-with-table-border]",
        'div[style*="overflow"]',
        'div[style*="max-height"]',
      ];

      for (const selector of selectors) {
        const elements = container.querySelectorAll(selector);
        for (const el of Array.from(elements)) {
          const styles = window.getComputedStyle(el as HTMLElement);
          if (
            styles.overflow === "auto" ||
            styles.overflowY === "auto" ||
            styles.overflow === "scroll" ||
            styles.overflowY === "scroll"
          ) {
            return el;
          }
        }
      }

      // Если не нашли, используем document для наблюдения за всеми скроллами в контейнере
      return container;
    };

    const scrollContainer = findScrollContainer();
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [data.length]);

  // Дополнительный механизм - проверка при изменении данных
  useEffect(() => {
    if (data.length >= TABLE_DATA.length) {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [data.length]);

  return (
    <MantineProvider>
      <div style={{ padding: "20px" }} ref={tableContainerRef}>
        <MantineReactTable
          columns={columns}
          data={data}
          enableColumnResizing
          enableSorting
          enableColumnActions
          enablePagination={false}
          enableBottomToolbar={false}
          mantineTableContainerProps={{
            style: { maxHeight: "600px" },
          }}
          state={{ isLoading }}
        />
        <div style={{ marginTop: "10px", color: "#666" }}>
          Showing {data.length} of {TABLE_DATA.length} rows
          {isLoading && " - Loading more..."}
        </div>
      </div>
    </MantineProvider>
  );
};
