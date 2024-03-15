export class Employee {
    firstName: string;
    lastName: string;
    birthDate: number | undefined;
    email: string;
    phone: number;
    department: string;
    position: string;
    supervisor: string;
    supervisorId: string;
    closingsIds: string[];
    id: string;

    constructor(object?: any) {

        this.firstName = object ? object.firstName : '';
        this.lastName = object ? object.lastName : '';
        this.birthDate = object ? object.birthDate : undefined;
        this.email = object ? object.email : '';
        this.phone = object ? object.phone : '';
        this.department = object ? object.department : '';
        this.position = object ? object.position : '';
        this.supervisor = object ? object.supervisor : '';
        this.supervisorId = object ? object.supervisorId : '';
        this.closingsIds = object ? object.closingsIds : [];        
        this.id = object ? object.id : '';
    }

    public toJSON() {

        return {
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            email: this.email,
            phone: this.phone,
            department: this.department,
            position: this.position,
            supervisor: this.supervisor,
            supervisorId: this.supervisorId,
            closingsIds: this.closingsIds,
            id: this.id
        }
    }
}