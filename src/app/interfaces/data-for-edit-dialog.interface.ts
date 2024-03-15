import { Contact } from "../models/contact.class"
import { Employee } from "../models/employee.class"
import { Transfer } from "../models/transfer.class"

export interface dataForEditDialog {
    fieldsToEdit: 'name+email+phone' | 'address' | 'birthDate' | 'position+department' | 'birthDate+supervisor' | 'description' | 'all',
    document: Contact | Transfer | Employee
}