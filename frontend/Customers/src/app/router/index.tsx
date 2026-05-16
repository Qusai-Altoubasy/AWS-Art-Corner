import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protected-route";
import { ROUTES } from "./routes";
import { Dashboard } from "../layouts/dashboard";
import { LoginPage } from "../../features/auth/components/login-page";
import { CartPage } from "../../features/cart/components/cart-page";
import { OrderPage } from "../..//features/orders/components/order-page";
import { ProductPage } from "../../features/products/components/product-page";
import { SignupPage } from "../../features/auth/components/signup-page";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />

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
          <Route path={ROUTES.PRODUCTPAGE} element={<ProductPage />} />

          <Route path={ROUTES.CARTPAGE} element={<CartPage />} />

          <Route path={ROUTES.ORDERPAGE} element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
