import { Contact } from "../models/contact.class"

export interface dataForEditDialog {
    fieldsToEdit: 'name+email' | 'address' | 'birthDate' | 'all',
    contact: Contact
}