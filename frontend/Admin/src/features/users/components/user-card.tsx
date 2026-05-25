import {useCallback} from "react";
import {UserResponse} from "../../../shared/types/UserResponse.ts";
import {Button} from "../../../shared/components/ui/button";
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShieldAlert,
    ShieldCheck,
    Power,
} from "lucide-react";
import {toast} from "sonner";
import {useUserStore} from "../store/useUserStore";

interface UserCardProps {
    user: UserResponse;
}

export const UserCard = ({user}: UserCardProps) => {
    const {toggleUserActivation, loading} = useUserStore();
    const isUserLoading = loading.activation[user.id] || false;

    const handleToggleActivation = useCallback(async () => {
        try {
            const nextAction = !user.active;
            const message = await toggleUserActivation(user.id, nextAction);

            toast.success(message || `User ${nextAction ? "activated" : "deactivated"} successfully`);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to change user activation",
            );
        }
    }, [toggleUserActivation, user.id, user.active]);

    return (
        <tr
            className="
                group
                border-b
                border-white/5
                bg-white/1
                transition-colors
                duration-200
                hover:bg-white/4
            "
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                        <User size={14}/>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-white truncate max-w-40">
                            {user.name}
                        </span>
                        <span className="text-[10px] text-white/40 tracking-wider">
                            ID: {user.id.slice(0, 8)}...
                        </span>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-white/85 text-sm">
                    <Mail size={14} className="text-white/40 shrink-0"/>
                    <span className="truncate max-w-50">{user.email}</span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-white/85 text-sm">
                    <Phone size={14} className="text-white/40 shrink-0"/>
                    <span>{user.phone || "—"}</span>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex flex-col text-xs text-white/85 max-w-55">
                    <span className="truncate font-medium flex items-center gap-1">
                        <MapPin size={12} className="text-violet-300/70 shrink-0"/>
                        {user.address.street}{user.address.apartment ? `, Apt ${user.address.apartment}` : ""}
                    </span>
                    <span className="text-white/40 pl-4">{user.address.city}</span>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`
                        inline-flex
                        items-center
                        gap-1
                        rounded-xl
                        border
                        px-2.5
                        py-0.5
                        text-xs
                        font-semibold
                        tracking-wide
                        uppercase
                        ${
                        user.active
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                            : "bg-red-500/10 text-red-300 border-red-500/20"
                    }
                    `}
                >
                    {user.active ? (
                        <>
                            <ShieldCheck size={12}/> Active
                        </>
                    ) : (
                        <>
                            <ShieldAlert size={12}/> Inactive
                        </>
                    )}
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                    onClick={handleToggleActivation}
                    loading={isUserLoading}
                    className={`
                        shadow-none
                        h-8
                        px-3
                        text-xs
                        rounded-lg
                        border
                        transition-colors
                        duration-200
                        ${
                        user.active
                            ? "bg-red-500/15 text-red-300 border-red-500/20 hover:bg-red-500/25"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/25"
                    }
                    `}
                >
                    {!isUserLoading && <Power size={12} className="mr-1"/>}
                    {user.active ? "Deactivate" : "Activate"}
                </Button>
            </td>
        </tr>
    );
};