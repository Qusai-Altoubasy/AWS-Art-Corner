import { Outlet } from "react-router-dom";
import { Sidebar } from "../../shared/layouts/side-bar/sidebar";
import { useLayoutStore } from "../../shared/layouts/side-bar/useSidebarStore";

export const Dashboard = () => {
  const isSidebarOpen = useLayoutStore((state) => state.isSidebarOpen);
  return (
    <main className="flex min-h-screen">
      <Sidebar />

      <section
        className={`
          flex-1 p-6 transition-all duration-300
          ${isSidebarOpen ? "md:ml-72" : "md:ml-32"}
        `}
      >
        <Outlet />
      </section>
    </main>
  );
};
