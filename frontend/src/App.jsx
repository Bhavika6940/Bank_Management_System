import Guard from "../components/Guard"
import Loader from "../components/Loader";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Admin"));
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"));
const Branding = lazy(() => import("../components/Admin/Branding"));
const PageNotFound = lazy(() => import("../components/PageNotFound"));
const Branch = lazy(() => import("../components/Admin/Branch"));
const Currency = lazy(() => import("../components/Admin/Currency"));
const EmployeeDashboard = lazy(() => import("../components/Employee"));
const EmpNewAccount = lazy(() => import("../components/Employee/EmpNewAccount"))
const AdminNewAccount = lazy(() => import("../components/Admin/AdminNewAccount"))
const AdminTransaction = lazy(() => import("../components/Admin/AdminTransaction"))
const EmpTransaction = lazy(() => import("../components/Employee/EmpTransaction"))
const CustomerDashboard = lazy(() => import("../components/Customer"))
const CustomerTransactions = lazy(() => import("../components/Customer/Transactions"))
const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Start admin related routes */}
          <Route path="/admin/" element={<Guard endpoint={"/api/verify"} role="admin" />} >
            <Route index element={<Dashboard />} />
            <Route path="new-employee" element={<NewEmployee />} />
            <Route path="new-account" element={<AdminNewAccount />} />
            <Route path="branding" element={<Branding />} />
            <Route path="branch" element={<Branch />} />
            <Route path="currency" element={<Currency />} />
            <Route path="new-transaction" element={<AdminTransaction />} />
            <Route path="*" element={<PageNotFound />} />

          </Route>
          {/* End admin related routes */}

          {/* Start employee related routes */}
          <Route path="/employee/" element={<Guard endpoint={"/api/verify"} role="employee" />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="new-account" element={<EmpNewAccount />} />
            <Route path="new-transaction" element={<EmpTransaction />} />
            <Route path="*" element={<PageNotFound />} />

          </Route>

          {/* End employee related routes */}

          {/* Start customer related routes */}
          <Route path="/customer/" element={<Guard endpoint={"/api/verify"} role="customer" />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="transaction" element={<CustomerTransactions />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* End customer related routes */}

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
export default App;