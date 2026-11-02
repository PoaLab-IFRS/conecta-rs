import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { RequireAdmin } from "./components/RequireAdmin";
import { UserNew } from "./pages/user/New";
import { AppLayout } from "./components/AppLayout";
import { Login } from "./pages/auth/Login";
import { ConsumoEdit } from "./pages/consumo/Edit";
import { ConsumoList } from "./pages/consumo/List";
import { ConsumoNew } from "./pages/consumo/New";
import { CapitalList } from "./pages/capital/List";
import { CapitalNew } from "./pages/capital/New";
import { CapitalEdit } from "./pages/capital/Edit";
import { Menu } from "./pages/Menu";
import { UserList } from "./pages/user/List";
import { UserEdit } from "./pages/user/Edit";
import { ResetPassword } from "./pages/auth/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/consumo" element={<ConsumoList />} />
            <Route path="/consumo/novo" element={<ConsumoNew />} />
            <Route path="/consumo/:id/editar" element={<ConsumoEdit />} />

            <Route path="/capital" element={<CapitalList />} />
            <Route path="/capital/novo" element={<CapitalNew />} />
            <Route path="/capital/:id/editar" element={<CapitalEdit />} />

            <Route element={<RequireAdmin />}>
              <Route path="/usuarios" element={<UserList />} />
              <Route path="/usuarios/novo" element={<UserNew />} />
              <Route path="/usuarios/:id/editar" element={<UserEdit />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
