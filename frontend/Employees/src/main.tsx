import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./app/router";
import "./app/config/amplify-config";
import "./index.css";
import { AppToaster } from "./shared/components/ui/toaster";

async function bootstrap() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppToaster />

      <Router />
    </StrictMode>,
  );
}

bootstrap();
