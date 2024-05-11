export type Workspace = {
    name: string;
    version: string;
}

export type UserPrincipal = {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    ip: string;

    role: any;

    token?: string;
}
