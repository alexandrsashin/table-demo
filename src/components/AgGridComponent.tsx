import { useState, useRef, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  type ColDef,
  type GridApi,
} from "ag-grid-community";
import { TABLE_DATA } from "../constants";

// Регистрируем все Community модули
ModuleRegistry.registerModules([AllCommunityModule]);

export const AgGridComponent = () => {
  const [rowData, setRowData] = useState(TABLE_DATA.slice(0, 20));
  const loadingRef = useRef(false);
  const gridApiRef = useRef<GridApi | null>(null);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        sortable: true,
        filter: true,
        width: 120,
      },
      {
        field: "label",
        headerName: "Label",
        sortable: true,
        filter: true,
        width: 200,
      },
      {
        field: "date",
        headerName: "Date",
        sortable: true,
        filter: true,
        width: 180,
      },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        !gridApiRef.current ||
        loadingRef.current ||
        rowData.length >= TABLE_DATA.length
      ) {
        return;
      }

      const scrollPosition = gridApiRef.current.getVerticalPixelRange();
      const scrollableHeight = scrollPosition.bottom - scrollPosition.top;
      const currentScroll = scrollPosition.bottom;
      const maxScroll = gridApiRef.current.getDisplayedRowCount() * 50; // приблизительная высота строки

      if (currentScroll >= maxScroll - scrollableHeight - 200) {
        loadingRef.current = true;
        setTimeout(() => {
          const currentLength = rowData.length;
          const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
          setRowData((prev) => [...prev, ...moreData]);
          loadingRef.current = false;
        }, 500);
      }
    };

    const interval = setInterval(handleScroll, 200);
    return () => clearInterval(interval);
  }, [rowData.length]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ height: "600px", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          onGridReady={(params) => {
            gridApiRef.current = params.api;
          }}
          onBodyScroll={() => {
            // Trigger проверки при скролле
          }}
        />
      </div>
      <div style={{ marginTop: "10px", color: "#666" }}>
        Showing {rowData.length} of {TABLE_DATA.length} rows
      </div>
    </div>
  );
};
