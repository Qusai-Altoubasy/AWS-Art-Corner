import { Navigate } from "react-router-dom";
import { authSession } from "../utils/AuthSession";
import { ROUTES } from "./routes";
import { useEffect, useState } from "react";
import {toast} from "sonner";
import * as React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await authSession();

      setIsAuthenticated(!!token);
      setIsLoading(false);
    }
    checkAuth().catch((error) => {
      toast.error(error instanceof Error ? error.message : "Failed to restore session");
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
