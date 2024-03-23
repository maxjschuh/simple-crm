export class Transfer {

    // *field is required in all forms, i.e. must always contain a truthy value
    date: number; // *
    title: string; // *
    description: string;
    closedBy: string; // * , always an employee
    closedById: string; //is '' when employee is not in database
    amount: number; // *
    type: 'Sale' | 'Refund' | 'Purchase' | undefined; // *
    payer: string; // * , always a contact
    recipient: string; // * , always a contact
    payerId: string; //is '' when payer is not in database
    recipientId: string; //is '' when recipient is not in database
    id: string;


    constructor(transfer?: any) {

        if (transfer) {
            
            this.date = transfer.date;
            this.title = transfer.title;
            this.description = transfer.description ? transfer.description : '';
            this.closedBy = transfer.closedBy;
            this.closedById = transfer.closedById ? transfer.closedById : '';
            this.amount = transfer.amount;
            this.type = transfer.type;
            this.payer = transfer.payer;
            this.recipient = transfer.recipient;
            this.payerId = transfer.payerId ? transfer.payerId : '';
            this.recipientId = transfer.recipientId ? transfer.recipientId : '';
            this.id = transfer.id ? transfer.id : '';

        } else {

            this.date = 0;
            this.title = '';
            this.description = '';
            this.closedBy = '';
            this.closedById = '';
            this.amount = 0;
            this.type = undefined;
            this.payer = '';
            this.recipient = '';
            this.payerId = '';
            this.recipientId = '';
            this.id = '';
        }
    }


    public toJSON(): object {

        return {
            date: this.date,
            title: this.title,
            description: this.description,
            closedBy: this.closedBy,
            closedById: this.closedById,
            amount: this.amount,
            type: this.type,
            payer: this.payer,
            recipient: this.recipient,
            payerId: this.payerId,
            recipientId: this.recipientId,
            id: this.id
        }
    }
}