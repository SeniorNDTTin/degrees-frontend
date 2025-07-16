import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutApp from "../layouts";
import LoginPage from "../pages/login";
import Dashboard from "../pages/dashboard";

function RoutesApp() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="admin" element={<LayoutApp />}>
            <Route path="auth">
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default RoutesApp;
