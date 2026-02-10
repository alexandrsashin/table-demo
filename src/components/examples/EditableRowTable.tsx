import { useMemo, useState, useCallback } from "react";
import {
  Badge,
  Button,
  Group,
  Text,
  Notification,
  Transition,
} from "@mantine/core";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from "mantine-react-table";
import { IconCheck, IconX, IconRefresh } from "@tabler/icons-react";

type EmployeeStatus = "active" | "onLeave" | "fired";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
  hireDate: string;
}

const initialData: Employee[] = [
  {
    id: 1,
    name: "Иван Петров",
    position: "Senior Developer",
    department: "Разработка",
    salary: 180000,
    status: "active",
    hireDate: "2020-03-15",
  },
  {
    id: 2,
    name: "Мария Сидорова",
    position: "Product Manager",
    department: "Управление",
    salary: 160000,
    status: "active",
    hireDate: "2021-06-10",
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    position: "Junior Developer",
    department: "Разработка",
    salary: 80000,
    status: "onLeave",
    hireDate: "2023-01-20",
  },
  {
    id: 4,
    name: "Елена Иванова",
    position: "Team Lead",
    department: "Разработка",
    salary: 220000,
    status: "active",
    hireDate: "2019-11-05",
  },
  {
    id: 5,
    name: "Дмитрий Козлов",
    position: "Designer",
    department: "Дизайн",
    salary: 130000,
    status: "active",
    hireDate: "2022-04-12",
  },
  {
    id: 6,
    name: "Ольга Новикова",
    position: "QA Engineer",
    department: "Тестирование",
    salary: 110000,
    status: "fired",
    hireDate: "2021-08-03",
  },
  {
    id: 7,
    name: "Сергей Волков",
    position: "DevOps Engineer",
    department: "Инфраструктура",
    salary: 190000,
    status: "active",
    hireDate: "2020-09-22",
  },
  {
    id: 8,
    name: "Анна Морозова",
    position: "HR Specialist",
    department: "HR",
    salary: 95000,
    status: "active",
    hireDate: "2022-02-14",
  },
  {
    id: 9,
    name: "Павел Соколов",
    position: "Data Analyst",
    department: "Аналитика",
    salary: 140000,
    status: "onLeave",
    hireDate: "2021-12-01",
  },
  {
    id: 10,
    name: "Наталья Лебедева",
    position: "Backend Developer",
    department: "Разработка",
    salary: 170000,
    status: "active",
    hireDate: "2020-07-18",
  },
];

const statusLabels: Record<EmployeeStatus, string> = {
  active: "Активен",
  onLeave: "В отпуске",
  fired: "Уволен",
};

const statusColors: Record<EmployeeStatus, string> = {
  active: "green",
  onLeave: "yellow",
  fired: "red",
};

const departmentOptions = [
  "Разработка",
  "Управление",
  "Дизайн",
  "Тестирование",
  "Инфраструктура",
  "HR",
  "Аналитика",
];

const statusOptions: EmployeeStatus[] = ["active", "onLeave", "fired"];

/** Имитация обращения к API — с задержкой и шансом ошибки */
function fakeApiUpdate(
  row: Employee,
): Promise<{ success: boolean; data: Employee }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 10% шанс ошибки для демонстрации обработки
      if (Math.random() < 0.1) {
        reject(new Error("Ошибка сервера. Попробуйте снова."));
      } else {
        resolve({ success: true, data: row });
      }
    }, 600);
  });
}

interface SaveNotification {
  id: number;
  message: string;
  color: string;
}

