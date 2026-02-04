import { useMemo } from "react";
import { Tooltip, Badge } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { IconInfoCircle } from "@tabler/icons-react";

interface TableRow {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "pending";
  salary: number;
  hireDate: string;
  location: string;
  phone: string;
}

const sampleData: TableRow[] = [
  {
    id: 1,
    name: "Иван Петров",
    email: "ivan.petrov@company.com",
    department: "Разработка",
    position: "Senior Developer",
    status: "active",
    salary: 150000,
    hireDate: "2020-03-15",
    location: "Москва",
    phone: "+7 (999) 123-45-67",
  },
  {
    id: 2,
    name: "Мария Сидорова",
    email: "maria.sidorova@company.com",
    department: "Маркетинг",
    position: "Marketing Manager",
    status: "active",
    salary: 120000,
    hireDate: "2021-06-20",
    location: "Санкт-Петербург",
    phone: "+7 (999) 234-56-78",
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    email: "alexey.smirnov@company.com",
    department: "HR",
    position: "HR Specialist",
    status: "pending",
    salary: 90000,
    hireDate: "2023-01-10",
    location: "Москва",
    phone: "+7 (999) 345-67-89",
  },
  {
    id: 4,
    name: "Елена Иванова",
    email: "elena.ivanova@company.com",
    department: "Разработка",
    position: "Team Lead",
    status: "active",
    salary: 180000,
    hireDate: "2019-11-05",
    location: "Москва",
    phone: "+7 (999) 456-78-90",
  },
  {
    id: 5,
    name: "Дмитрий Козлов",
    email: "dmitry.kozlov@company.com",
    department: "Продажи",
    position: "Sales Manager",
    status: "inactive",
    salary: 110000,
    hireDate: "2022-04-12",
    location: "Казань",
    phone: "+7 (999) 567-89-01",
  },
];

export function AdvancedMantineTable() {
  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        enableHiding: false,
        enableColumnOrdering: false,
        enableResizing: true,
      },
      {
        accessorKey: "name",
        header: "Имя",
        size: 180,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
        Header: () => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Имя</span>
            <Tooltip label="Полное имя сотрудника">
              <IconInfoCircle size={16} style={{ cursor: "help" }} />
            </Tooltip>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 220,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
      },
      {
        accessorKey: "department",
        header: "Отдел",
        size: 150,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
      },
      {
        accessorKey: "position",
        header: "Должность",
        size: 180,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
      },
      {
        accessorKey: "status",
        header: "Статус",
        size: 120,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          return (
            <Badge
              color={
                status === "active"
                  ? "green"
                  : status === "inactive"
                    ? "red"
                    : "yellow"
              }
              variant="filled"
            >
              {status === "active"
                ? "Активен"
                : status === "inactive"
                  ? "Неактивен"
                  : "Ожидание"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "salary",
        header: "Зарплата",
        size: 140,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return `₽${value.toLocaleString("ru-RU")}`;
        },
      },
      {
        accessorKey: "hireDate",
        header: "Дата найма",
        size: 130,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
      },
      {
        accessorKey: "location",
        header: "Город",
        size: 150,
        enableResizing: true,
        enableHiding: true,
        enableColumnOrdering: true,
      },
      {
        accessorKey: "phone",
        header: "Телефон",
        size: 160,
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
      data={sampleData}
      enableColumnOrdering
      enableColumnResizing
      enablePinning
      enableSorting
      enableColumnActions
      enableHiding
      initialState={{
        density: "xs",
        pagination: { pageSize: 20, pageIndex: 0 },
        columnPinning: {
          left: ["id"],
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
      enableColumnDragging
      columnResizeMode="onChange"
    />
  );
}
