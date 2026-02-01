import { useState, useRef, useEffect } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { TABLE_DATA } from "../constants";

export const MuiDataGridComponent = () => {
  const [rows, setRows] = useState(TABLE_DATA.slice(0, 20));
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 130 },
    { field: "label", headerName: "Label", width: 200 },
    { field: "date", headerName: "Date", width: 180 },
  ];

  useEffect(() => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

      if (bottom && !loadingRef.current && rows.length < TABLE_DATA.length) {
        loadingRef.current = true;
        setLoading(true);

        setTimeout(() => {
          const currentLength = rows.length;
          const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
          setRows((prev) => [...prev, ...moreData]);
          setLoading(false);
          loadingRef.current = false;
        }, 500);
      }
    };

    const scrollContainer = gridElement.querySelector(
      ".MuiDataGrid-virtualScroller",
    );
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [rows.length]);

  return (
    <div
      style={{ padding: "20px", height: "700px", width: "100%" }}
      ref={gridRef}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        hideFooter
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-virtualScroller": {
            overflowY: "auto",
          },
        }}
      />
      <div style={{ marginTop: "10px", color: "#666" }}>
        Showing {rows.length} of {TABLE_DATA.length} rows
      </div>
    </div>
  );
};
