import AdminLayout from "../Layout/AdminLayout";
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import { fetchData } from "../../modules/module";

const AdminDashboard = () => {
    //get userInfo from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const { data: trData, error: trError } = useSWR(
        `/api/transaction/summary?branch=${userInfo.branch}`,
        fetchData,
        {
            revalidateOnocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000

        }
    );
    console.log(trData);
    return (
        <AdminLayout>
            <Dashboard data={trData && trData} />
        </AdminLayout>
    );
};

export default AdminDashboard;
