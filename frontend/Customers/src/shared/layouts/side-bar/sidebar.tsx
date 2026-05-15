import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/router/routes";
import { Button } from "../../components/ui/button";
import { authRepository } from "../../../features/auth/repository/AuthRepository";
import { useState } from "react";
import { toast } from "sonner";
import { useUserStore } from "../../../features/auth/store/useUserStore";
import { useLayoutStore } from "./useSidebarStore";

export const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const userName = user?.name ? user.name.trim() : "Guest";
  const userLetter = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authRepository.logout();
      useUserStore.getState().clearUser();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className={`
        glass
        hidden
        flex-col
        border-r
        border-white/10
        p-6
        md:flex
        transition-all
        duration-300
        ease-in-out
        fixed          /* تثبيت العنصر */
        left-4         /* مسافة من اليسار */
        top-4          /* مسافة من الأعلى */
        bottom-4       /* مسافة من الأسفل */
        z-50           /* ضمان الظهور في المقدمة */
        rounded-3xl
        ${isSidebarOpen ? "w-64" : "w-24"}
      `}
    >
      <div
        className={`mb-6 flex ${isSidebarOpen ? "justify-start" : "justify-center"}`}
      >
        <button
          onClick={() => toggleSidebar()}
          className="text-white/60 hover:text-white transition-colors p-2"
        >
          {isSidebarOpen ? <ChevronLeft /> : <Menu />}
        </button>
      </div>

      <div className="mb-10 flex items-center gap-3 overflow-hidden">
        <div className="gradient-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
          {userLetter}
        </div>
        {isSidebarOpen && (
          <div className="fade-in whitespace-nowrap">
            <h1 className="text-lg font-bold text-white">{userName}</h1>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <SidebarItem
          to={ROUTES.PRODUCTPAGE}
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          isOpen={isSidebarOpen}
        />
        <SidebarItem
          to={ROUTES.CARTPAGE}
          icon={<ShoppingCart size={20} />}
          label="Cart"
          isOpen={isSidebarOpen}
        />
        <SidebarItem
          to={ROUTES.ORDERPAGE}
          icon={<ClipboardList size={20} />}
          label="Orders"
          isOpen={isSidebarOpen}
        />
      </nav>

      <Button
        onClick={handleLogout}
        loading={loading}
        className={`
          flex 
          items-center 
          transition-all
          duration-300
          ${
            !isSidebarOpen
              ? "px-0 justify-center h-12 w-12 self-center rounded-2xl"
              : "w-full gap-3 px-4"
          }
        `}
      >
        <LogOut className="shrink-0" size={20} />
        {isSidebarOpen && (
          <span className="fade-in whitespace-nowrap">Log out</span>
        )}
      </Button>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const SidebarItem = (props: SidebarItemProps) => {
  return (
    <NavLink
      to={props.to}
      title={!props.isOpen ? props.label : ""}
      className={({ isActive }) =>
        `
          flex
          items-center
          gap-3
          rounded-2xl
          py-3
          text-sm
          font-medium
          transition-all
          duration-200
          ${props.isOpen ? "px-4" : "justify-center px-0"} 
          ${
            isActive
              ? "gradient-primary text-white"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }
        `
      }
    >
      <div className="shrink-0">{props.icon}</div>
      {props.isOpen && (
        <span className="fade-in whitespace-nowrap">{props.label}</span>
      )}
    </NavLink>
  );
};
