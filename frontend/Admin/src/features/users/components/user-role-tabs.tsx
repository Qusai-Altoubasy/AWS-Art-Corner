import { useCallback } from "react";
import {
    USER_ROLE_STYLES,
    USER_ROLES,
} from "../constants/UserRoleStyle";
import { UsersRole } from "../types/UsersRole.ts";

interface UserRoleTabsProps {
    activeRole: UsersRole;
    onRoleChange: (role: UsersRole) => void;
}

export const UserRoleTabs = ({
                                 activeRole,
                                 onRoleChange,
                             }: UserRoleTabsProps) => {
    const handleClick = useCallback(
        (role: UsersRole) => {
            if (role !== activeRole) {
                onRoleChange(role);
            }
        },
        [activeRole, onRoleChange],
    );

    return (
        <div
            className="
        w-max
        mx-auto
        relative
        overflow-x-auto
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-2
        backdrop-blur-xl
        flex
        justify-center
      "
        >
            <div className="flex min-w-max gap-1 justify-center sm:min-w-0 sm:flex-wrap">
                {USER_ROLES.map((role) => {
                    const isActive = role === activeRole;
                    const meta = USER_ROLE_STYLES[role];

                    return (
                        <button
                            key={role}
                            onClick={() => handleClick(role)}
                            className={`
                relative
                flex
                items-center
                gap-2
                rounded-2xl
                px-4
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200
                whitespace-nowrap
                ${
                                isActive
                                    ? "gradient-primary shadow-primary text-white"
                                    : "text-white/60 hover:bg-white/8 hover:text-white"
                            }
              `}
                        >
              <span
                  className={`
                  h-2
                  w-2
                  rounded-full
                  shrink-0
                  transition-all
                  duration-200
                  ${isActive ? "bg-white/80" : meta.dotColor}
                `}
              />
                            {meta.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};