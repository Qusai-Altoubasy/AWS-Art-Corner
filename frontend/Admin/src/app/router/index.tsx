import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import { ROUTES } from "./routes";
import { Dashboard } from "../layouts/dashboard";
import { LoginPage } from "../../features/auth/components/login-page";
import { ProductPage } from "../../features/products/components/product-page";
import {OrderPage} from "../../features/orders/components/order-page.tsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.PRODUCTIVE} element={<ProductPage />} />
            <Route path={ROUTES.ORDERSPAGE} element={<OrderPage /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
