export class Employee {

    // *field is required in all forms, i.e. must always contain a truthy value
    firstName: string; // *
    lastName: string; // *
    birthDate: number | undefined;
    email: string; // *
    phone: number | undefined;
    department: string;
    position: string;
    supervisor: string;
    supervisorId: string; //is '' when supervisor is not in database
    id: string;
    imageUrl: string; //is '' when employee has no image

    constructor(employee?: any) {

        if (employee) {

            this.firstName = employee.firstName;
            this.lastName = employee.lastName;
            this.birthDate = employee.birthDate;
            this.email = employee.email ? employee.email : '';
            this.phone = employee.phone ? employee.phone : undefined;
            this.department = employee.department ? employee.department : '';
            this.position = employee.position ? employee.position : '';
            this.supervisor = employee.supervisor ? employee.supervisor : '';
            this.supervisorId = employee.supervisorId ? employee.supervisorId : '';
            this.id = employee.id ? employee.id : '';
            this.imageUrl = employee.imageUrl ? employee.imageUrl : '';

        } else {

            this.firstName = '';
            this.lastName = '';
            this.birthDate = undefined;
            this.email = '';
            this.phone = undefined;
            this.department = '';
            this.position = '';
            this.supervisor = '';
            this.supervisorId = '';
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
            department: this.department,
            position: this.position,
            supervisor: this.supervisor,
            supervisorId: this.supervisorId,
            id: this.id,
            imageUrl: this.imageUrl
        }
    }
}