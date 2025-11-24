export interface ApiResponse <T> {
    response: T;
    status:   boolean;
    message:  string[];
}

export interface Rol {
    id:               string;
    name:             string;
    normalizedName:   string;
    concurrencyStamp?: null;
}

export type RolesResponse = ApiResponse<Rol[]>;
export type RoleResponse = ApiResponse<Rol>;