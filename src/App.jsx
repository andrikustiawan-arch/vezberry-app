import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import NavigationTracker from "@/lib/NavigationTracker";
import { pagesConfig } from "./pages.config";

import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";

import {
    AuthProvider,
    useAuth,
} from "@/lib/AuthContext";

import UserNotRegisteredError from "@/components/UserNotRegisteredError";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Checkout from "./pages/Checkout";
// =========================
// ADMIN PAGES
// =========================

import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminStoreSettings from "./pages/admin/StoreSettings";
import AdminLogin from "./pages/admin/AdminLogin";

// =========================
// PAGE CONFIG
// =========================

const {
    Pages,
    Layout,
    mainPage,
} = pagesConfig;

const mainPageKey =
    mainPage ?? Object.keys(Pages)[0];

const MainPage = mainPageKey
    ? Pages[mainPageKey]
    : <></>;

// =========================
// LAYOUT WRAPPER
// =========================

const LayoutWrapper = ({
    children,
    currentPageName,
}) =>
    Layout ? (
        <Layout currentPageName={currentPageName}>
            {children}
        </Layout>
    ) : (
        <>{children}</>
    );

// =========================
// AUTHENTICATED APP
// =========================

const AuthenticatedApp = () => {

    const {
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        navigateToLogin,
    } = useAuth();

    // =========================
    // LOADING SCREEN
    // =========================

    if (
        isLoadingPublicSettings ||
        isLoadingAuth
    ) {
        return (
            <div className="
                fixed
                inset-0
                flex
                items-center
                justify-center
                bg-white
                z-50
            ">
                <div className="
                    w-10
                    h-10
                    border-4
                    border-pink-100
                    border-t-pink-500
                    rounded-full
                    animate-spin
                " />
            </div>
        );
    }

    // =========================
    // AUTH ERROR
    // =========================

    if (authError) {

        if (
            authError.type ===
            "user_not_registered"
        ) {
            return <UserNotRegisteredError />;
        }

        if (
            authError.type ===
            "auth_required"
        ) {
            navigateToLogin();
            return null;
        }

    }

    // =========================
    // ROUTES
    // =========================

    return (

        <Routes>

            {/* ========================= */}
            {/* HOME */}
            {/* ========================= */}

            <Route
                path="/"
                element={
                    <LayoutWrapper
                        currentPageName={mainPageKey}
                    >
                        <MainPage />
                    </LayoutWrapper>
                }
            />

            {/* ========================= */}
            {/* DYNAMIC PAGES */}
            {/* ========================= */}

            {Object.entries(Pages).map(
                ([path, Page]) => (

                    <Route
                        key={path}
                        path={`/${path}`}
                        element={
                            <LayoutWrapper
                                currentPageName={path}
                            >
                                <Page />
                            </LayoutWrapper>
                        }
                    />

                )
            )}

            {/* ========================= */}
            {/* ADMIN LOGIN */}
            {/* ========================= */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            {/* ========================= */}
            {/* ADMIN DASHBOARD */}
            {/* ========================= */}

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedAdminRoute>
                        <AdminDashboard />
                    </ProtectedAdminRoute>
                }
            />

            {/* ========================= */}
            {/* ADMIN PRODUCTS */}
            {/* ========================= */}

            <Route
                path="/admin/products"
                element={
                    <ProtectedAdminRoute>
                        <AdminProducts />
                    </ProtectedAdminRoute>
                }
            />

            {/* ========================= */}
            {/* ADMIN ORDERS */}
            {/* ========================= */}

            <Route
                path="/admin/orders"
                element={
                    <ProtectedAdminRoute>
                        <AdminOrders />
                    </ProtectedAdminRoute>
                }
            />

            {/* ========================= */}
            {/* ADMIN SETTINGS */}
            {/* ========================= */}

            <Route
                path="/admin/settings"
                element={
                    <ProtectedAdminRoute>
                        <AdminStoreSettings />
                    </ProtectedAdminRoute>
                }
            />

            {/* ========================= */}
            {/* 404 */}
            {/* ========================= */}

            <Route
                path="*"
                element={<PageNotFound />}
            />

            <Route
                path="/checkout"
                element={<Checkout />}
            />

        </Routes>

    );
};

// =========================
// MAIN APP
// =========================

function App() {

    return (

        <AuthProvider>

            <QueryClientProvider
                client={queryClientInstance}
            >

                <Router>

                    <NavigationTracker />

                    <AuthenticatedApp />

                </Router>

                <Toaster />

            </QueryClientProvider>

        </AuthProvider>

    );

}

export default App;