import { useState, useEffect } from "react";
import { TABLE_DATA } from "../constants";
import "./ReactAdminComponent.css";

interface TableRow {
  id: number;
  label: string;
  date: string;
}

export const ReactAdminComponent = () => {
  const [rows, setRows] = useState<TableRow[]>(TABLE_DATA.slice(0, 20));
  const [sortField, setSortField] = useState<keyof TableRow | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof TableRow) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      const bottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

      if (bottom && rows.length < TABLE_DATA.length) {
        const currentLength = rows.length;
        const moreData = TABLE_DATA.slice(currentLength, currentLength + 20);
        setRows((prev) => [...prev, ...moreData]);
      }
    };

    const container = document.querySelector(".react-admin-scroll");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [rows.length]);

  return (
    <div className="react-admin-container">
      <h3>React Admin Style Table</h3>
      <div className="react-admin-scroll">
        <table className="react-admin-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID {sortField === "id" && (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
              <th onClick={() => handleSort("label")}>
                Label{" "}
                {sortField === "label" && (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
              <th onClick={() => handleSort("date")}>
                Date{" "}
                {sortField === "date" && (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.label}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "10px", color: "#666" }}>
        Showing {rows.length} of {TABLE_DATA.length} rows
      </div>
    </div>
  );
};
