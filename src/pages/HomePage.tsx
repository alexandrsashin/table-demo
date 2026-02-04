import { useState } from "react";
import { Box, Tabs, Tab, Typography, Container } from "@mui/material";
import { TanStackTable } from "../components/TanStackTable";
import { MaterialReactTableComponent } from "../components/MaterialReactTableComponent";
import { MuiDataGridComponent } from "../components/MuiDataGridComponent";
import { AgGridComponent } from "../components/AgGridComponent";
import { ReactAdminComponent } from "../components/ReactAdminComponent";
import { ReactDataGridComponent } from "../components/ReactDataGridComponent";
import { SimpleTable } from "../components/SimpleTable";
import { MantineReactTableComponent } from "../components/MantineReactTableComponent";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`table-tabpanel-${index}`}
      aria-labelledby={`table-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function HomePage() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={false} sx={{ py: 2 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Table Libraries Demo
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        align="center"
        color="text.secondary"
      >
        Сравнение различных библиотек для работы с таблицами
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="table libraries tabs"
        >
          <Tab label="TanStack Table" />
          <Tab label="Material React Table" />
          <Tab label="MUI X Data Grid" />
          <Tab label="AG Grid" />
          <Tab label="React Admin" />
          <Tab label="React Data Grid" />
          <Tab label="Mantine React Table" />
          <Tab label="Simple Table" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <TanStackTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MaterialReactTableComponent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MuiDataGridComponent />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AgGridComponent />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ReactAdminComponent />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ReactDataGridComponent />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <MantineReactTableComponent />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <SimpleTable />
      </TabPanel>
    </Container>
  );
}
