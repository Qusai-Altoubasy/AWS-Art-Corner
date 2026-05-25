import {UsersRole} from "../types/UsersRole.ts";
import {useUserStore} from "../store/useUserStore.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "sonner";
import {PageHero} from "../../../shared/components/ui/page-hero.tsx";
import {UserRoleTabs} from "./user-role-tabs.tsx";
import {PageSectionHeader} from "../../../shared/components/ui/page-section-header.tsx";
import {RotateCw, Search, UsersRound} from "lucide-react";
import {LoadingState} from "../../../shared/components/ui/loading-state.tsx";
import {EmptyState} from "../../../shared/components/ui/empty-state.tsx";
import {UserCard} from "./user-card.tsx";


const DEFAULT_ROLE: UsersRole = "EMPLOYEE";

export const UserPage = () => {
    const {users, loading, fetchUsersByRole} = useUserStore();
    const isFetching = loading.fetch;

    const [activeRole, setActiveRole] = useState<UsersRole>(DEFAULT_ROLE);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsersByRole(DEFAULT_ROLE).catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch users");
        });
    }, [fetchUsersByRole]);

    const handleRoleChange = useCallback(
        (role: UsersRole) => {
            setActiveRole(role);
            setSearch("");
            fetchUsersByRole(role).catch((error) => {
                toast.error(error instanceof Error ? error.message : "Failed to fetch users");
            });
        }, [fetchUsersByRole],);

    const handleRefresh = useCallback(() => {
        fetchUsersByRole(activeRole).catch((error) => {
            toast.error(error instanceof Error ? error.message : "Failed to fetch users");
        });
    }, [fetchUsersByRole, activeRole]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase()),
        );
    }, [users, search]);

    return (
        <main className="flex flex-col gap-8">
            <PageHero
                badge="MANAGEMENT"
                title="System"
                highlightedTitle="Users"
                description="Manage system accounts, employee roles, and customer status."
            />

            <UserRoleTabs
                activeRole={activeRole}
                onRoleChange={handleRoleChange}
            />

            <PageSectionHeader
                title="User Directory"
                description="Browse and filter through registered users."
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by user name..."
                onRefresh={handleRefresh}
                refreshLoading={isFetching}
                searchIcon={Search}
                refreshIcon={RotateCw}
            />

            {isFetching && <LoadingState count={6}/>}

            {!isFetching && filteredUsers.length === 0 && (
                <EmptyState
                    title="No users found"
                    description={`There are no users registered under the ${activeRole.toLowerCase()} role.`}
                    icon={UsersRound}
                />
            )}

            {!isFetching && filteredUsers.length > 0 && (
                <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white/60">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Address</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
};