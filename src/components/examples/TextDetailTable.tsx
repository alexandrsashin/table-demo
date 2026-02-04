import { useMemo } from "react";
import { Box, Title, Text, Stack } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";

interface RowWithDescription {
  id: number;
  title: string;
  author: string;
  year: number;
  description: string;
}

// Данные для таблицы с текстовым блоком
const booksData: RowWithDescription[] = [
  {
    id: 1,
    title: "Чистый код",
    author: "Роберт Мартин",
    year: 2008,
    description:
      "Даже плохой код может работать. Но если код не чист, он может поставить на колени даже крупную компанию. Каждый год из-за плохого кода расходуются бесчисленные часы и значительные ресурсы. Эта книга научит вас писать хороший код.",
  },
  {
    id: 2,
    title: "Совершенный код",
    author: "Стив Макконнелл",
    year: 2004,
    description:
      "Более 10 лет первое издание этой книги считалось одним из лучших практических руководств по программированию. Сейчас она полностью обновлена с учетом современных тенденций и стандартов.",
  },
  {
    id: 3,
    title: "Рефакторинг",
    author: "Мартин Фаулер",
    year: 1999,
    description:
      "Эта книга представляет собой полное руководство по рефакторингу, процессу совершенствования дизайна существующего кода. Рефакторинг улучшает дизайн программного обеспечения, делает программу более понятной и помогает находить ошибки.",
  },
  {
    id: 4,
    title: "Паттерны проектирования",
    author: "Банда четырех",
    year: 1994,
    description:
      "Эта книга по паттернам проектирования стала классикой. Она описывает 23 паттерна проектирования и показывает, как применять их при создании объектно-ориентированного программного обеспечения.",
  },
  {
    id: 5,
    title: "Алгоритмы. Построение и анализ",
    author: "Томас Кормен",
    year: 2009,
    description:
      "Этот учебник представляет собой исчерпывающее введение в современное исследование компьютерных алгоритмов. Книга охватывает широкий круг алгоритмов с достаточной глубиной, необходимой для понимания их работы.",
  },
];

export function TextDetailTable() {
  const columns = useMemo<MRT_ColumnDef<RowWithDescription>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Название",
        size: 250,
      },
      {
        accessorKey: "author",
        header: "Автор",
        size: 200,
      },
      {
        accessorKey: "year",
        header: "Год",
        size: 100,
      },
    ],
    [],
  );

  return (
    <MantineReactTable
      columns={columns}
      data={booksData}
      enableExpanding
      renderDetailPanel={({ row }) => (
        <Box p="md" style={{ backgroundColor: "#f8f9fa" }}>
          <Stack spacing="xs">
            <Title order={5}>{row.original.title}</Title>
            <Text size="sm" c="dimmed">
              Автор: {row.original.author} • Год издания: {row.original.year}
            </Text>
            <Text size="sm" style={{ lineHeight: 1.6 }}>
              {row.original.description}
            </Text>
          </Stack>
        </Box>
      )}
      initialState={{
        density: "xs",
      }}
      mantineTableProps={{
        highlightOnHover: true,
        withColumnBorders: true,
      }}
      mantineTableContainerProps={{
        sx: { maxHeight: "600px" },
      }}
    />
  );
}
