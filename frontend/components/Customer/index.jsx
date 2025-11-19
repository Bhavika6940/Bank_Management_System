import Customerlayout from "../Layout/Customerlayout";
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import { fetchData } from "../../modules/module";

const CustomerDashboard = () => {
    const useInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const { data: trData, error: trError } = useSWR(
        `/api/transaction/summary?accountNo=${useInfo.accountNo}`,
        fetchData,
        {
            revalidateOnocus: false,
            revalidateOnReconnect: false,
            refreshInterval: 1200000

        }
    );

    return (
        <Customerlayout>
            <Dashboard data={trData && trData} />
        </Customerlayout>
    );
};

export default CustomerDashboard;
