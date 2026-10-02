import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ConsumoEdit } from "./pages/consumo/Edit";
import { ConsumoList } from "./pages/consumo/List";
import { ConsumoNew } from "./pages/consumo/New";
import { CapitalList } from "./pages/capital/List";
import { CapitalNew } from "./pages/capital/New";
import { CapitalEdit } from "./pages/capital/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/consumo" replace />} />
        <Route path="/consumo" element={<ConsumoList />} />
        <Route path="/consumo/novo" element={<ConsumoNew />} />
        <Route path="/consumo/:id/editar" element={<ConsumoEdit />} />
        <Route path="/capital" element={<CapitalList />} />
        <Route path="/capital/novo" element={<CapitalNew />} />
        <Route path="/capital/:id/editar" element={<CapitalEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
