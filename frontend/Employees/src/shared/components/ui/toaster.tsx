import { Toaster } from "sonner";

export const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        className: "border border-white/10",
      }}
    />
  );
};
