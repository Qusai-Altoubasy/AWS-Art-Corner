import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from "./protected-route";
import {ROUTES} from "./routes";
import {Dashboard} from "../layouts/dashboard";
import {LoginPage} from "../../features/auth/components/login-page";
import {ProductPage} from "../../features/products/components/product-page";
import {OrderPage} from "../../features/orders/components/order-page.tsx";
import {UserPage} from "../../features/users/components/user-page.tsx";
import {ReportsPage} from "../../features/reports/components/reports-page.tsx";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>

                <Route
                    path={ROUTES.DASHBOARD}
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                >
                    <Route path={ROUTES.PRODUCTPAGE} element={<ProductPage/>}/>

                    <Route path={ROUTES.ORDERSPAGE} element={<OrderPage/>}/>

                    <Route path={ROUTES.USERSPAGE} element={<UserPage/>}/>

                    <Route path={ROUTES.REPORTSPAGE} element={<ReportsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
