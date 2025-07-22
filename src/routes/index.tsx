import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutApp from "../layouts";
import RolePage from "../pages/roles";
import LoginPage from "../pages/login";
import Dashboard from "../pages/dashboard";

import FindRolePage from "../pages/roles/FindRole";
import CreateRolePage from "../pages/roles/CreateRole";
import UpdateRolePage from "../pages/roles/UpdateRole";

import VerifierPage from "../pages/verifiers";
import FindVerifierPage from "../pages/verifiers/FindVerifier";
import CreateVerifierPage from "../pages/verifiers/CreateVerifier";
import UpdateVerifierPage from "../pages/verifiers/UpdateVerifier";

import CertificatePage from "../pages/certificates";
import CreateCertificatePage from "../pages/certificates/CreateCertificate";
import FindCertificatePage from "../pages/certificates/FindCertificate";
import UpdateCertificatePage from "../pages/certificates/UpdateCertificate";

import DegreePage from "../pages/degrees/Degrees";
import CreateDegreePage from "../pages/degrees/CreateDegree";
import FindDegreePage from "../pages/degrees/FindDegree";
import UpdateDegreePage from "../pages/degrees/UpdateDegree";

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

            <Route path="verifiers" element={<VerifierPage />} />
            <Route path="verifiers/create" element={<CreateVerifierPage />} />
            <Route path="verifiers/find/:id" element={<FindVerifierPage />} />
            <Route path="verifiers/update/:id" element={<UpdateVerifierPage />} />

            {/* Certificates */}
            <Route path="certificates" element={<CertificatePage />} />
            <Route path="certificates/create" element={<CreateCertificatePage />} />
            <Route path="certificates/find/:id" element={<FindCertificatePage />} />
            <Route path="certificates/update/:id" element={<UpdateCertificatePage />} />

            {/* Degrees */}
            <Route path="degrees" element={<DegreePage />} />
            <Route path="degrees/create" element={<CreateDegreePage />} />
            <Route path="degrees/find/:id" element={<FindDegreePage />} />
            <Route path="degrees/update/:id" element={<UpdateDegreePage />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default RoutesApp;
