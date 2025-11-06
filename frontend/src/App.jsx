import Guard from "../components/Guard"
import Loader from "../components/Loader";
import { lazy, Suspense } from "react";


const HomePage = lazy(() => import("../components/Home"));
const Dashboard = lazy(() => import("../components/Admin"));
const NewEmployee = lazy(() => import("../components/Admin/NewEmployee"));
const Branding = lazy(() => import("../components/Admin/Branding"));
const PageNotFound = lazy(() => import("../components/PageNotFound"));
const Branch = lazy(() => import("../components/Admin/Branch"));
const Currency = lazy(() => import("../components/Admin/Currency"));
const EmployeeDashboard = lazy(() => import("../components/Employee"))
import { BrowserRouter, Routes, Route } from "react-router-dom";






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
            <Route path="branding" element={<Branding />} />
            <Route path="branch" element={<Branch />} />
            <Route path="currency" element={<Currency />} />
            <Route path="*" element={<PageNotFound />} />

          </Route>
          {/* End admin related routes */}

          {/* Start employee related routes */}
          <Route path="/employee/" element={<Guard endpoint={"/api/verify-token"} role="employee" />}>
            <Route index element={<EmployeeDashboard />} />
            <Route path="*" element={<PageNotFound />} />

          </Route>

          {/* End employee related routes */}

          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
export default App;