import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ConsumoEdit } from "./pages/consumo/Edit";
import { ConsumoList } from "./pages/consumo/List";
import { ConsumoNew } from "./pages/consumo/New";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/consumo" replace />} />
        <Route path="/consumo" element={<ConsumoList />} />
        <Route path="/consumo/novo" element={<ConsumoNew />} />
        <Route path="/consumo/:id/editar" element={<ConsumoEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
