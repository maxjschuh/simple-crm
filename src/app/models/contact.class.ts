export class Contact {
    firstName: string;
    lastName: string;
    birthDate: number | undefined;
    email: string;
    street: string;
    houseNumber: string;
    zipCode: number | undefined;
    city: string;
    id: string;

    constructor(object?: any) {

        this.firstName = object ? object.firstName : '';
        this.lastName = object ? object.lastName : '';
        this.birthDate = object ? object.birthDate : undefined;
        this.email = object ? object.email : '';
        this.street = object ? object.street : '';
        this.houseNumber = object ? object.houseNumber : '';
        this.zipCode = object ? object.zipCode : undefined;
        this.city = object ? object.city : '';
        this.id = object ? object.id : '';
    }

    public toJSON() {

        return {
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            email: this.email,
            street: this.street,
            houseNumber: this.houseNumber,
            zipCode: this.zipCode,
            city: this.city,
            id: this.id
        }
    }
}