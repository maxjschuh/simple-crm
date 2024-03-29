import { Contact } from "../models/contact.class"
import { Employee } from "../models/employee.class"
import { Transfer } from "../models/transfer.class"

export interface dataForEditDialog {
    fieldsToEdit:
    'all' |
    'name+email+phone' |
    'address' |
    'birthDate' |
    'position+department' |
    'birthDate+supervisor' |
    'title' |
    'type+amount+payer+recipient' |
    'closedBy+date' |
    'description',
    document: Contact | Transfer | Employee
}