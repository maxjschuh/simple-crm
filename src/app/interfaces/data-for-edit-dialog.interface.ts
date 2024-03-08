import { User } from "../models/user.class"

export interface dataForEditDialog {
    fieldsToEdit: 'name+email' | 'address' | 'birthDate' | 'all',
    user: User
}