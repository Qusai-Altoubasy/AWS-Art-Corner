import {create} from "zustand";
import {UserResponse} from "../../../shared/types/UserResponse.ts";
import {UsersRole} from "../types/UsersRole.ts";
import {userRepository} from "../repository/UserRepository.ts";

interface UsersState {
    users: UserResponse[];

    loading: {
        fetch: boolean;
        activation: Record<string, boolean>;
    };

    fetchUsersByRole: (role: UsersRole) => Promise<void>;
    toggleUserActivation: (userId: string, action: boolean) => Promise<string | undefined>;
    clearUsers: () => void;
}

export const useUserStore = create<UsersState>()((set) => ({
    users: [],
    loading: {
        fetch: false,
        activation: {},
    },

    fetchUsersByRole: async (role) => {
        set((state) => ({
            loading: {...state.loading, fetch: true},
        }));

        try {
            const data = await userRepository.getAllUsersByRole(role);
            set({users: data});
        } finally {
            set((state) => ({
                loading: {...state.loading, fetch: false},
            }));
        }
    },

    toggleUserActivation: async (userId, action) => {
        set((state) => ({
            loading: {
                ...state.loading,
                activation: {...state.loading.activation, [userId]: true},
            },
        }));

        try {
            const message = await userRepository.activation(userId, action);

            set((state) => ({
                users: state.users.map((user) =>
                    user.id === userId ? {...user, active: action} : user
                ),
            }));

            return message;
        } finally {
            set((state) => ({
                loading: {
                    ...state.loading,
                    activation: {...state.loading.activation, [userId]: false},
                },
            }));
        }
    },

    clearUsers: () => set({users: []}),
}));