export class Transfer {

    date: number;
    title: string;
    description: string;
    closedBy: string; //always an employee
    closedById: string; //is '' when employee is not in database
    amount: number;
    type: 'Sale' | 'Refund' | 'Purchase' | '';
    payer: string; //always a contact
    recipient: string; //always a contact
    payerId: string; //is '' when payer is not in database
    recipientId: string; //is '' when recipient is not in database
    id: string;


    constructor(object?: any) {
        this.date = object ? object.date : 0;
        this.title = object ? object.title : '';
        this.description = object ? object.description : '';
        this.closedBy = object ? object.closedBy : '';
        this.closedById = object ? object.closedById : '';
        this.amount = object ? object.amount : 0;
        this.type = object ? object.type : '';
        this.payer = object ? object.payer : '';
        this.recipient = object ? object.recipient : '';
        this.payerId = object ? object.payerId : '';
        this.recipientId = object ? object.recipientId : '';
        this.id = object ? object.id : '';
    }


    public toJSON() {

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