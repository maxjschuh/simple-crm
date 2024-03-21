export class Transfer {

    date: number;
    title: string;
    description: string;
    closedBy: string; //always an employee
    closedById: string; //is '' when employee is not in database
    amount: number;
    type: 'Sale' | 'Refund' | 'Purchase' | undefined;
    payer: string; //always a contact
    recipient: string; //always a contact
    payerId: string; //is '' when payer is not in database
    recipientId: string; //is '' when recipient is not in database
    id: string;


    constructor(object?: any) {

        if (object) {
            
            this.date = object.date;
            this.title = object.title;
            this.description = object.description ? object.description : '';
            this.closedBy = object.closedBy;
            this.closedById = object.closedById;
            this.amount = object.amount;
            this.type = object.type;
            this.payer = object.payer;
            this.recipient = object.recipient;
            this.payerId = object.payerId;
            this.recipientId = object.recipientId;
            this.id = object.id;

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