import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({
    children,
}) {

    const [user, setUser] =
        useState(null);

    const [
        isAuthenticated,
        setIsAuthenticated,
    ] = useState(false);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const isAdmin =
            localStorage.getItem(
                "vezberry_admin_auth"
            ) === "true";

        if (isAdmin) {

            setUser({
                name: "Administrator",
                role: "admin",
            });

            setIsAuthenticated(true);

        }

        setLoading(false);

    }, []);

    const login = () => {

        localStorage.setItem(
            "vezberry_admin_auth",
            "true"
        );

        setUser({
            name: "Administrator",
            role: "admin",
        });

        setIsAuthenticated(true);

    };

    const logout = () => {

        localStorage.removeItem(
            "vezberry_admin_auth"
        );

        setUser(null);

        setIsAuthenticated(false);

        window.location.href =
            "/admin/login";

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(
        AuthContext
    );

}