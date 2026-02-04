import { useMemo, useState } from "react";
import { Badge, Text } from "@mantine/core";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";

interface DynamicRow {
  id: number;
  task: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "positive" | "warning" | "negative";
  assignee: string;
  dueDate: string;
}

const initialData: DynamicRow[] = [
  {
    id: 1,
    task: "Разработать новую фичу",
    description:
      "Необходимо реализовать систему уведомлений для пользователей с возможностью настройки параметров отправки",
    priority: "high",
    status: "warning",
    assignee: "Иван Петров",
    dueDate: "2024-02-15",
  },
  {
    id: 2,
    task: "Исправить критический баг",
    description: "Ошибка в модуле авторизации, блокирующая вход пользователей",
    priority: "high",
    status: "negative",
    assignee: "Мария Сидорова",
    dueDate: "2024-02-10",
  },
  {
    id: 3,
    task: "Обновить документацию",
    description:
      "Добавить описание новых API endpoints и примеры использования",
    priority: "low",
    status: "positive",
    assignee: "Алексей Смирнов",
    dueDate: "2024-02-20",
  },
  {
    id: 4,
    task: "Провести код-ревью",
    description: "Проверить PR #245 с изменениями в архитектуре базы данных",
    priority: "medium",
    status: "warning",
    assignee: "Елена Иванова",
    dueDate: "2024-02-12",
  },
  {
    id: 5,
    task: "Оптимизировать запросы",
    description:
      "Улучшить производительность страницы отчетов. Текущее время загрузки составляет более 5 секунд, необходимо снизить до 2 секунд",
    priority: "medium",
    status: "positive",
    assignee: "Дмитрий Козлов",
    dueDate: "2024-02-18",
  },
  {
    id: 6,
    task: "Настроить CI/CD",
    description: "Автоматизировать процесс деплоя на staging окружение",
    priority: "high",
    status: "warning",
    assignee: "Ольга Новикова",
    dueDate: "2024-02-14",
  },
  {
    id: 7,
    task: "Написать unit тесты",
    description: "Покрыть тестами новый модуль оплаты",
    priority: "medium",
    status: "positive",
    assignee: "Сергей Волков",
    dueDate: "2024-02-16",
  },
  {
    id: 8,
    task: "Обновить зависимости",
    description:
      "Обновить все npm пакеты до последних версий и проверить совместимость",
    priority: "low",
    status: "negative",
    assignee: "Анна Морозова",
    dueDate: "2024-02-25",
  },
];

export function DynamicRowsTable() {
  const [data, setData] = useState<DynamicRow[]>(initialData);

  const columns = useMemo<MRT_ColumnDef<DynamicRow>[]>(
    () => [
      {
        accessorKey: "task",
        header: "Задача",
        size: 200,
      },
      {
        accessorKey: "description",
        header: "Описание",
        size: 300,
        Cell: ({ cell }) => (
          <Text size="sm" style={{ whiteSpace: "normal", lineHeight: 1.5 }}>
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "priority",
        header: "Приоритет",
        size: 120,
        Cell: ({ cell }) => (
          <Badge
            color={
              cell.getValue<string>() === "high"
                ? "red"
                : cell.getValue<string>() === "medium"
                  ? "yellow"
                  : "gray"
            }
            variant="filled"
          >
            {cell.getValue<string>() === "high"
              ? "Высокий"
              : cell.getValue<string>() === "medium"
                ? "Средний"
                : "Низкий"}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Статус",
        size: 120,
        Cell: ({ cell }) => (
          <Badge
            color={
              cell.getValue<string>() === "positive"
                ? "green"
                : cell.getValue<string>() === "warning"
                  ? "orange"
                  : "red"
            }
            variant="light"
          >
            {cell.getValue<string>() === "positive"
              ? "В норме"
              : cell.getValue<string>() === "warning"
                ? "Внимание"
                : "Проблема"}
          </Badge>
        ),
      },
      {
        accessorKey: "assignee",
        header: "Исполнитель",
        size: 150,
      },
      {
        accessorKey: "dueDate",
        header: "Срок",
        size: 120,
      },
    ],
    [],
  );

  return (
    <MantineReactTable
      columns={columns}
      data={data}
      enableRowOrdering
      enableSorting={false}
      mantineRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const { draggingRow, hoveredRow } = table.getState();
          if (hoveredRow && draggingRow) {
            const newData = [...data];
            const draggedItem = newData.splice(
              (draggingRow as MRT_Row<DynamicRow>).index,
              1,
            )[0];
            newData.splice(
              (hoveredRow as MRT_Row<DynamicRow>).index,
              0,
              draggedItem,
            );
            setData(newData);
          }
        },
      })}
      mantineTableBodyRowProps={({ row }) => ({
        style: {
          backgroundColor:
            row.original.status === "positive"
              ? "#a8e6a1"
              : row.original.status === "warning"
                ? "#ffe69c"
                : row.original.status === "negative"
                  ? "#f5a9b0"
                  : undefined,
        },
      })}
      mantineTableProps={{
        highlightOnHover: false,
        withColumnBorders: true,
      }}
      mantineTableContainerProps={{
        sx: { maxHeight: "600px" },
      }}
      initialState={{
        density: "comfortable",
      }}
      defaultColumn={{
        minSize: 100,
      }}
    />
  );
}
