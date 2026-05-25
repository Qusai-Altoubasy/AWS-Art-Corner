import {UsersRole} from "../types/UsersRole.ts";

export interface UserRoleStyle {
    label: string;

    bg: string;
    text: string;
    border: string;

    dotColor: string;
}

export const USER_ROLE_STYLES: Record<UsersRole, UserRoleStyle> = {
    ADMIN: {
        label: "Admin",

        bg: "bg-rose-500/10",
        text: "text-rose-300",
        border: "border-rose-500/20",

        dotColor: "bg-rose-400",
    },

    EMPLOYEE: {
        label: "Employee",

        bg: "bg-sky-500/10",
        text: "text-sky-300",
        border: "border-sky-500/20",

        dotColor: "bg-sky-400",
    },

    CUSTOMER: {
        label: "Customer",

        bg: "bg-emerald-500/10",
        text: "text-emerald-300",
        border: "border-emerald-500/20",

        dotColor: "bg-emerald-400",
    },
};

export const USER_ROLES: UsersRole[] = [
    "ADMIN",
    "EMPLOYEE",
    "CUSTOMER",
];