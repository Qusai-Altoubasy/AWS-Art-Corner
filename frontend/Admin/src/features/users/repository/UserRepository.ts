import {UserResponse} from "../../../shared/types/UserResponse.ts";
import {UsersRole} from "../types/UsersRole.ts";
import {api} from "../../../app/config/api-config.ts";

class UserRepository {

    async getAllUsersByRole(role: UsersRole): Promise<UserResponse[]> {
        const response = await api.get<UserResponse[]>(`/api/users/${role}`);
        return response.data;
    }

    async activation(userId: string, action: boolean): Promise<string> {
        const response = await api.patch<string>(`/api/users/activation/${userId}`,
            null, {
                params: {
                    action
                }
            });
        return response.data;
    }
}

export const userRepository = new UserRepository();