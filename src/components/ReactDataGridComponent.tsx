import { useState, useCallback, useRef, useEffect } from "react";
import { DataGrid, type Column, type SortColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { TABLE_DATA } from "../constants";
import "./ReactDataGridComponent.css";

interface Row {
  id: number;
  label: string;
  date: string;
}

export const ReactDataGridComponent = () => {
  const [rows, setRows] = useState<Row[]>(TABLE_DATA.slice(0, 20));
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const columns: Column<Row>[] = [
    { key: "id", name: "ID", resizable: true, sortable: true },
    { key: "label", name: "Label", resizable: true, sortable: true },
    { key: "date", name: "Date", resizable: true, sortable: true },
  ].filter((col) => !hiddenColumns.has(col.key));

  const sortedRows = [...rows].sort((a, b) => {
    for (const sort of sortColumns) {
      const aValue = a[sort.columnKey as keyof Row];
      const bValue = b[sort.columnKey as keyof Row];
      if (aValue < bValue) return sort.direction === "ASC" ? -1 : 1;
      if (aValue > bValue) return sort.direction === "ASC" ? 1 : -1;
    }
    return 0;
  });

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

      if (bottom && !loadingRef.current && rows.length < TABLE_DATA.length) {
        loadingRef.current = true;
        setIsLoading(true);
        setTimeout(() => {
          const currentLength = rows.length;
          const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
          setRows((prev) => [...prev, ...moreData]);
          loadingRef.current = false;
          setIsLoading(false);
        }, 300);
      }
    };

    const container = containerRef.current;
    if (container) {
      // Ищем div с классом rdg который содержит скролл
      const scrollElement = container.querySelector(
        '.rdg-viewport, .rdg, [role="grid"]',
      );
      if (scrollElement) {
        scrollElement.addEventListener("scroll", handleScroll);
        return () => scrollElement.removeEventListener("scroll", handleScroll);
      }
    }
  }, [rows.length]);

  const toggleColumn = (columnKey: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  };

  return (
    <div className="react-data-grid-container">
      <div className="controls">
        <h3>Column Visibility</h3>
        <div className="checkbox-group">
          {["id", "label", "date"].map((col) => (
            <label key={col}>
              <input
                type="checkbox"
                checked={!hiddenColumns.has(col)}
                onChange={() => toggleColumn(col)}
              />
              {col}
            </label>
          ))}
        </div>
      </div>
      <div ref={containerRef} style={{ height: "600px", overflow: "auto" }}>
        <DataGrid
          columns={columns}
          rows={sortedRows}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          className="rdg-light"
          style={{ height: "100%" }}
        />
      </div>
      <div style={{ marginTop: "10px", color: "#666" }}>
        Showing {rows.length} of {TABLE_DATA.length} rows
        {isLoading && " - Loading more..."}
      </div>
    </div>
  );
};
