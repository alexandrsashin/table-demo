import { useState, useCallback, useRef } from "react";
import { TABLE_DATA } from "../constants";
import "./SimpleTable.css";

interface Row {
  id: number;
  label: string;
  date: string;
}

type SortConfig = {
  key: keyof Row;
  direction: "asc" | "desc";
} | null;

export const SimpleTable = () => {
  const [rows, setRows] = useState<Row[]>(TABLE_DATA.slice(0, 20));
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleSort = (key: keyof Row) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
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
    },
    [rows.length],
  );

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

  const getSortIndicator = (key: keyof Row) => {
    if (!sortConfig || sortConfig.key !== key) return " ⬍";
    return sortConfig.direction === "asc" ? " 🔼" : " 🔽";
  };

  const columns = [
    { key: "id" as keyof Row, label: "ID" },
    { key: "label" as keyof Row, label: "Label" },
    { key: "date" as keyof Row, label: "Date" },
  ];

  return (
    <div className="simple-table-container">
      <div className="controls">
        <h3>Column Visibility</h3>
        <div className="checkbox-group">
          {columns.map((col) => (
            <label key={col.key}>
              <input
                type="checkbox"
                checked={!hiddenColumns.has(col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              {col.label}
            </label>
          ))}
        </div>
      </div>

      <div className="table-wrapper" onScroll={handleScroll} ref={tableRef}>
        <table>
          <thead>
            <tr>
              {columns
                .filter((col) => !hiddenColumns.has(col.key))
                .map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    <div className="sortable">
                      {col.label}
                      {getSortIndicator(col.key)}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id}>
                {columns
                  .filter((col) => !hiddenColumns.has(col.key))
                  .map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="loader">
          {isLoading
            ? "Loading more..."
            : rows.length < TABLE_DATA.length
              ? "Scroll for more..."
              : "All data loaded"}
        </div>
      </div>
      <div style={{ marginTop: "10px", color: "#666" }}>
        Showing {rows.length} of {TABLE_DATA.length} rows
        {isLoading && " - Loading more..."}
      </div>
    </div>
  );
};
