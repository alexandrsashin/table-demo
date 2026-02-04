import { MantineProvider, Tabs, Container, Title, Text } from "@mantine/core";
import { AdvancedMantineTable } from "../components/examples/AdvancedMantineTable";
import { VirtualizedInfiniteScrollTable } from "../components/examples/VirtualizedInfiniteScrollTable";
import { HierarchicalTable } from "../components/examples/HierarchicalTable";
import { NestedTable } from "../components/examples/NestedTable";
import { TextDetailTable } from "../components/examples/TextDetailTable";
import { DynamicRowsTable } from "../components/examples/DynamicRowsTable";
import { LazyLoadingTable } from "../components/examples/LazyLoadingTable";
import { SearchHighlightTable } from "../components/examples/SearchHighlightTable";

export function ExamplesPage() {
  return (
    <MantineProvider>
      <Container size="xl" py="xl">
        <Title order={1} ta="center" mb="xs">
          Блок примеров
        </Title>
        <Text ta="center" c="dimmed" mb="xl">
          Дополнительные примеры и демонстрации
        </Text>

        <Tabs defaultValue="table1">
          <Tabs.List>
            <Tabs.Tab value="table1">Колонки</Tabs.Tab>
            <Tabs.Tab value="example2">Виртуализация</Tabs.Tab>
            <Tabs.Tab value="hierarchical">Иерархия</Tabs.Tab>
            <Tabs.Tab value="nested">Вложенная таблица</Tabs.Tab>
            <Tabs.Tab value="details">Детали записи</Tabs.Tab>
            <Tabs.Tab value="dynamic">Drag & Drop</Tabs.Tab>
            <Tabs.Tab value="lazy">Подгрузка данных</Tabs.Tab>
            <Tabs.Tab value="search">Поиск и анимация</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="table1" pt="md">
            <Title order={3} mb="sm">
              Mantine React Table с расширенными возможностями
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              • Скрытие/отображение колонок (кнопка с глазом справа)
              <br />
              • Изменение порядка колонок (перетаскивание)
              <br />
              • Изменение ширины колонок (перетаскивание разделителей)
              <br />
              • Сортировка по колонкам (клик на заголовок)
              <br />
              • Фиксация колонок слева/справа (кнопка с пином в меню колонки)
              <br />
              • Колонка ID заблокирована (нельзя скрыть или переместить)
              <br />• Колонка Label имеет информационную иконку в заголовке
            </Text>
            <AdvancedMantineTable />
          </Tabs.Panel>

          <Tabs.Panel value="example2" pt="md">
            <Title order={3} mb="sm">
              Виртуализация и бесконечный скролл
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              • Виртуализация строк для оптимальной производительности
              <br />
              • Бесконечный скролл - данные подгружаются автоматически при
              прокрутке
              <br />
              • Рендерится только видимые строки (overscan: 10)
              <br />
              • Отключена пагинация
              <br />• Автоматическая загрузка новых порций данных при
              приближении к концу списка
            </Text>
            <VirtualizedInfiniteScrollTable />
          </Tabs.Panel>

          <Tabs.Panel value="hierarchical" pt="md">
            <Title order={3} mb="sm">
              Иерархическая таблица
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              • Многоуровневая иерархия (категории → подкатегории → товары)
              <br />
              • Раскрытие/скрытие подуровней
              <br />
              • Кнопка "Развернуть всё"
              <br />
              • Визуальное отображение уровней вложенности
              <br />• Использование getSubRows для определения дочерних
              элементов
            </Text>
            <HierarchicalTable />
          </Tabs.Panel>

          <Tabs.Panel value="nested" pt="md">
            <Title order={3} mb="sm">
              Таблица с вложенной таблицей
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              • Основная таблица товаров с ценами и остатками
              <br />
              • При раскрытии строки показывается вложенная таблица заказов
              <br />
              • Каждая вложенная таблица имеет свою структуру колонок
              <br />
              • Полноценная таблица внутри detail panel
              <br />• Идеально для отображения связанных данных
            </Text>
            <NestedTable />
          </Tabs.Panel>

          <Tabs.Panel value="details" pt="md">
            <Title order={3} mb="sm">
              Таблица с детальной информацией
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              • Компактная таблица книг
              <br />
              • При раскрытии строки показывается подробное описание
              <br />
              • Текстовый блок с дополнительной информацией
              <br />
              • Отформатированный detail panel
              <br />• Подходит для отображения описаний, комментариев и
              детальной информации
            </Text>
            <TextDetailTable />
          </Tabs.Panel>

          <Tabs.Panel value="dynamic" pt="md">
            <Title order={3} mb="sm">
              Таблица с динамической высотой строк и Drag & Drop
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              Пример таблицы с динамической высотой строк в зависимости от
              содержимого, подсветкой статуса записей и возможностью перемещения
              строк:
              <br />• Динамическая высота строк для длинного текста
              <br />• Цветная подсветка статуса (positive, warning, negative)
              <br />• Drag & Drop для изменения порядка строк
              <br />• Бейджи для приоритета и статуса задач
            </Text>
            <DynamicRowsTable />
          </Tabs.Panel>

          <Tabs.Panel value="lazy" pt="md">
            <Title order={3} mb="sm">
              Таблица с динамической подгрузкой данных
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              Пример таблицы с пошаговой загрузкой данных по требованию:
              <br />• Загрузка данных порциями по 15 записей
              <br />• Кнопка "Загрузить еще" для загрузки следующей порции
              <br />• Индикатор загрузки и счетчик загруженных записей
              <br />• Возможность сброса и перезагрузки данных
            </Text>
            <LazyLoadingTable />
          </Tabs.Panel>

          <Tabs.Panel value="search" pt="md">
            <Title order={3} mb="sm">
              Таблица с поиском и анимацией
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              Пример таблицы с подсветкой результатов поиска и анимированным
              добавлением записей:
              <br />• Поиск с подсветкой найденных подстрок во всех ячейках
              <br />• Кнопка добавления новой записи
              <br />• Автоматический скролл к добавленной записи
              <br />• Временная анимация подсветки новой строки (2 сек)
            </Text>
            <SearchHighlightTable />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </MantineProvider>
  );
}
