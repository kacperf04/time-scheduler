export interface Availability {
    id: number;
    employee_id: number;
    date: string;
    start_hour: number;
    end_hour: number;
    priority: number;
};

export interface User {
    name: string; 
    is_admin: boolean; 
    email: string
};

export enum EmployeeRole {
    MANAGER = "manager",
    STAFF = "staff",
    WAREHOUSE = "warehouse",
    SECURITY = "security",
};

export interface DemandSlot {
    date: string,
    start_time: number,
    end_time: number,
    required_role: EmployeeRole,
    required_employees: number
};

export interface Demand {
    start_date: string,
    end_date: string,
    is_posted: boolean,
    slots: Array<DemandSlot>
};

export enum DemandSlotActionType {
    VIEW = "view",
    EDIT = "edit"
}