import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    const token = auth?.token || localStorage.getItem("access_token");
    const role = auth?.role || localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        // TODO we need to make an "unauthorized" page
        //return <Navigate to="/unauthorized" replace />;
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