export function EditableRowTable() {
  const [data, setData] = useState<Employee[]>(initialData);
  const [savingRowId, setSavingRowId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<SaveNotification[]>([]);
  const [history, setHistory] = useState<Employee[][]>([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addNotification = useCallback((message: string, color: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, color }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const pushHistory = useCallback(
    (newData: Employee[]) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newData]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(history[newIndex]);
      addNotification("Отмена: данные восстановлены", "blue");
    }
  }, [historyIndex, history, addNotification]);

  const handleReset = useCallback(() => {
    setData(initialData);
    setHistory([initialData]);
    setHistoryIndex(0);
    addNotification("Все данные сброшены к начальному состоянию", "gray");
  }, [addNotification]);

  // Обработка сохранения отредактированной строки
  const handleSaveRow: MRT_TableOptions<Employee>["onEditingRowSave"] = async ({
    exitEditingMode,
    row,
    values,
  }) => {
    const updatedRow: Employee = {
      ...row.original,
      name: values.name,
      position: values.position,
      department: values.department,
      salary: Number(values.salary),
      status: values.status as EmployeeStatus,
      hireDate: values.hireDate,
    };

    setSavingRowId(row.original.id);

    try {
      await fakeApiUpdate(updatedRow);

      const newData = data.map((d) =>
        d.id === updatedRow.id ? updatedRow : d,
      );
      setData(newData);
      pushHistory(newData);
      addNotification(
        `✓ Строка #${updatedRow.id} (${updatedRow.name}) обновлена`,
        "green",
      );
      exitEditingMode();
    } catch (err) {
      addNotification(
        `✗ Ошибка при сохранении строки #${updatedRow.id}: ${(err as Error).message}`,
        "red",
      );
    } finally {
      setSavingRowId(null);
    }
  };

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
        enableEditing: false,
      },
      {
        accessorKey: "name",
        header: "Имя",
        size: 180,
      },
      {
        accessorKey: "position",
        header: "Должность",
        size: 170,
      },
      {
        accessorKey: "department",
        header: "Отдел",
        size: 150,
        editVariant: "select",
        mantineEditSelectProps: {
          data: departmentOptions,
        },
      },
      {
        accessorKey: "salary",
        header: "Зарплата",
        size: 130,
        Cell: ({ cell }) =>
          `₽${cell.getValue<number>().toLocaleString("ru-RU")}`,
        mantineEditTextInputProps: {
          type: "number",
        },
      },
      {
        accessorKey: "status",
        header: "Статус",
        size: 130,
        Cell: ({ cell }) => {
          const val = cell.getValue<EmployeeStatus>();
          return (
            <Badge color={statusColors[val]} variant="filled">
              {statusLabels[val]}
            </Badge>
          );
        },
        editVariant: "select",
        mantineEditSelectProps: {
          data: statusOptions.map((s) => ({
            value: s,
            label: statusLabels[s],
          })),
        },
      },
      {
        accessorKey: "hireDate",
        header: "Дата найма",
        size: 130,
        mantineEditTextInputProps: {
          type: "date",
        },
      },
    ],
    [],
  );

  return (
    <>
      {/* Уведомления */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
        }}
      >
        {notifications.map((n) => (
          <Transition key={n.id} mounted transition="slide-left" duration={300}>
            {(styles) => (
              <Notification
                style={styles}
                color={n.color}
                onClose={() =>
                  setNotifications((prev) => prev.filter((x) => x.id !== n.id))
                }
              >
                {n.message}
              </Notification>
            )}
          </Transition>
        ))}
      </div>

      <Group mb="sm" spacing="xs">
        <Button
          size="xs"
          variant="light"
          leftIcon={<IconRefresh size={14} />}
          onClick={handleUndo}
          disabled={historyIndex <= 0}
        >
          Отменить последнее изменение
        </Button>
        <Button size="xs" variant="subtle" color="gray" onClick={handleReset}>
          Сбросить всё
        </Button>
        <Text size="xs" c="dimmed" ml="auto">
          Изменений: {historyIndex}
        </Text>
      </Group>

      <MantineReactTable
        columns={columns}
        data={data}
        editDisplayMode="row"
        enableEditing
        onEditingRowSave={handleSaveRow}
        renderRowActions={({ row, table }) => {
          const isEditing = table.getState().editingRow?.id === row.id;
          const isSaving = savingRowId === row.original.id;

          if (isEditing) {
            return (
              <Group spacing={4} noWrap>
                <Button
                  size="xs"
                  compact
                  color="green"
                  variant="filled"
                  loading={isSaving}
                  onClick={() => {
                    table.options.onEditingRowSave?.({
                      exitEditingMode: () => table.setEditingRow(null),
                      row,
                      table,
                      values: row._valuesCache,
                    });
                  }}
                  leftIcon={<IconCheck size={14} />}
                >
                  Сохранить
                </Button>
                <Button
                  size="xs"
                  compact
                  color="red"
                  variant="subtle"
                  onClick={() => table.setEditingRow(null)}
                  disabled={isSaving}
                  leftIcon={<IconX size={14} />}
                >
                  Отмена
                </Button>
              </Group>
            );
          }

          return (
            <Button
              size="xs"
              compact
              variant="outline"
              onClick={() => table.setEditingRow(row)}
            >
              Редактировать
            </Button>
          );
        }}
        positionActionsColumn="last"
        enableRowActions
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "Действия",
            size: 200,
          },
        }}
        initialState={{
          density: "xs",
        }}
        mantineTableProps={{
          highlightOnHover: true,
          withColumnBorders: true,
          striped: true,
        }}
        mantineTableContainerProps={{
          sx: { maxHeight: "600px" },
        }}
      />
    </>
  );
}
