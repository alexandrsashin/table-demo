import { useMemo } from "react";
import { Tooltip } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { IconInfoCircle } from "@tabler/icons-react";
import { TABLE_DATA } from "../../constants";

interface TableRow {
  id: number;
  label: string;
  date: string;
}

export function AdvancedMantineTable() {
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
