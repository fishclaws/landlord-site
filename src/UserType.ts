export interface User {
    id: number
    email: string
    super_user: boolean
    can_approve_reviews: boolean
    deactivated?: boolean
}

export type CreateUser = Omit<User, 'id'> 

export function newUserObj(): CreateUser {
    return {
        email: '',
        super_user: false,
        can_approve_reviews: false
    }
}