import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutApp from "../layouts";
import RolePage from "../pages/roles";
import LoginPage from "../pages/login";
import Dashboard from "../pages/dashboard";
import FindRolePage from "../pages/roles/FindRole";
import CreateRolePage from "../pages/roles/CreateRole";
import UpdateRolePage from "../pages/roles/UpdateRole";

function RoutesApp() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="admin" element={<LayoutApp />}>
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route path="dashboard" element={<Dashboard />} />

            <Route path="roles" element={<RolePage />} />
            <Route path="roles/create" element={<CreateRolePage />} />
            <Route path="roles/find/:id" element={<FindRolePage />} />
            <Route path="roles/update/:id" element={<UpdateRolePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default RoutesApp;
