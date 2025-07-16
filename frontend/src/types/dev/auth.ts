export type UserRole = "user" | "admin"

export interface HeaderUser {
    name: string
    role: UserRole
}
