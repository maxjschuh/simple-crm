import { Contact } from "../models/contact.class"

export interface dataForEditDialog {
    fieldsToEdit: 'name+email+phone' | 'address' | 'birthDate' | 'all',
    contact: Contact
}