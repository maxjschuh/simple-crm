export class Transaction {

    date: number | undefined;
    title: string;
    description: string;
    closedBy: string;
    closedyById: string;
    amount: number | undefined;
    type: 'Sale' | 'Refund' | 'Purchase' | '';
    payer: string;
    recipient: string;
    payerId: string;
    recipientId: string;
    id: string;


    constructor(object?: any) {
        this.date = object ? object.date : undefined;
        this.title = object ? object.title : '';
        this.description = object ? object.description : '';
        this.closedBy = object ? object.closedBy : '';
        this.closedyById = object ? object.closedyById : '';
        this.amount = object ? object.amount : undefined;
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
            closedyById: this.closedyById,
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