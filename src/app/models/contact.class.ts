export class Contact {

    firstName: string;
    lastName: string;
    birthDate: number | undefined;
    email: string;
    phone: number | undefined;
    street: string;
    houseNumber: string;
    zipCode: number | undefined;
    city: string;
    id: string;
    imageUrl: string;

    constructor(contact?: any) {

        if (contact) {
            
            this.firstName = contact.firstName;
            this.lastName = contact.lastName;
            this.birthDate = contact.birthDate;
            this.email = contact.email ? contact.email : '';
            this.phone = contact.phone ? contact.phone : undefined;
            this.street = contact.street ? contact.street : '';
            this.houseNumber = contact.houseNumber ? contact.houseNumber : '';
            this.zipCode = contact.zipCode ? contact.zipCode : undefined;
            this.city = contact.city ? contact.city : '';
            this.id = contact.id ? contact.id : '';
            this.imageUrl = contact.imageUrl ? contact.imageUrl : '';

        } else {

            this.firstName = '';
            this.lastName = '';
            this.birthDate = undefined;
            this.email = '';
            this.phone = undefined;
            this.street = '';
            this.houseNumber = '';
            this.zipCode = undefined;
            this.city = '';
            this.id = '';
            this.imageUrl = '';
        }
    }


    public toJSON(): object {

        return {
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate ? this.birthDate : '',
            email: this.email,
            phone: this.phone ? this.phone : '',
            street: this.street,
            houseNumber: this.houseNumber,
            zipCode: this.zipCode ? this.zipCode : '',
            city: this.city,
            id: this.id,
            imageUrl: this.imageUrl
        }
    }
}