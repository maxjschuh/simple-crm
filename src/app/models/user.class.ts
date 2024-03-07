export class User {
    firstName: string;
    lastName: string;
    birthDate: number | undefined;
    street: string;
    houseNumber: string;
    zipCode: number | undefined;
    city: string;

    constructor(object?: any) {

        this.firstName = object ? object.firstName : '';
        this.lastName = object ? object.lastName : '';
        this.birthDate = object ? object.birthDate : undefined;
        this.street = object ? object.street : '';
        this.houseNumber = object ? object.houseNumber : '';
        this.zipCode = object ? object.zipCode : undefined;
        this.city = object ? object.city : '';

    }
}