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

    constructor(object?: any) {

        if (object) {
            
            this.firstName = object.firstName;
            this.lastName = object.lastName;
            this.birthDate = object.birthDate;
            this.email = object.email ? object.email : '';
            this.phone = object.phone ? object.phone : undefined;
            this.street = object.street ? object.street : '';
            this.houseNumber = object.houseNumber ? object.houseNumber : '';
            this.zipCode = object.zipCode ? object.zipCode : undefined;
            this.city = object.city ? object.city : '';
            this.id = object.id ? object.id : '';

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
        }
    }


    public toJSON(): object {

        return {
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            email: this.email,
            phone: this.phone ? this.phone : '',
            street: this.street,
            houseNumber: this.houseNumber,
            zipCode: this.zipCode ? this.zipCode : '',
            city: this.city,
            id: this.id
        }
    }
}