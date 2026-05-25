import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({
    children
}) {

    const isAdmin =
        localStorage.getItem(
            "vezberry_admin_auth"
        ) === "true";

    if (!isAdmin) {

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }

    return children;

}