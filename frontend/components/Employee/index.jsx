import Dashboard from "../Shared/Dashboard";
import EmployeeLayout from "../Layout/EmployeeLayout";
import useSWR from "swr";
import { fetchData } from "../../modules/module"
const EmployeeDashboard = () => {
    // get userInfo from sessionStorage
    const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const { data: trData, error: trError } = useSWR(
        `/api/transaction/summary?branch=${useInfo.branch}`,
        fetchData,
        {
            revalidateOnocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000

        }
    );

    return (
        <EmployeeLayout>
            <Dashboard data={trData && trData} />
        </EmployeeLayout>
    );
};

export default EmployeeDashboard;
