import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { TABLE_DATA } from "../constants";

interface TableRow {
  id: number;
  label: string;
  date: string;
}

export const MaterialReactTableComponent = () => {
  const [data, setData] = useState<TableRow[]>(TABLE_DATA.slice(0, 20));
  const [isLoading, setIsLoading] = useState(false);
  const rowCount = 100;
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

  const fetchMoreOnBottomReached = (
    containerRefElement?: HTMLDivElement | null,
  ) => {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
      if (
        scrollHeight - scrollTop - clientHeight < 400 &&
        !isLoading &&
        data.length < rowCount
      ) {
        setIsLoading(true);
        setTimeout(() => {
          const currentLength = data.length;
          const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
          setData((prev) => [...prev, ...moreData]);
          setIsLoading(false);
        }, 500);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnResizing
        enableSorting
        enableColumnActions
        enableColumnFilters={false}
        enablePagination={false}
        enableRowVirtualization
        muiTableContainerProps={{
          sx: { maxHeight: "600px" },
          onScroll: (event) =>
            fetchMoreOnBottomReached(event.target as HTMLDivElement),
        }}
        muiTableBodyRowProps={{ hover: true }}
        state={{ isLoading, showProgressBars: isLoading }}
        renderBottomToolbarCustomActions={() => (
          <div style={{ padding: "8px" }}>
            Showing {data.length} of {rowCount} rows
          </div>
        )}
      />
    </div>
  );
};
