import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { http } from "../../modules/module";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader"; 


const Guard = ({ endpoint, role }) => {

    const cookies = new Cookies();
    const [authorised, setAuthorised] = useState(false);
    const [loader, setLoader] = useState(true);
    const [userType, setUserType] = useState(null);

    const token = cookies.get("authToken");
    console.log(token, endpoint, role)
    if (token === undefined) {
        return <Navigate to="/" />
    }

    const verifyToken = async () => {
        if (!token) {
            setAuthorised(false);
            return <Navigate to="/" />
        }
        try {
            const httpReq = http(token);
            const { data } = await httpReq.get(endpoint);
            const user = data?.data?.userType;
            console.log(data);
            sessionStorage.setItem("userInfo", JSON.stringify(data?.data));
            setUserType(user);
            setLoader(false);
            setAuthorised(true);

        }
        catch (err) {
            setUserType(null);
            setLoader(false);
            setAuthorised(false);
        }
    }
    useEffect(() => {

        verifyToken();

    }, [endpoint]);

    if (loader) {
        return <Loader/>
    }

    if (authorised && role === userType) {
        return <Outlet />
    }

    else {
        return <Navigate to="/" />
    }



}

export default Guard;