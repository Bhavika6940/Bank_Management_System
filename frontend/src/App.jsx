import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../components/Home";
import Dashboard from "../components/Admin";
import NewEmployee from "../components/Admin/NewEmployee";
import Branding from "../components/Admin/Branding";
import PageNotFound from "../components/PageNotFound";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/new-employee" element={<NewEmployee />} />
        <Route path="/admin/branding" element={<Branding />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;