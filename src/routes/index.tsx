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
import VerificationPage from "../pages/verifications";
import CreateVerificationPage from "../pages/verifications/CreateVerification";
import FindVerificationPage from "../pages/verifications/FindVerification";
import UpdateVerificationPage from "../pages/verifications/UpdateVerification";

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

            {/* Verifications */}
            <Route path="verifications" element={<VerificationPage />} />
            <Route path="verifications/create" element={<CreateVerificationPage />} />
            <Route path="verifications/find/:id" element={<FindVerificationPage />} />
            <Route path="verifications/update/:id" element={<UpdateVerificationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default RoutesApp;
